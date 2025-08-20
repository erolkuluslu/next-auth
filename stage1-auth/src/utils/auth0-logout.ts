/**
 * Auth0 Logout Utilities
 * Handles proper Auth0 session termination
 */

export class Auth0LogoutService {

  /**
   * Creates an Auth0 logout URL that clears the Auth0 session
   * and redirects back to the application
   * Note: For client-side usage, this method uses window.location for base URL
   */
  static createLogoutUrl(returnTo?: string): string {
    // Use window.location for client-side or fallback to localhost for development
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : 'http://localhost:3000';
    const returnToUrl = returnTo || baseUrl;
    
    // For development, use hardcoded Auth0 domain and client ID
    // In production, these should be passed as parameters or fetched from an API
    const auth0Domain = 'dev-n5bki40vf47k0uvz.us.auth0.com';
    const clientId = 'NUtLXmSFnGJsL2GyecUI4L4FQxnl5C5w';
    
    return `https://${auth0Domain}/v2/logout?` +
      `client_id=${clientId}&` +
      `returnTo=${encodeURIComponent(returnToUrl)}`;
  }

  /**
   * Performs a complete logout that clears both NextAuth and Auth0 sessions
   */
  static async performCompleteLogout(returnTo?: string): Promise<void> {
    // First clear the NextAuth session via API
    await fetch('/api/auth/signout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Then redirect to Auth0 logout to clear their session
    const logoutUrl = this.createLogoutUrl(returnTo);
    window.location.href = logoutUrl;
  }

  /**
   * Check if we need to force a fresh login (no Auth0 SSO)
   */
  static createFreshLoginUrl(): string {
    return `/api/auth/signin/auth0?prompt=login`;
  }
}
