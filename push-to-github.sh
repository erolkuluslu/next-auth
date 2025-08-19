#!/bin/bash

echo "🚀 Pushing Next.js Interview Case Study to GitHub..."
echo "📋 Make sure you have created the 'next-auth' repository on GitHub first!"
echo ""

# Check if repository exists by trying to fetch
echo "🔍 Checking if GitHub repository exists..."
if git ls-remote origin > /dev/null 2>&1; then
    echo "✅ Repository found on GitHub!"
else
    echo "❌ Repository not found on GitHub!"
    echo ""
    echo "Please create the repository first:"
    echo "1. Go to: https://github.com/new"
    echo "2. Repository name: next-auth"
    echo "3. Description: 3-stage progressive frontend development interview case study"
    echo "4. Visibility: Public"
    echo "5. DO NOT initialize with README, .gitignore, or license"
    echo "6. Click 'Create repository'"
    echo ""
    echo "Then run this script again!"
    exit 1
fi

echo ""
echo "📤 Pushing all branches to GitHub..."

# Push main branch first
echo "📌 Pushing main branch..."
git checkout main
git push -u origin main

# Push all development branches
echo "📌 Pushing dev/v1.0.0 branch (Stage 1: Auth System)..."
git checkout dev/v1.0.0
git push -u origin dev/v1.0.0

echo "📌 Pushing dev/v2.0.0 branch (Stage 2: E-commerce)..."
git checkout dev/v2.0.0
git push -u origin dev/v2.0.0

echo "📌 Pushing dev/v3.0.0 branch (Stage 3: Micro Frontend)..."
git checkout dev/v3.0.0
git push -u origin dev/v3.0.0

# Return to dev/v1.0.0 as working branch
git checkout dev/v1.0.0

echo ""
echo "✅ All branches pushed successfully!"
echo ""
echo "🎯 Repository structure:"
echo "   📁 main - Production ready foundation"
echo "   📁 dev/v1.0.0 - Stage 1: Auth0 + NextAuth development"
echo "   📁 dev/v2.0.0 - Stage 2: E-commerce platform development"  
echo "   📁 dev/v3.0.0 - Stage 3: Micro frontend development"
echo ""
echo "🚀 Ready to start development!"
echo "   Stage 1: cd stage1-auth && npm install && npm run dev"
echo "   Stage 2: cd stage2-ecommerce && npm install && npm run dev"
echo "   Stage 3: docker-compose up"
echo ""
echo "📋 Your GitHub repository: https://github.com/erolkuluslu/next-auth"