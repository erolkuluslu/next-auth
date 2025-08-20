# 🚀 Development Setup Guide

Complete guide to run the Next.js Auth application locally with RBAC system.

## 📋 Prerequisites

Before starting, ensure you have:

- **Node.js 18+** installed
- **npm 9+** installed
- **Auth0 account** (free tier available)
- **Git** for version control

## 🔧 Environment Setup

### 1. Clone and Navigate
```bash
cd /Users/erolkuluslu/IndieApps/next-auth/stage1-auth
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration

Create `.env.local` file in the project root:

```bash
# Auth0 Configuration (Required)
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_CLIENT_SECRET=your_auth0_client_secret
AUTH0_DOMAIN=your-domain.auth0.com

# NextAuth Configuration (Required)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-32-character-secret-key-here

# Optional Configuration
NODE_ENV=development
PORT=3000
```

### 4. Auth0 Setup

1. **Go to Auth0 Dashboard**: https://manage.auth0.com/
2. **Create Application**:
   - Name: "Next.js Auth App"
   - Type: "Regular Web Application"
3. **Configure Application Settings**:
   - **Allowed Callback URLs**: `http://localhost:3000/api/auth/callback/auth0`
   - **Allowed Logout URLs**: `http://localhost:3000`
   - **Allowed Web Origins**: `http://localhost:3000`
4. **Get Credentials**:
   - Copy `Client ID` → `AUTH0_CLIENT_ID`
   - Copy `Client Secret` → `AUTH0_CLIENT_SECRET`
   - Copy `Domain` → `AUTH0_DOMAIN`

### 5. Generate NextAuth Secret

```bash
# Generate a random secret
openssl rand -base64 32
```
Copy the output to `NEXTAUTH_SECRET` in `.env.local`

## 🏃‍♂️ Running the Application

### 1. Start Development Server
```bash
npm run dev
```

You should see:
```
✓ Ready in 1180ms
- Local:        http://localhost:3000
```

### 2. Open Browser
Navigate to: **http://localhost:3000**

## 🧪 Testing the Application

### Basic Authentication Flow

1. **Home Page** (`http://localhost:3000`)
   - Should show welcome page with "Sign In" button

2. **Sign In** (`http://localhost:3000/auth/signin`)
   - Click "Sign in with Auth0"
   - Complete Auth0 authentication

3. **Dashboard** (`http://localhost:3000/dashboard`)
   - After sign-in, you'll be redirected here
   - Shows user information and roles

### RBAC System Testing

#### Role-Based Access Control Features:

1. **Dashboard** (`/dashboard`)
   - View your assigned roles (badges)
   - See role-based UI components
   - Admin panel link (visible only to admins)

2. **Admin Panel** (`/admin`) - Admin Only
   - Complete admin interface
   - **Roles & RBAC** tab with:
     - Current user role information
     - Role explorer and hierarchy
     - Permission comparison matrix
     - Role inheritance visualization

3. **Profile** (`/profile`)
   - User profile management
   - Role and permission display

### Role Hierarchy Testing

The system implements 4 roles with inheritance:

```
viewer (basic access)
  ↓
user (standard user)
  ↓
moderator (user management)
  ↓
admin (full access)
```

## 🔍 Troubleshooting

### Issue: "Nothing shows on localhost"

**Check 1: Development Server Running**
```bash
# Ensure server is running
npm run dev

# You should see:
# ✓ Ready in 1180ms
# - Local: http://localhost:3000
```

**Check 2: Environment Variables**
```bash
# Verify .env.local exists and has correct values
cat .env.local

# Required variables:
# AUTH0_CLIENT_ID=...
# AUTH0_CLIENT_SECRET=...
# AUTH0_DOMAIN=...
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_SECRET=...
```

**Check 3: Port Conflicts**
```bash
# If port 3000 is busy, use different port
npm run dev -- --port 3001
```

**Check 4: Browser Console**
- Open browser dev tools (F12)
- Check Console tab for errors
- Check Network tab for failed requests

### Issue: "Auth0 Login Not Working"

1. **Verify Auth0 Configuration**:
   - Callback URLs match exactly
   - Domain format: `your-domain.auth0.com` (no https://)
   - Client credentials are correct

2. **Check Auth0 Application Settings**:
   - Application Type: "Regular Web Application"
   - Token Endpoint Authentication: "Post"

### Issue: "Access Denied" or "403 Errors"

1. **Check User Roles**: Default role is "user"
2. **Admin Access**: Only users with "admin" role can access `/admin`
3. **Middleware Protection**: Routes are protected by role-based middleware

## 📁 Project Structure

```
src/
├── app/                 # App Router pages
│   ├── admin/          # Admin panel (admin only)
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # User dashboard
│   └── profile/        # User profile
├── components/         # React components
│   ├── auth/          # Auth-related components
│   └── admin/         # Admin components
├── hooks/             # Custom React hooks
│   └── useRBAC.ts     # RBAC hook
├── services/          # Business logic
│   ├── auth.service.ts
│   ├── rbac.service.ts
│   └── middleware.service.ts
├── types/             # TypeScript types
│   └── rbac.ts        # RBAC type definitions
└── lib/               # Utilities
    └── auth.ts        # NextAuth configuration
```

## 🛠 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Building
npm run build        # Build for production
npm run start        # Start production server

# Testing
npm test            # Run Jest tests
npm run test:e2e    # Run Playwright E2E tests

# Code Quality
npm run lint        # ESLint
npm run type-check  # TypeScript check
```

## 🌟 Features to Test

- ✅ **Authentication**: Auth0 OAuth flow
- ✅ **Role Management**: 4-tier role hierarchy
- ✅ **Permission System**: 17 granular permissions
- ✅ **Route Protection**: Middleware-based access control
- ✅ **UI Components**: Role-based conditional rendering
- ✅ **Admin Panel**: Complete role management interface
- ✅ **Type Safety**: Full TypeScript coverage

## 📞 Need Help?

If you encounter issues:

1. **Check the console** for error messages
2. **Verify environment variables** are set correctly
3. **Confirm Auth0 configuration** matches the setup
4. **Test with different browsers** to rule out cache issues
5. **Check network connectivity** and firewall settings

---

**Happy coding! 🚀**