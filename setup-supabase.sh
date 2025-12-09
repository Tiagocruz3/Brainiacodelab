#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║      Syntax Stage - Supabase Setup Script           ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo -e "${RED}✗ Error: .env.local file not found!${NC}"
    echo -e "${YELLOW}Please create .env.local with your Supabase credentials.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Found .env.local configuration${NC}"
echo ""

# Load environment variables
source .env.local

# Check if variables are set
if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    echo -e "${RED}✗ Error: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Supabase credentials loaded${NC}"
echo -e "${BLUE}Project URL: ${VITE_SUPABASE_URL}${NC}"
echo ""

echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}  DATABASE SCHEMA SETUP${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"
echo ""
echo -e "To complete the setup, you need to run the database schema in Supabase:"
echo ""
echo -e "${BLUE}1.${NC} Go to your Supabase project dashboard:"
echo -e "   ${GREEN}https://supabase.com/dashboard/project/aldlkgfejbodxbqcclcv${NC}"
echo ""
echo -e "${BLUE}2.${NC} Navigate to: ${YELLOW}SQL Editor${NC}"
echo ""
echo -e "${BLUE}3.${NC} Copy the contents of: ${YELLOW}supabase-schema.sql${NC}"
echo ""
echo -e "${BLUE}4.${NC} Paste into the SQL Editor and click ${GREEN}\"Run\"${NC}"
echo ""
echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"
echo ""
echo -e "The schema will create:"
echo -e "  ${GREEN}✓${NC} profiles table (user information)"
echo -e "  ${GREEN}✓${NC} projects table (user projects)"
echo -e "  ${GREEN}✓${NC} chats table (chat history)"
echo -e "  ${GREEN}✓${NC} files table (project files)"
echo -e "  ${GREEN}✓${NC} Row Level Security policies"
echo -e "  ${GREEN}✓${NC} Automatic triggers and functions"
echo ""
echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}After running the schema:${NC}"
echo -e "  1. Start the development server: ${GREEN}pnpm dev${NC}"
echo -e "  2. Click ${YELLOW}\"Sign in\"${NC} in the app header"
echo -e "  3. Create an account and start coding!"
echo ""
echo -e "${GREEN}✨ Setup complete! Happy coding! ✨${NC}"
echo ""

