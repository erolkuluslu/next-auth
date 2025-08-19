# Auth0 Setup Instructions

This document provides step-by-step instructions for setting up Auth0 for the Next.js authentication system.

## 🚀 Auth0 Account Setup

### Step 1: Create Auth0 Account
1. Go to [Auth0.com](https://auth0.com/)
2. Sign up for a free account or log in
3. Complete the account verification process

### Step 2: Create New Application
1. Navigate to **Applications** in the Auth0 Dashboard
2. Click **Create Application**
3. Configure the application:
   - **Name**: `next-auth-stage1`
   - **Application Type**: Regular Web Application
   - Click **Create**

### Step 3: Configure Application Settings
Navigate to your application's **Settings** tab and configure:

#### Basic Information
- **Name**: `next-auth-stage1`
- **Description**: `Stage 1 Authentication System for Next.js Interview Case`
- **Application Type**: Regular Web Application

#### Application URIs
```
Allowed Callback URLs:
http://localhost:3000/api/auth/callback/auth0
https://your-production-domain.com/api/auth/callback/auth0

Allowed Logout URLs:
http://localhost:3000
https://your-production-domain.com

Allowed Web Origins:
http://localhost:3000
https://your-production-domain.com
```

#### Advanced Settings
- **Grant Types**: Select `Authorization Code`, `Refresh Token`, `Client Credentials`
- **Token Endpoint Authentication Method**: `POST`

### Step 4: Get Credentials
From the **Settings** tab, copy these values:

```bash
# Required Environment Variables
AUTH0_CLIENT_ID=your_client_id_here
AUTH0_CLIENT_SECRET=your_client_secret_here
AUTH0_DOMAIN=your-tenant.auth0.com
```

### Step 5: Configure User Roles (For Bonus Feature)
1. Go to **User Management** > **Roles**
2. Create two roles:
   - **Name**: `admin`, **Description**: `Administrator access`
   - **Name**: `user`, **Description**: `Regular user access`

### Step 6: Test Configuration
1. Save all settings in Auth0 Dashboard
2. Copy credentials to your `.env.local` file
3. Test the configuration with the Next.js application

## 🔐 Security Best Practices

### Environment Variables
- Never commit real credentials to version control
- Use different Auth0 applications for development/production
- Rotate client secrets regularly in production

### Application Settings
- Use HTTPS in production
- Configure proper CORS settings
- Enable rate limiting and anomaly detection
- Set up proper logout URLs

## 📋 Required Environment Configuration

Create `.env.local` in `stage1-auth/` with:

```bash
# Auth0 Configuration
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_CLIENT_SECRET=your_auth0_client_secret
AUTH0_DOMAIN=your-tenant.auth0.com

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-nextauth-secret-key

# JWT Configuration (Optional)
JWT_SECRET=your-jwt-secret-key
```

## ✅ Verification Checklist

- [ ] Auth0 account created and verified
- [ ] Application created with correct settings
- [ ] Callback URLs configured for development and production
- [ ] Client ID, Client Secret, and Domain obtained
- [ ] Environment variables configured locally
- [ ] User roles created (admin, user)
- [ ] Security settings reviewed and configured

## 🚨 Troubleshooting

### Common Issues
1. **Callback URL Mismatch**: Ensure URLs match exactly (including http/https)
2. **Domain Configuration**: Use the full Auth0 domain (tenant.auth0.com)
3. **Client Secret**: Keep secret secure and never expose in frontend code
4. **CORS Issues**: Configure allowed origins properly

### Testing Connection
The application will validate Auth0 connection on startup and provide helpful error messages if configuration is incorrect.

---

**Next Step**: Once Auth0 is configured, proceed with NextAuth integration in Task 3.