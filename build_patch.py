import json, re

SHARED_HEAD = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>{title} — LumaDesign</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"/>
  <style>
    *, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}
    :root {{
      --black: #09090b; --white: #ffffff; --gray-50: #fafafa; --gray-100: #f4f4f5;
      --gray-200: #e4e4e7; --gray-400: #a1a1aa; --gray-500: #71717a; --gray-700: #3f3f46;
      --accent: #6366f1; --accent-light: #eef2ff; --accent-dark: #4f46e5;
    }}
    html {{ scroll-behavior: smooth; }}
    body {{ font-family: 'Inter', sans-serif; color: var(--black); background: var(--white); line-height: 1.65; }}
    nav {{
      position: fixed; top: 0; left: 0; right: 0; z-index: 200;
      display: flex; align-items: center; justify-content: space-between;
      padding: 1rem 5%; background: rgba(255,255,255,0.92);
      backdrop-filter: blur(16px); box-shadow: 0 1px 0 var(--gray-200);
    }}
    .logo {{ font-size: 1.4rem; font-weight: 800; letter-spacing: -0.5px; color: var(--black); text-decoration: none; display: flex; align-items: center; gap: 0.4rem; }}
    .logo-dot {{ width: 8px; height: 8px; background: var(--accent); border-radius: 50%; }}
    .logo span {{ color: var(--accent); }}
    .nav-back {{ display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; font-weight: 500; color: var(--gray-500); text-decoration: none; transition: color 0.2s; }}
    .nav-back:hover {{ color: var(--accent); }}
    .legal-wrap {{ max-width: 760px; margin: 0 auto; padding: 9rem 5% 5rem; }}
    .legal-wrap .legal-tag {{ display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--accent); margin-bottom: 0.75rem; }}
    .legal-tag::before {{ content: ''; width: 16px; height: 2px; background: var(--accent); border-radius: 1px; }}
    .legal-wrap h1 {{ font-size: clamp(1.9rem, 3.2vw, 2.5rem); font-weight: 800; letter-spacing: -0.75px; margin-bottom: 0.5rem; }}
    .legal-updated {{ font-size: 0.85rem; color: var(--gray-400); margin-bottom: 2.5rem; }}
    .legal-wrap h2 {{ font-size: 1.2rem; font-weight: 700; margin-top: 2.25rem; margin-bottom: 0.75rem; letter-spacing: -0.25px; }}
    .legal-wrap p {{ font-size: 0.95rem; color: var(--gray-700); margin-bottom: 1rem; }}
    .legal-wrap ul {{ margin: 0 0 1rem 1.25rem; }}
    .legal-wrap li {{ font-size: 0.95rem; color: var(--gray-700); margin-bottom: 0.5rem; }}
    .legal-wrap a {{ color: var(--accent); text-decoration: none; }}
    .legal-wrap a:hover {{ text-decoration: underline; }}
    .legal-contact {{ background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: 14px; padding: 1.5rem; margin-top: 2rem; }}
    .legal-contact p {{ margin-bottom: 0.35rem; }}
    footer {{ background: var(--black); padding: 2.5rem 5%; }}
    .footer-bottom {{ max-width: 1120px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; }}
    .footer-bottom p {{ font-size: 0.8rem; color: #52525b; }}
    .footer-bottom a {{ color: #52525b; text-decoration: none; font-size: 0.8rem; transition: color 0.2s; margin-left: 1.5rem; }}
    .footer-bottom a:hover {{ color: var(--white); }}
    @media (max-width: 600px) {{ .legal-wrap {{ padding: 7.5rem 6% 3rem; }} .footer-bottom {{ flex-direction: column; align-items: flex-start; }} .footer-bottom a {{ margin-left: 0; margin-right: 1.25rem; }} }}
  </style>
</head>
<body>

<nav>
  <a href="/index.html" class="logo"><div class="logo-dot"></div>luma<span>design</span></a>
  <a href="/index.html" class="nav-back"><i class="fa-solid fa-arrow-left"></i> Back to home</a>
</nav>

<div class="legal-wrap">
{body}
</div>

<footer>
  <div class="footer-bottom">
    <p>© 2026 LumaDesign. All rights reserved.</p>
    <div>
      <a href="/privacy.html">Privacy Policy</a>
      <a href="/terms.html">Terms of Service</a>
      <a href="/contact.html">Contact</a>
    </div>
  </div>
</footer>

</body>
</html>
"""

TERMS_BODY = """  <div class="legal-tag">Legal</div>
  <h1>Terms of Service</h1>
  <p class="legal-updated">Last updated: June 21, 2026</p>

  <p>These Terms of Service (“Terms”) govern your use of the website located at lumadesign.ca (the “Site”) and the web design services offered by LumaDesign (“we,” “us,” or “our”), operated by Miguel Barrite as a sole proprietorship based in British Columbia, Canada. By using the Site or engaging our services, you (“you” or “Client”) agree to these Terms.</p>

  <h2>1. Our Services</h2>
  <p>LumaDesign designs and builds custom websites for small businesses. The scope, deliverables, and price for any specific project are confirmed with you directly (by email or during your preview call) before any work begins or any invoice is issued.</p>

  <h2>2. How Engagements Work</h2>
  <p>You submit an inquiry through our contact form. We build a free working preview of your site before discussing price. If you choose to move forward, we'll confirm the scope and price in writing by email, then send an invoice once the agreed milestone is reached. We do not collect payment through the Site — all invoicing happens directly over email.</p>

  <h2>3. Fees and Payment</h2>
  <ul>
    <li>Fees are quoted and confirmed by email before work begins, and invoiced separately — not collected through this website.</li>
    <li>All fees are in Canadian dollars (CAD) and exclusive of applicable taxes (e.g., GST), which will be added where required.</li>
    <li>Invoices are due within 15 days of issue unless otherwise agreed in writing.</li>
  </ul>

  <h2>4. Cancellations</h2>
  <p>If you decide not to move forward after seeing your free preview, you owe us nothing. Once a paid engagement has begun, either party may end it with written notice (email is sufficient); fees for work already completed are non-refundable.</p>

  <h2>5. Intellectual Property</h2>
  <p>Until an invoice for a completed project is paid in full, the website preview and any deliverables remain the property of LumaDesign. Upon full payment, ownership of the final website built specifically for you transfers to you, except for any pre-existing tools, code snippets, or templates we reuse across projects, which we retain ownership of.</p>
  <p>Content on this Site itself — including text, graphics, and the LumaDesign name and logo — is owned by LumaDesign and may not be copied or reused without permission.</p>

  <h2>6. Limitation of Liability</h2>
  <p>To the fullest extent permitted by law, the Site and our services are provided “as is,” without warranties of any kind. We are not liable for indirect, incidental, or consequential damages arising from your use of the Site or our services. Our total liability for any claim related to a project will not exceed the total fees you paid us for that project.</p>

  <h2>7. Governing Law</h2>
  <p>These Terms are governed by the laws of the Province of British Columbia and the federal laws of Canada applicable therein. Any dispute will be subject to the exclusive jurisdiction of the courts of British Columbia.</p>

  <h2>8. Changes to These Terms</h2>
  <p>We may update these Terms occasionally. Changes will be posted on this page with a new “Last updated” date.</p>

  <div class="legal-contact">
    <p><strong>Questions about these Terms?</strong></p>
    <p>LumaDesign</p>
    <p>info@lumadesign.ca</p>
  </div>
"""

PRIVACY_BODY = """  <div class="legal-tag">Legal</div>
  <h1>Privacy Policy</h1>
  <p class="legal-updated">Last updated: June 21, 2026</p>

  <p>LumaDesign (“we,” “us,” or “our”), operated by Miguel Barrite as a sole proprietorship in British Columbia, Canada, is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and protect information in connection with lumadesign.ca (the “Site”), in compliance with Canada's Personal Information Protection and Electronic Documents Act (PIPEDA).</p>

  <h2>1. Information We Collect</h2>
  <p>When you submit our contact form, we collect the information you provide: your name, email address, phone number (optional), business name, project details, and any message you write. We do not collect payment information through the Site — we don't process payments here at all; invoicing happens directly over email after we've agreed on a project.</p>

  <h2>2. How We Use Your Information</h2>
  <ul>
    <li>To respond to your inquiry and build your free website preview</li>
    <li>To follow up about your project by email or phone</li>
    <li>To send you an invoice if you decide to move forward with a paid project</li>
  </ul>
  <p>We only use your information for the purpose you gave it to us, and we don't sell or rent it to anyone.</p>

  <h2>3. How Your Information Is Handled</h2>
  <p>Our contact form is processed through Web3Forms, a third-party form delivery service, which forwards your submission to our email inbox. We don't store form submissions in a separate database — they live in our email, like any other client correspondence.</p>

  <h2>4. Email Communication and CASL</h2>
  <p>If we ever send you marketing or promotional emails (as opposed to direct replies to your inquiry), we comply with Canada's Anti-Spam Legislation (CASL): we'll only do so with your consent, we'll identify ourselves clearly, and every message will include an easy way to unsubscribe.</p>

  <h2>5. Data Retention</h2>
  <p>We keep inquiry and project correspondence for as long as reasonably necessary for business and accounting purposes, then delete it. You can ask us to delete your information at any time (see Section 7).</p>

  <h2>6. Cookies</h2>
  <p>This Site does not currently use tracking cookies or analytics scripts. If that changes, this policy will be updated to reflect it.</p>

  <h2>7. Your Rights</h2>
  <p>Under PIPEDA, you can ask us what personal information we hold about you, request a correction, or ask us to delete it. To do so, just email us — we're a small, one-person operation, so you'll be talking directly to the person handling your data.</p>

  <h2>8. Changes to This Policy</h2>
  <p>We may update this Privacy Policy from time to time. Changes will be posted here with a new “Last updated” date.</p>

  <div class="legal-contact">
    <p><strong>Questions about your data?</strong></p>
    <p>LumaDesign — Miguel Barrite</p>
    <p>info@lumadesign.ca</p>
  </div>
"""

TERMS_HTML = SHARED_HEAD.format(title="Terms of Service", body=TERMS_BODY)
PRIVACY_HTML = SHARED_HEAD.format(title="Privacy Policy", body=PRIVACY_BODY)

# Load exact original worker.js
with open("worker_original.js", encoding="utf-8") as f:
    src = f.read()

orig_len = len(src)

# 1. Fix footer links in INDEX_HTML (literal text inside the JS string uses \" escapes)
old1 = r'<a href=\"#\">Privacy Policy</a>'
new1 = r'<a href=\"/privacy.html\">Privacy Policy</a>'
old2 = r'<a href=\"#\">Terms of Service</a>'
new2 = r'<a href=\"/terms.html\">Terms of Service</a>'

assert src.count(old1) == 1, f"old1 count={src.count(old1)}"
assert src.count(old2) == 1, f"old2 count={src.count(old2)}"
src = src.replace(old1, new1)
src = src.replace(old2, new2)

# 2. Build new JS string constants using json.dumps for correct escaping (valid JS string syntax)
privacy_js_literal = json.dumps(PRIVACY_HTML)
terms_js_literal = json.dumps(TERMS_HTML)

new_constants = (
    f"const PRIVACY_HTML = {privacy_js_literal};\n"
    f"const TERMS_HTML = {terms_js_literal};\n\n"
)

marker = "export default {"
assert src.count(marker) == 1
src = src.replace(marker, new_constants + marker)

# 3. Add routing before the 404 fallback
old_route = "    return new Response('Not found', { status: 404 });"
assert src.count(old_route) == 1
new_route = (
    "    if (path === '/privacy' || path === '/privacy.html') {\n"
    "      return new Response(PRIVACY_HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });\n"
    "    }\n"
    "    if (path === '/terms' || path === '/terms.html') {\n"
    "      return new Response(TERMS_HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });\n"
    "    }\n"
    + old_route
)
src = src.replace(old_route, new_route)

with open("worker_new.js", "w", encoding="utf-8") as f:
    f.write(src)

print("orig_len", orig_len, "new_len", len(src))

with open("privacy.html", "w", encoding="utf-8") as f:
    f.write(PRIVACY_HTML)
with open("terms.html", "w", encoding="utf-8") as f:
    f.write(TERMS_HTML)

print("done")
