import { getStage2EnvironmentConfig } from '@/config/environment';

describe('Environment Configuration', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    // Reset specific env vars for testing
    jest.resetModules();
  });

  afterEach(() => {
    // Restore original environment
    Object.keys(process.env).forEach(key => {
      if (!(key in originalEnv)) {
        delete process.env[key];
      }
    });
    Object.assign(process.env, originalEnv);
  });

  it('should load default development configuration', () => {
    // Set minimum required env vars
    process.env.NODE_ENV = 'development';
    process.env.NEXTAUTH_URL = 'http://localhost:3000';
    process.env.NEXTAUTH_SECRET = 'test-secret-key-min-32-characters-long';
    process.env.AUTH0_CLIENT_ID = 'test-client-id';
    process.env.AUTH0_CLIENT_SECRET = 'test-client-secret';
    process.env.AUTH0_DOMAIN = 'test-domain.auth0.com';

    const config = getStage2EnvironmentConfig();

    expect(config.app.nodeEnv).toBe('development');
    expect(config.app.port).toBe(3000);
    expect(config.i18n.defaultLocale).toBe('tr');
    expect(config.i18n.supportedLocales).toContain('tr');
    expect(config.i18n.supportedLocales).toContain('en');
    expect(config.api.fakeStoreApiUrl).toBe('https://fakestoreapi.com');
    expect(config.security.enableDebug).toBe(true);
  });

  it('should validate required environment variables', () => {
    // Missing required variables should not throw in test environment
    // because we have placeholders for build/client side
    process.env.NODE_ENV = 'test';

    expect(() => getStage2EnvironmentConfig()).not.toThrow();
  });

  it('should handle i18n configuration correctly', () => {
    process.env.NODE_ENV = 'test';
    process.env.NEXT_PUBLIC_DEFAULT_LOCALE = 'en';
    process.env.NEXT_PUBLIC_SUPPORTED_LOCALES = 'en,tr,de';

    const config = getStage2EnvironmentConfig();

    expect(config.i18n.defaultLocale).toBe('en');
    expect(config.i18n.supportedLocales).toEqual(['en', 'tr', 'de']);
  });

  it('should configure API settings correctly', () => {
    process.env.NODE_ENV = 'test';
    process.env.FAKE_STORE_API_URL = 'https://api.example.com';
    process.env.API_TIMEOUT = '10000';
    process.env.API_RETRIES = '5';

    const config = getStage2EnvironmentConfig();

    expect(config.api.fakeStoreApiUrl).toBe('https://api.example.com');
    expect(config.api.timeout).toBe(10000);
    expect(config.api.retries).toBe(5);
  });

  it('should configure security settings correctly', () => {
    process.env.NODE_ENV = 'production';
    process.env.CORS_ORIGINS = 'https://example.com,https://api.example.com';
    process.env.RATE_LIMIT_MAX = '50';
    process.env.NEXTAUTH_DEBUG = 'false';

    const config = getStage2EnvironmentConfig();

    expect(config.security.corsOrigins).toEqual([
      'https://example.com',
      'https://api.example.com',
    ]);
    expect(config.security.rateLimitMax).toBe(50);
    expect(config.security.enableDebug).toBe(false);
  });
});
