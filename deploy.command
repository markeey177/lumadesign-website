#!/bin/bash
cd "$(dirname "$0")"

# Set CLOUDFLARE_API_TOKEN as an environment variable before running this script,
# or export it in your shell profile. Do NOT hardcode the token here.
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
  echo "❌ CLOUDFLARE_API_TOKEN is not set. Run:"
  echo "   export CLOUDFLARE_API_TOKEN=your_token_here"
  echo "   then re-run this script."
  read -p "Press Enter to close..."
  exit 1
fi

echo "▶ Checking for wrangler..."
if ! command -v wrangler &>/dev/null; then
  echo "▶ Installing wrangler (one-time, may ask for your Mac password)..."
  sudo npm install -g wrangler
fi

echo "▶ Deploying lumadesign to Cloudflare..."
wrangler deploy

echo ""
echo "✅ Done! lumadesign.ca should be live in ~30 seconds."
echo ""
read -p "Press Enter to close..."
