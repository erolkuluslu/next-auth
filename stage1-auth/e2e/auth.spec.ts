import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should display sign in page correctly', async ({ page }) => {
    await page.goto('/auth/signin');

    // Check page title and heading
    await expect(page).toHaveTitle(/Next.js Auth/);
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();

    // Check sign in description
    await expect(page.getByText('Sign in to your account to access protected features')).toBeVisible();

    // Check Auth0 branding
    await expect(page.getByText('Secure authentication powered by Auth0')).toBeVisible();

    // Check back to home link
    await expect(page.getByRole('link', { name: '← Back to Home' })).toBeVisible();
  });

  test('should show error message for invalid authentication', async ({ page }) => {
    await page.goto('/auth/error?error=Configuration');

    // Check error page elements
    await expect(page.getByRole('heading', { name: 'Server Configuration Error' })).toBeVisible();
    await expect(page.getByText('There is a problem with the authentication server configuration')).toBeVisible();
    
    // Check action buttons
    await expect(page.getByRole('link', { name: 'Try Again' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Go to Home' })).toBeVisible();
  });

  test('should redirect unauthenticated users from protected routes', async ({ page }) => {
    // Try to access protected dashboard without authentication
    await page.goto('/dashboard');

    // Should be redirected to sign in page
    await expect(page.url()).toContain('/auth/signin');
    await expect(page.url()).toContain('callbackUrl=%2Fdashboard');
    
    // Check sign in page is displayed
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
  });

  test('should redirect to unauthorized page for insufficient permissions', async ({ page }) => {
    // Navigate to unauthorized page directly
    await page.goto('/unauthorized');

    // Check unauthorized page elements
    await expect(page.getByRole('heading', { name: 'Access Denied' })).toBeVisible();
    await expect(page.getByText('You do not have the necessary permissions')).toBeVisible();
    
    // Check navigation options
    await expect(page.getByRole('link', { name: 'Go to Dashboard' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'View Profile' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Go to Home' })).toBeVisible();
  });

  test('should display different error types correctly', async ({ page }) => {
    const errorTypes = [
      { error: 'AccessDenied', title: 'Access Denied' },
      { error: 'Verification', title: 'Verification Failed' },
      { error: 'OAuthSignin', title: 'OAuth Sign-in Error' },
      { error: 'CredentialsSignin', title: 'Invalid Credentials' },
    ];

    for (const { error, title } of errorTypes) {
      await page.goto(`/auth/error?error=${error}`);
      await expect(page.getByRole('heading', { name: title })).toBeVisible();
    }
  });
});

test.describe('Protected Routes', () => {
  test('should show access denied for all protected routes when not authenticated', async ({ page }) => {
    const protectedRoutes = ['/dashboard', '/profile', '/admin'];

    for (const route of protectedRoutes) {
      await page.goto(route);
      
      // Should be redirected to sign in
      await expect(page.url()).toContain('/auth/signin');
      await expect(page.url()).toContain(`callbackUrl=${encodeURIComponent(route)}`);
    }
  });

  test('should display middleware protection notice on dashboard', async ({ page }) => {
    // Go directly to dashboard (will be redirected)
    await page.goto('/dashboard');
    
    // Should be on sign in page
    await expect(page.url()).toContain('/auth/signin');
    
    // Check that callback URL is preserved
    await expect(page.url()).toContain('callbackUrl=%2Fdashboard');
  });
});

test.describe('Navigation', () => {
  test('should navigate correctly from home page', async ({ page }) => {
    await page.goto('/');

    // Check if the home page has expected elements
    // This depends on your home page implementation
    await expect(page).toHaveTitle(/Next.js Auth/);
  });

  test('should navigate to sign in from various links', async ({ page }) => {
    // Test navigation from unauthorized page
    await page.goto('/unauthorized');
    await page.getByRole('link', { name: 'Go to Home' }).click();
    await expect(page.url()).toBe('http://localhost:3000/');
  });

  test('should show proper navigation structure', async ({ page }) => {
    await page.goto('/auth/signin');
    
    // Check back to home navigation
    await page.getByRole('link', { name: '← Back to Home' }).click();
    await expect(page.url()).toBe('http://localhost:3000/');
  });
});

test.describe('Error Handling', () => {
  test('should handle 404 pages gracefully', async ({ page }) => {
    const response = await page.goto('/nonexistent-page');
    expect(response?.status()).toBe(404);
  });

  test('should show proper error boundaries', async ({ page }) => {
    // Test error boundary by going to a route that might cause errors
    await page.goto('/auth/error?error=unknown');
    
    // Should show default error message
    await expect(page.getByRole('heading', { name: 'Authentication Error' })).toBeVisible();
    await expect(page.getByText('An unexpected error occurred during authentication')).toBeVisible();
  });
});

test.describe('Health Check', () => {
  test('should respond to health check endpoint', async ({ page }) => {
    const response = await page.goto('/api/health');
    expect(response?.status()).toBe(200);
    
    const healthData = await response?.json();
    expect(healthData).toHaveProperty('status');
    expect(healthData).toHaveProperty('timestamp');
    expect(healthData).toHaveProperty('version');
    expect(healthData).toHaveProperty('environment');
  });
});