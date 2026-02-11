#!/bin/bash

# KoSocial White-Label Site Deployment Script
# Usage: ./deploy-kosocial.sh

set -e

echo "🚀 Starting KoSocial deployment..."

# Configuration
APP_DIR="/var/www/kosocial"
REPO_URL="https://github.com/yourusername/kosocial-bounceops-v1.git"
LOG_DIR="$APP_DIR/logs"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📂 Setting up directories...${NC}"
sudo mkdir -p $APP_DIR
sudo mkdir -p $LOG_DIR
sudo chown -R $USER:$USER $APP_DIR

echo -e "${YELLOW}📥 Pulling latest code...${NC}"
if [ -d "$APP_DIR/.git" ]; then
  cd $APP_DIR
  git pull origin main
else
  git clone $REPO_URL $APP_DIR
  cd $APP_DIR
fi

echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm ci --production=false

echo -e "${YELLOW}🏗️  Building application...${NC}"
npm run build

echo -e "${YELLOW}🔄 Restarting PM2 process...${NC}"
pm2 delete kosocial-site 2>/dev/null || true
pm2 start ecosystem.config.cjs
pm2 save

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "${GREEN}📊 Application running on port 8081${NC}"
echo -e "${GREEN}📝 Logs: $LOG_DIR${NC}"
echo ""
echo "Run 'pm2 logs kosocial-site' to view logs"
echo "Run 'pm2 status' to check status"
