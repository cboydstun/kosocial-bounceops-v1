#!/bin/bash

# KoSocial White-Label Site Deployment Script
# Usage: ./deploy-kosocial.sh

set -e

echo "🚀 Starting KoSocial deployment..."

# Configuration
APP_DIR="/var/www/kosocial"
REPO_URL="git@github.com:cboydstun/kosocial-bounceops-v1.git"
LOG_DIR="$APP_DIR/logs"
NGINX_AVAILABLE="/etc/nginx/sites-available/kosocial"
NGINX_ENABLED="/etc/nginx/sites-enabled/kosocial"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if running as correct user
check_user() {
    if [ "$USER" != "apiuser" ]; then
        echo -e "${RED}❌ This script should be run as apiuser${NC}"
        echo "Run: sudo su - apiuser"
        exit 1
    fi
}

# Function to clone or pull repo
setup_repo() {
    echo -e "${YELLOW}📥 Setting up repository...${NC}"
    if [ -d "$APP_DIR/.git" ]; then
        echo "Repository exists, pulling latest changes..."
        cd $APP_DIR
        git fetch origin
        git reset --hard origin/main
    else
        echo "Cloning repository..."
        # Create parent directory with proper permissions
        sudo mkdir -p $APP_DIR
        sudo chown apiuser:apiuser $APP_DIR
        git clone $REPO_URL $APP_DIR
        cd $APP_DIR
    fi

    # Create logs directory
    echo -e "${YELLOW}📂 Setting up log directory...${NC}"
    mkdir -p $LOG_DIR
}

# Function to install dependencies and build
build_app() {
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    cd $APP_DIR
    npm ci --production=false

    echo -e "${YELLOW}🏗️  Building application...${NC}"
    npm run build
}

# Function to setup Nginx
setup_nginx() {
    echo -e "${YELLOW}🌐 Setting up Nginx configuration...${NC}"

    # Create Nginx config if it doesn't exist
    if [ ! -f "$NGINX_AVAILABLE" ]; then
        echo "Creating Nginx configuration..."
        sudo tee $NGINX_AVAILABLE > /dev/null << 'NGINXEOF'
upstream kosocial_backend {
    server 127.0.0.1:8082;
    keepalive 64;
}

server {
    listen 80;
    server_name kosocial.slowbill.xyz korentalsoftware.com www.korentalsoftware.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name kosocial.slowbill.xyz;

    ssl_certificate /etc/letsencrypt/live/slowbill.xyz-wildcard/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/slowbill.xyz-wildcard/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    include /etc/nginx/snippets/security-headers.conf;

    client_header_buffer_size 16k;
    large_client_header_buffers 4 32k;
    client_max_body_size 50M;

    location / {
        proxy_pass http://kosocial_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_buffer_size 16k;
        proxy_buffers 8 32k;
        proxy_busy_buffers_size 64k;
    }
}
NGINXEOF

        # Enable the site
        if [ ! -L "$NGINX_ENABLED" ]; then
            echo "Enabling Nginx site..."
            sudo ln -s $NGINX_AVAILABLE $NGINX_ENABLED
        fi

        # Test Nginx configuration
        echo "Testing Nginx configuration..."
        sudo nginx -t

        # Reload Nginx
        echo "Reloading Nginx..."
        sudo systemctl reload nginx

        echo -e "${GREEN}✅ Nginx configured for kosocial.slowbill.xyz${NC}"
        echo -e "${YELLOW}📝 Note: To add korentalsoftware.com, run:${NC}"
        echo "    sudo certbot --nginx -d korentalsoftware.com -d www.korentalsoftware.com"
    else
        echo "Nginx configuration already exists"
    fi
}

# Function to setup PM2
setup_pm2() {
    echo -e "${YELLOW}🔄 Setting up PM2 process...${NC}"
    cd $APP_DIR

    # Delete existing process if it exists
    pm2 delete kosocial-site 2>/dev/null || true

    # Start the application
    pm2 start ecosystem.config.cjs

    # Save PM2 configuration
    pm2 save

    # Ensure PM2 starts on boot (only needs to be done once)
    pm2 startup systemd -u apiuser --hp /home/apiuser 2>/dev/null || true
}

# Function to verify deployment
verify_deployment() {
    echo -e "${YELLOW}🔍 Verifying deployment...${NC}"

    # Check if PM2 process is running
    if pm2 list | grep -q "kosocial-site.*online"; then
        echo -e "${GREEN}✅ PM2 process running${NC}"
    else
        echo -e "${RED}❌ PM2 process not running${NC}"
        pm2 logs kosocial-site --lines 20
        exit 1
    fi

    # Check if port 8082 is listening (using ss, modern replacement for netstat)
    if sudo ss -tlnp | grep -q ":8082.*LISTEN"; then
        echo -e "${GREEN}✅ Application listening on port 8082${NC}"
    else
        echo -e "${RED}❌ Application not listening on port 8082${NC}"
        echo "Checking PM2 logs..."
        pm2 logs kosocial-site --lines 20 --nostream
        exit 1
    fi

    # Test local connection
    if curl -s http://localhost:8082 > /dev/null; then
        echo -e "${GREEN}✅ Application responding to requests${NC}"
    else
        echo -e "${RED}❌ Application not responding${NC}"
        exit 1
    fi
}

# Main deployment process
main() {
    check_user
    setup_repo
    build_app
    setup_nginx
    setup_pm2
    verify_deployment

    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}✅ Deployment Complete!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "${GREEN}📊 Application Details:${NC}"
    echo "   URL: https://kosocial.slowbill.xyz"
    echo "   Port: 8082"
    echo "   Directory: $APP_DIR"
    echo "   Logs: $LOG_DIR"
    echo ""
    echo -e "${GREEN}📝 Useful Commands:${NC}"
    echo "   View logs:    pm2 logs kosocial-site"
    echo "   View status:  pm2 status"
    echo "   Restart:      pm2 restart kosocial-site"
    echo "   Stop:         pm2 stop kosocial-site"
    echo ""
    echo -e "${YELLOW}🔧 Next Steps:${NC}"
    echo "   1. Test the site: curl https://kosocial.slowbill.xyz"
    echo "   2. Configure custom domain (korentalsoftware.com) if needed"
    echo "   3. Update DNS records to point to this server"
    echo ""
}

# Run main function
main
