const { Document, Packer, Paragraph, TextRun, HeaderLevel, HeadingLevel, AlignmentType,
  LevelFormat, ExternalHyperlink, BorderStyle } = require('docx');
const fs = require('fs');

const PAGE = {
  size: { width: 12240, height: 15840 },
  margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
};

const STYLES = {
  default: { document: { run: { font: "Arial", size: 22 } } },
  paragraphStyles: [
    { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { size: 32, bold: true, font: "Arial", color: "1A1A1A" },
      paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
    { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { size: 26, bold: true, font: "Arial", color: "1A1A1A" },
      paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 } },
  ]
};

function numbering() {
  return {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•",
        alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
        alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  };
}

function p(text, opts = {}) {
  return new Paragraph({ spacing: { after: 160 }, children: [new TextRun({ text, ...opts })] });
}
function h1(text) { return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(text)] }); }
function h2(text) { return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(text)] }); }
function bullet(text) { return new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 80 }, children: [new TextRun(text)] }); }
function num(text) { return new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 80 }, children: [new TextRun(text)] }); }
function italic(text) { return new Paragraph({ spacing: { after: 160 }, children: [new TextRun({ text, italics: true, color: "555555" })] }); }
function hr() { return new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC", space: 1 } }, spacing: { after: 240 } }); }

const LAST_UPDATED = "June 21, 2026";

// ============ TERMS OF SERVICE ============
const tos = new Document({
  styles: STYLES,
  numbering: numbering(),
  sections: [{
    properties: { page: PAGE },
    children: [
      h1("Terms of Service"),
      italic(`Last updated: ${LAST_UPDATED}`),
      p("These Terms of Service (“Terms”) govern your use of the website located at [YOUR WEBSITE URL] (the “Site”) and the services offered by [YOUR BUSINESS NAME] (“we,” “us,” or “our”), a business operating in [PROVINCE], Canada. By accessing the Site or engaging our services, you (“you” or “Client”) agree to be bound by these Terms."),

      h2("1. Services"),
      p("We provide [DESCRIBE YOUR SERVICES — e.g., consulting, design, coaching, etc.]. The specific scope, deliverables, fees, and timeline for any engagement will be set out in a separate proposal, quote, or service agreement (“Engagement”), which forms part of these Terms."),

      h2("2. Eligibility"),
      p("By using the Site or engaging our services, you confirm that you are at least 18 years old and have the legal authority to enter into these Terms on your own behalf or on behalf of an organization you represent."),

      h2("3. Fees and Payment"),
      bullet("Fees for services will be quoted in advance and confirmed in writing (e.g., invoice, proposal, or agreement)."),
      bullet("Unless otherwise agreed, invoices are due within 15 days of issue."),
      bullet("Late payments may be subject to a service interruption or a late fee of up to 2% per month, where permitted by law."),
      bullet("All fees are in Canadian dollars (CAD) unless stated otherwise, and are exclusive of applicable taxes (e.g., GST/HST), which will be added where required."),

      h2("4. Cancellations and Refunds"),
      p("[DESCRIBE YOUR POLICY — e.g., “Either party may terminate an Engagement with 14 days’ written notice. Fees for work already performed are non-refundable. Deposits are non-refundable except where required by law.” Adjust to match how you actually operate.]"),

      h2("5. Intellectual Property"),
      p("Unless otherwise agreed in writing, all content on the Site — including text, graphics, logos, and images — is owned by [YOUR BUSINESS NAME] or its licensors and is protected by Canadian and international copyright and trademark law. You may not reproduce, distribute, or create derivative works from this content without our written permission."),
      p("Upon full payment for a completed Engagement, ownership of final deliverables created specifically for you will transfer to you, except for our pre-existing tools, templates, methodologies, and know-how, which we retain ownership of and may reuse for other clients."),

      h2("6. Limitation of Liability"),
      p("To the fullest extent permitted by applicable law:"),
      bullet("The Site and our services are provided “as is” and “as available,” without warranties of any kind, express or implied, including warranties of merchantability, fitness for a particular purpose, or non-infringement."),
      bullet("We will not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenue, arising from your use of the Site or our services."),
      bullet("Our total aggregate liability arising out of or related to these Terms or any Engagement will not exceed the total fees paid by you to us in the six (6) months preceding the event giving rise to the claim."),
      p("Nothing in these Terms limits liability where such limitation is prohibited by applicable Canadian or provincial law (for example, liability for gross negligence, wilful misconduct, or death or personal injury caused by negligence)."),

      h2("7. Indemnification"),
      p("You agree to indemnify and hold harmless [YOUR BUSINESS NAME], its owners, employees, and contractors from any claims, damages, losses, or expenses (including reasonable legal fees) arising from your breach of these Terms or misuse of the Site or our services."),

      h2("8. Third-Party Links"),
      p("The Site may contain links to third-party websites. We do not control and are not responsible for the content, privacy practices, or terms of any third-party site."),

      h2("9. Governing Law and Disputes"),
      p("These Terms are governed by the laws of the Province of [YOUR PROVINCE] and the federal laws of Canada applicable therein, without regard to conflict-of-law principles. You agree that any dispute arising from these Terms or our services will be subject to the exclusive jurisdiction of the courts located in [YOUR PROVINCE]."),
      p("[OPTIONAL: Consider adding a mediation/arbitration clause here if you'd prefer to avoid court — a lawyer can help draft this.]"),

      h2("10. Changes to These Terms"),
      p("We may update these Terms from time to time. Changes will be posted on this page with an updated “Last updated” date. Continued use of the Site after changes are posted constitutes acceptance of the revised Terms."),

      h2("11. Contact"),
      p("Questions about these Terms can be directed to:"),
      p("[YOUR BUSINESS NAME]"),
      p("[YOUR EMAIL ADDRESS]"),
      p("[YOUR MAILING ADDRESS, IF APPLICABLE]"),

      hr(),
      italic("This is a starting template, not a finished legal document. Bracketed fields must be completed, and a lawyer licensed in your province should review this before publishing it, especially the liability and dispute clauses."),
    ]
  }]
});

// ============ PRIVACY POLICY ============
const privacy = new Document({
  styles: STYLES,
  numbering: numbering(),
  sections: [{
    properties: { page: PAGE },
    children: [
      h1("Privacy Policy"),
      italic(`Last updated: ${LAST_UPDATED}`),
      p("[YOUR BUSINESS NAME] (“we,” “us,” or “our”) is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard personal information in connection with the website located at [YOUR WEBSITE URL] (the “Site”) and our services. We comply with the Personal Information Protection and Electronic Documents Act (PIPEDA) and applicable provincial privacy legislation."),

      h2("1. Privacy Officer"),
      p("We have designated a Privacy Officer responsible for our compliance with this Policy. You can reach our Privacy Officer at:"),
      p("[NAME OR ROLE], [YOUR EMAIL ADDRESS]"),

      h2("2. Information We Collect"),
      p("We may collect the following types of personal information:"),
      bullet("Contact information you provide (name, email address, phone number, mailing address)"),
      bullet("Information submitted through contact forms, inquiries, or booking requests"),
      bullet("Billing and payment information related to services purchased"),
      bullet("Technical information collected automatically, such as IP address, browser type, device information, and pages visited (via cookies or analytics tools — see Section 6)"),
      bullet("Any other information you voluntarily provide to us"),

      h2("3. How We Use Your Information"),
      p("We use personal information only for the purposes for which it was collected, including to:"),
      bullet("Respond to inquiries and provide requested services"),
      bullet("Process payments and manage client relationships"),
      bullet("Send service-related communications"),
      bullet("Send marketing communications, where you have provided consent (see Section 4)"),
      bullet("Improve the Site and our services"),
      bullet("Comply with legal and regulatory obligations"),
      p("We obtain meaningful consent before collecting, using, or disclosing personal information, and we identify the purpose of collection at or before the time it occurs. If we want to use your information for a new purpose, we will seek your consent first."),

      h2("4. Email Marketing and CASL Compliance"),
      p("If we send you commercial electronic messages (such as marketing emails), we comply with Canada's Anti-Spam Legislation (CASL). This means:"),
      bullet("We will only send marketing emails with your express consent, or where implied consent applies (e.g., an existing business relationship)."),
      bullet("Every commercial message will identify who sent it, include our contact information, and provide a free and easy way to unsubscribe."),
      bullet("You may withdraw your consent at any time by using the unsubscribe link or contacting us directly."),

      h2("5. Disclosure of Information"),
      p("We do not sell personal information. We may share personal information with:"),
      bullet("Service providers who help us operate the Site or deliver services (e.g., payment processors, email platforms, hosting providers), under contractual obligations to protect your data"),
      bullet("Professional advisors (e.g., accountants, lawyers) where necessary"),
      bullet("Authorities, where required by law or to protect our legal rights"),
      p("Where service providers are located outside Canada, your information may be processed in another jurisdiction and subject to that jurisdiction's laws."),

      h2("6. Cookies and Analytics"),
      p("The Site may use cookies and similar technologies to improve functionality and understand how visitors use the Site (e.g., via analytics tools). You can control or disable cookies through your browser settings, though this may affect Site functionality."),

      h2("7. Data Retention and Security"),
      p("We retain personal information only as long as necessary to fulfill the purposes for which it was collected, or as required by law. We use reasonable physical, technical, and administrative safeguards appropriate to the sensitivity of the information to protect it against loss, theft, and unauthorized access."),

      h2("8. Your Rights"),
      p("Under PIPEDA and applicable provincial law, you have the right to:"),
      bullet("Access the personal information we hold about you"),
      bullet("Request correction of inaccurate or incomplete information"),
      bullet("Withdraw consent to our collection, use, or disclosure of your information (subject to legal or contractual restrictions)"),
      bullet("File a complaint about our handling of your personal information"),
      p("To exercise these rights, contact our Privacy Officer using the details in Section 1. If you are not satisfied with our response, you may contact the Office of the Privacy Commissioner of Canada (priv.gc.ca) or your provincial privacy regulator."),

      h2("9. Children's Privacy"),
      p("The Site is not directed at children, and we do not knowingly collect personal information from individuals under 13 (or the applicable age in your province) without parental consent."),

      h2("10. Changes to This Policy"),
      p("We may update this Privacy Policy from time to time. Changes will be posted here with an updated “Last updated” date."),

      h2("11. Contact Us"),
      p("[YOUR BUSINESS NAME]"),
      p("[YOUR EMAIL ADDRESS]"),
      p("[YOUR MAILING ADDRESS, IF APPLICABLE]"),

      hr(),
      italic("This is a starting template, not a finished legal document. Bracketed fields must be completed to match your actual data practices, and a lawyer should review this before publishing, particularly if you collect sensitive data or operate in Quebec (which has additional requirements under Law 25)."),
    ]
  }]
});

// ============ LEGAL SETUP GUIDE ============
const guide = new Document({
  styles: STYLES,
  numbering: numbering(),
  sections: [{
    properties: { page: PAGE },
    children: [
      h1("Legal Setup Guide for Your Website (Canada)"),
      italic(`Prepared: ${LAST_UPDATED} — for a Canadian service business`),
      p("This guide summarizes the practical steps to put your website and business on solid legal footing. It is general information, not legal advice — use it to understand your options and prepare questions for a lawyer or accountant, not as a substitute for one."),

      h2("1. Business Structure: Sole Proprietorship vs. Incorporation"),
      p("This is the single biggest lever for personal liability protection."),
      h2("Sole Proprietorship"),
      bullet("Simple and inexpensive to set up; in some provinces, no registration needed if operating under your own legal name"),
      bullet("You are personally liable for all business debts and lawsuits — personal assets (home, savings) are at risk"),
      bullet("Business income is taxed at your personal rate"),
      h2("Incorporation"),
      bullet("Creates a separate legal entity — the “corporate veil” shields personal assets from most business debts and legal claims, as long as it's properly maintained (separate bank account, proper records, no commingling of funds)"),
      bullet("Access to lower corporate tax rates on active business income (Small Business Deduction on the first $500,000)"),
      bullet("More setup cost and ongoing administration: annual filings, corporate records, potentially an accountant"),
      bullet("Can incorporate federally (via Corporations Canada) or provincially, depending on where you plan to operate"),
      p("Rule of thumb often cited: consider incorporating once revenue is consistently in the $70,000–$100,000+ range, once you want liability protection for a specific risk (e.g., client contracts, advice-based services), or once you want to raise investment or sign larger contracts. Many businesses start as a sole proprietorship and incorporate later — it's not an irreversible decision."),
      p("Action: talk to an accountant or business lawyer about whether incorporating now makes sense given your revenue, risk exposure, and the nature of your services."),

      h2("2. Business Name Registration"),
      bullet("If operating under a name other than your own legal name, you generally need to register that business name (“doing business as”) with your province"),
      bullet("If incorporating, the corporate name registration covers this in most provinces"),
      bullet("Check name availability via a NUANS report before registering or incorporating, to avoid conflicts with existing businesses"),

      h2("3. Business Insurance"),
      p("Insurance is a practical complement to (not a substitute for) good contracts. For a service business, consider:"),
      bullet("Professional liability / errors & omissions (E&O) insurance — covers claims that your advice or service caused a client financial loss"),
      bullet("General commercial liability insurance — covers third-party bodily injury or property damage claims"),
      bullet("Cyber liability insurance — if you handle client data, covers breach response and related costs"),

      h2("4. Contracts and Client Agreements"),
      p("Your website Terms of Service cover general use of the site, but for paid engagements you should also have:"),
      bullet("A signed service agreement or statement of work for each client engagement, with clear scope, deliverables, payment terms, and a liability cap"),
      bullet("A clear statement of who owns the work product and intellectual property created during the engagement"),
      bullet("A defined process for handling disputes, cancellations, and late payment"),
      p("Action: have a lawyer draft or review a standard service agreement template you can reuse with every client — this is usually more valuable than the website Terms of Service alone."),

      h2("5. Intellectual Property Protection"),
      h2("Copyright"),
      bullet("Original content (website copy, photos, designs, videos) is automatically protected by copyright in Canada from the moment it's created — no registration required"),
      bullet("Add a copyright notice in your site footer, e.g.: “© 2026 [Your Business Name]. All rights reserved.”"),
      bullet("Optional: register your copyright with the Canadian Intellectual Property Office (CIPO) for stronger evidence of ownership in a dispute"),
      h2("Trademark"),
      bullet("If your business name, logo, or tagline is an important brand asset, consider registering it as a trademark with CIPO — this gives you exclusive rights to use it nationally and is the strongest protection against copycats"),
      bullet("Before launching, search the Canadian Trademarks Database to confirm your name/logo doesn't conflict with an existing registered mark"),
      h2("Using Others' Content"),
      bullet("Don't use stock photos, fonts, music, or text you don't have a license for — this is one of the most common sources of legal complaints against small business websites"),
      bullet("Keep records of licenses for any purchased images, fonts, or templates"),

      h2("6. Accessibility"),
      p("Depending on your province (e.g., Ontario's AODA, Quebec's requirements), there may be accessibility standards for websites, especially as your business grows. Following WCAG 2.1 AA guidelines is a reasonable baseline even if not yet legally required for a small business."),

      h2("7. Quick Checklist"),
      num("Decide: sole proprietorship or incorporation (talk to an accountant)"),
      num("Register your business name (or incorporate, which covers this)"),
      num("Publish a Terms of Service and Privacy Policy on your website"),
      num("Set up a standard client service agreement with a liability cap"),
      num("Add a copyright notice to your site footer"),
      num("Consider trademarking your business name/logo if it's central to your brand"),
      num("Get professional liability insurance quotes"),
      num("Confirm you have licenses for all images, fonts, and content on your site"),
      num("Set up a CASL-compliant process for any marketing emails (consent + unsubscribe)"),
      num("Book a short consultation with a business lawyer to review your Terms of Service, Privacy Policy, and client agreement before launch"),

      hr(),
      italic("This guide is general information based on current Canadian federal law and common provincial practice — it is not legal advice and does not account for your specific province's rules (e.g., Quebec's Law 25 privacy requirements differ from PIPEDA in some respects). A licensed lawyer or accountant should review your specific situation."),
    ]
  }]
});

Promise.all([
  Packer.toBuffer(tos).then(b => fs.writeFileSync("Terms_of_Service.docx", b)),
  Packer.toBuffer(privacy).then(b => fs.writeFileSync("Privacy_Policy.docx", b)),
  Packer.toBuffer(guide).then(b => fs.writeFileSync("Legal_Setup_Guide_Canada.docx", b)),
]).then(() => console.log("done"));
