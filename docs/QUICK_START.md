# Quick Start Guide - Stage 1 Authentication System

## 🎯 Overview

This guide will help you quickly set up and run the Stage 1 authentication system. The system demonstrates enterprise-level authentication with Auth0, NextAuth.js, and advanced role-based access control.

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.x or later ([Download](https://nodejs.org/))
- **npm** 9.x or later (comes with Node.js)
- **Git** for version control
- **Auth0 Account** ([Sign up for free](https://auth0.com/))

## 🚀 Setup Instructions

### Step 1: Clone the Repository

```bash
git clone https://github.com/erolkuluslu/next-auth.git
cd next-auth/stage1-auth
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Auth0 Configuration

#### 3.1 Create Auth0 Application

1. **Log in to Auth0 Dashboard**: Go to [Auth0 Dashboard](https://manage.auth0.com/)
2. **Create Application**: 
   - Click "Applications" > "Create Application"
   - Name: "Next.js Auth Interview Case"
   - Type: "Single Page Applications"
   - Click "Create"

#### 3.2 Configure Application Settings

In your Auth0 application settings:

**Allowed Callback URLs:**
```
http://localhost:3000/api/auth/callback/auth0
```

**Allowed Logout URLs:**
```
http://localhost:3000
```

**Allowed Web Origins:**
```
http://localhost:3000
```

#### 3.3 Get Credentials

From the Auth0 application settings, copy:
- **Domain** (e.g., `your-tenant.auth0.com`)
- **Client ID**
- **Client Secret**

### Step 4: Environment Configuration

#### 4.1 Create Environment File

```bash
cp .env.example .env.local
```

#### 4.2 Configure Variables

Edit `.env.local` with your Auth0 credentials:

```env
# Auth0 Configuration
AUTH0_CLIENT_ID=your_auth0_client_id_here
AUTH0_CLIENT_SECRET=your_auth0_client_secret_here
AUTH0_DOMAIN=your-tenant.auth0.com

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-min-32-characters-long
```

**⚠️ Important:** 
- `NEXTAUTH_SECRET` must be at least 32 characters long
- Generate a secure secret: `openssl rand -base64 32`

### Step 5: Start Development Server

```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

## 🧪 Testing the System

### Default Features

1. **Home Page**: Welcome screen with Auth0 sign-in
2. **Authentication**: OAuth flow with Auth0
3. **Protected Routes**: Dashboard and admin areas
4. **Role-Based Access**: Different access levels for users

### Test User Roles

By default, users are assigned the `user` role. To test different roles:

1. **Access Auth0 Dashboard**
2. **Go to User Management > Users**
3. **Select a user and edit**
4. **Add custom claims in user metadata:**

```json
{
  "role": "admin"
}
```

Available roles: `viewer`, `user`, `moderator`, `admin`

### Available Routes

| Route | Access Level | Description |
|-------|-------------|-------------|
| `/` | Public | Home page |
| `/auth/signin` | Public | Sign-in page |
| `/dashboard` | Authenticated | User dashboard |
| `/profile` | Authenticated | User profile |
| `/admin` | Admin only | Admin panel |

## 🔧 Available Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix linting issues
npm run type-check   # TypeScript type checking
npm run format       # Format code with Prettier
```

### Testing
```bash
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
npm run test:e2e     # Run end-to-end tests
```

### Analysis
```bash
npm run analyze      # Bundle size analysis
npm run clean        # Clean build artifacts
```

## 🔍 Architecture Overview

### Key Components

- **Authentication**: Auth0 OAuth + NextAuth.js
- **Authorization**: Role-based access control (RBAC)
- **Middleware**: Route protection at server level
- **Security**: JWT tokens, CSRF protection
- **UI**: Modern design with TailwindCSS

### File Structure

```
stage1-auth/
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/auth/      # Authentication API
│   │   ├── dashboard/     # Protected user area
│   │   ├── admin/         # Admin-only area
│   │   └── auth/          # Auth pages
│   ├── components/        # React components
│   ├── config/           # Configuration
│   ├── services/         # Business logic
│   ├── hooks/            # Custom hooks
│   ├── types/            # TypeScript types
│   └── utils/            # Utilities
├── middleware.ts         # Route protection
└── next.config.js       # Next.js config
```

## 🔧 Common Issues & Solutions

### Issue: "Missing required environment variables"

**Solution**: Ensure all required variables are set in `.env.local`:
- `AUTH0_CLIENT_ID`
- `AUTH0_CLIENT_SECRET`
- `AUTH0_DOMAIN`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

### Issue: "NextAuth callback error"

**Solution**: Check Auth0 callback URLs match exactly:
```
http://localhost:3000/api/auth/callback/auth0
```

### Issue: "NEXTAUTH_SECRET must be at least 32 characters"

**Solution**: Generate a longer secret:
```bash
openssl rand -base64 32
```

### Issue: Build errors

**Solution**: Clear Next.js cache:
```bash
npm run clean
npm install
npm run build
```

## 🚀 Next Steps

Once you have the system running:

1. **Explore the Authentication Flow**
   - Try signing in and out
   - Navigate between protected routes
   - Test different user roles

2. **Review the Code**
   - Check the SOLID principles implementation
   - Examine the RBAC system
   - Study the middleware protection

3. **Customize for Your Needs**
   - Add custom user fields
   - Implement additional roles
   - Extend the permissions system

## 📚 Additional Resources

- [Auth0 Documentation](https://auth0.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

## 🆘 Support

If you encounter issues:

1. Check the [troubleshooting section](#common-issues--solutions)
2. Review the logs in your browser console
3. Verify your Auth0 configuration
4. Ensure all environment variables are correct

---

**Happy coding! 🎉**

This authentication system demonstrates enterprise-level patterns and is ready for production use with proper configuration and testing.
