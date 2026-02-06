#!/bin/bash

# Pennsylvania Census Tracts Map - Deployment Script
# This script helps you deploy the map to GitHub Pages

echo "================================"
echo "PA Census Tracts Map Deployment"
echo "================================"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "Git not initialized. Initializing..."
    git init
    echo ""
fi

# Get GitHub username and repo name
read -p "Enter your GitHub username: " username
read -p "Enter your repository name (e.g., pa-census-tracts): " reponame

# Update index.html with GitHub URLs
echo "Updating configuration in index.html..."

# Create backup
cp index.html index.html.backup

# Update the configuration
sed -i.tmp "s|GITHUB_BASE_URL: 'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/data'|GITHUB_BASE_URL: 'https://raw.githubusercontent.com/$username/$reponame/main/data'|g" index.html
sed -i.tmp "s|USE_LOCAL_DATA: true|USE_LOCAL_DATA: false|g" index.html

# Remove temp file
rm -f index.html.tmp

echo "✓ Configuration updated"
echo ""

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo "Creating .gitignore..."
    cat > .gitignore << EOL
# Backup files
*.backup

# macOS
.DS_Store

# Windows
Thumbs.db

# Python
__pycache__/
*.py[cod]
*$py.class

# Original shapefiles (keep processed data only)
*.shp
*.shx
*.dbf
*.prj
*.cpg
*.xml
*.zip
EOL
    echo "✓ .gitignore created"
    echo ""
fi

# Stage all files
echo "Staging files for commit..."
git add .
echo "✓ Files staged"
echo ""

# Commit
echo "Creating commit..."
git commit -m "Initial commit: PA Census Tracts Interactive Map"
echo "✓ Commit created"
echo ""

# Set up remote
echo "Setting up GitHub remote..."
git remote remove origin 2>/dev/null
git remote add origin "https://github.com/$username/$reponame.git"
echo "✓ Remote configured"
echo ""

# Instructions for pushing
echo "================================"
echo "Next Steps:"
echo "================================"
echo ""
echo "1. Create a new repository on GitHub:"
echo "   https://github.com/new"
echo "   Name it: $reponame"
echo "   DO NOT initialize with README"
echo ""
echo "2. Push your code:"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Enable GitHub Pages:"
echo "   - Go to: https://github.com/$username/$reponame/settings/pages"
echo "   - Source: Deploy from main branch"
echo "   - Click Save"
echo ""
echo "4. Your site will be live at:"
echo "   https://$username.github.io/$reponame/"
echo ""
echo "================================"
echo ""
echo "Configuration has been updated!"
echo "Backup saved as: index.html.backup"
echo ""
