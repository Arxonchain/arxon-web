#!/usr/bin/env bash
# =============================================================================
# Arxon — Supabase Migration Setup Script
# =============================================================================
# Run this once after creating your new Supabase project.
# Usage: bash scripts/setup-supabase.sh
# =============================================================================

set -e  # exit on any error

# ── Colors ────────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo ""
echo -e "${BOLD}${BLUE}╔══════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}${BLUE}║     Arxon — Supabase Migration Setup         ║${NC}"
echo -e "${BOLD}${BLUE}╚══════════════════════════════════════════════╝${NC}"
echo ""

# ── Step 1: Check Supabase CLI ────────────────────────────────────────────────
echo -e "${YELLOW}[1/5] Checking Supabase CLI...${NC}"
if ! command -v supabase &> /dev/null; then
  echo -e "${RED}✗ Supabase CLI not found.${NC}"
  echo ""
  echo "Install it with one of:"
  echo "  npm install -g supabase"
  echo "  brew install supabase/tap/supabase"
  echo "  https://supabase.com/docs/guides/cli/getting-started"
  exit 1
fi
echo -e "${GREEN}✓ Supabase CLI found: $(supabase --version)${NC}"

# ── Step 2: Check .env ────────────────────────────────────────────────────────
echo ""
echo -e "${YELLOW}[2/5] Checking .env file...${NC}"
if [ ! -f ".env" ]; then
  echo -e "${RED}✗ .env file not found.${NC}"
  echo "  Copy .env.example → .env and fill in your Supabase credentials."
  exit 1
fi

source .env

if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_PUBLISHABLE_KEY" ]; then
  echo -e "${RED}✗ .env is missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY.${NC}"
  echo "  Open .env and fill in both values from your Supabase project's Settings → API."
  exit 1
fi
echo -e "${GREEN}✓ .env looks good: $VITE_SUPABASE_URL${NC}"

# ── Step 3: Extract project ref from URL ──────────────────────────────────────
echo ""
echo -e "${YELLOW}[3/5] Extracting project ref from URL...${NC}"
PROJECT_REF=$(echo "$VITE_SUPABASE_URL" | sed 's|https://||' | sed 's|.supabase.co||')
echo -e "${GREEN}✓ Project ref: $PROJECT_REF${NC}"

# ── Step 4: Supabase login & link ─────────────────────────────────────────────
echo ""
echo -e "${YELLOW}[4/5] Linking to your Supabase project...${NC}"
echo "You may be prompted to log in to Supabase in your browser."
echo ""
supabase login

echo ""
supabase link --project-ref "$PROJECT_REF"
echo -e "${GREEN}✓ Linked to project: $PROJECT_REF${NC}"

# ── Step 5: Push migrations ───────────────────────────────────────────────────
echo ""
echo -e "${YELLOW}[5/5] Pushing database migrations...${NC}"
echo "This will create all tables, RLS policies, and triggers."
echo ""
supabase db push

echo ""
echo -e "${BOLD}${GREEN}╔══════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}${GREEN}║   ✓ Migration complete!                      ║${NC}"
echo -e "${BOLD}${GREEN}╚══════════════════════════════════════════════╝${NC}"
echo ""
echo "Tables created:"
echo "  • waitlist"
echo "  • user_roles (admin/user roles)"
echo "  • investor_submissions"
echo "  • ambassador_applications"
echo "  • ambassador_submissions"
echo ""
echo -e "${BOLD}Next steps:${NC}"
echo "  1. Go to Supabase Dashboard → Authentication → URL Configuration"
echo "  2. Set Site URL to: https://arxon.io"
echo "  3. Add redirect URL: https://arxon.io/**"
echo "  4. Push this code to GitHub"
echo "  5. Follow MIGRATION_GUIDE.md → Step 6 to deploy on Cloudflare Pages"
echo ""
