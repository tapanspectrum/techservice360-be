#!/bin/bash

# ===========================
# build-app.sh for NestJS + PM2
# ===========================

# Exit immediately if a command fails
set -e

# 1. Go to project directory
PROJECT_DIR="/home/nearyouindia/olxbe"
cd $PROJECT_DIR

echo "📁 Changed directory to $PROJECT_DIR"

# 2. Pull latest code from Git (optional)
# Uncomment if using git
# echo "🔄 Pulling latest code..."
# git pull origin main

# 3. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 4. Build the NestJS app
echo "🏗️ Building NestJS app..."
npm run build

# 5. Restart PM2 process
APP_NAME="nearyouindia-app"
if pm2 list | grep -q $APP_NAME; then
    echo "🔄 Restarting existing PM2 process: $APP_NAME"
    pm2 restart $APP_NAME
else
    echo "✨ Starting PM2 process: $APP_NAME"
    pm2 start dist/main.js --name $APP_NAME
fi

# 6. Save PM2 process list for auto-start on reboot
pm2 save

echo "✅ Build and deployment complete!"
