import {
  EnvironmentConfigFactory,
  getEnvironmentConfig,
} from '../environment';

// Store original environment
const originalEnv = process.env;

beforeEach(() => {
  jest.resetModules();
  process.env = { ...originalEnv };
});

afterEach(() => {
  process.env = originalEnv;
});

describe('EnvironmentConfigFactory', () => {
  const validEnvVars = {
    AUTH0_CLIENT_ID: 'test_client_id',
    AUTH0_CLIENT_SECRET: 'test_client_secret',
    AUTH0_DOMAIN: 'test.auth0.com',
    NEXTAUTH_URL: 'http://localhost:3000',
    NEXTAUTH_SECRET: 'test-secret-min-32-characters-long',
    NODE_ENV: 'test',
  };

  beforeEach(() => {
    Object.assign(process.env, validEnvVars);
  });

  describe('create', () => {
    it('should create configuration with all required environment variables', () => {
      const config = EnvironmentConfigFactory.create();

      expect(config.auth.auth0ClientId).toBe('test_client_id');
      expect(config.auth.auth0ClientSecret).toBe('test_client_secret');
      expect(config.auth.auth0Domain).toBe('test.auth0.com');
      expect(config.auth.nextAuthUrl).toBe('http://localhost:3000');
      expect(config.auth.nextAuthSecret).toBe('test-secret-min-32-characters-long');
      expect(config.app.nodeEnv).toBe('test');
    });

    it('should use default values for optional environment variables', () => {
      const config = EnvironmentConfigFactory.create();

      expect(config.app.port).toBe(3000);
      expect(config.app.appName).toBe('Next.js Auth App');
      expect(config.auth.sessionMaxAge).toBe(2592000); // 30 days
      expect(config.auth.sessionUpdateAge).toBe(86400); // 24 hours
    });

    it('should parse numeric environment variables correctly', () => {
      process.env.PORT = '8080';
      process.env.SESSION_MAX_AGE = '3600';
      process.env.RATE_LIMIT_MAX = '200';

      const config = EnvironmentConfigFactory.create();

      expect(config.app.port).toBe(8080);
      expect(config.auth.sessionMaxAge).toBe(3600);
      expect(config.security.rateLimitMax).toBe(200);
    });

    it('should handle CORS origins as comma-separated values', () => {
      process.env.CORS_ORIGINS = 'http://localhost:3000,http://localhost:3001,https://myapp.com';

      const config = EnvironmentConfigFactory.create();

      expect(config.security.corsOrigins).toEqual([
        'http://localhost:3000',
        'http://localhost:3001',
        'https://myapp.com',
      ]);
    });

    it('should provide build-time placeholder values during build phase', () => {
      process.env.NEXT_PHASE = 'phase-production-build';
      delete process.env.AUTH0_CLIENT_ID;
      delete process.env.NEXTAUTH_SECRET;

      const config = EnvironmentConfigFactory.create();

      expect(config.auth.auth0ClientId).toBe('build-placeholder');
      expect(config.auth.nextAuthSecret).toBe('build-placeholder-min-32-characters-long');
    });
  });

  describe('createForEnvironment', () => {
    it('should create development configuration', () => {
      const config = EnvironmentConfigFactory.createForEnvironment('development');

      expect(config.security.enableDebug).toBe(true);
      expect(config.security.rateLimitMax).toBe(1000);
      expect(config.logging.level).toBe('debug');
      expect(config.logging.enableConsole).toBe(true);
      expect(config.logging.enableFile).toBe(false);
    });

    it('should create production configuration', () => {
      const config = EnvironmentConfigFactory.createForEnvironment('production');

      expect(config.security.enableDebug).toBe(false);
      expect(config.security.rateLimitMax).toBe(100);
      expect(config.logging.level).toBe('info');
      expect(config.logging.enableConsole).toBe(true);
      expect(config.logging.enableFile).toBe(true);
    });

    it('should create test configuration', () => {
      const config = EnvironmentConfigFactory.createForEnvironment('test');

      expect(config.auth.sessionMaxAge).toBe(300); // 5 minutes
      expect(config.security.enableDebug).toBe(false);
      expect(config.security.rateLimitMax).toBe(10000);
      expect(config.logging.level).toBe('error');
      expect(config.logging.enableConsole).toBe(false);
      expect(config.logging.enableFile).toBe(false);
    });
  });

  describe('validation', () => {
    it('should throw error when required environment variables are missing', () => {
      delete process.env.AUTH0_CLIENT_ID;
      delete process.env.NEXTAUTH_SECRET;

      expect(() => {
        EnvironmentConfigFactory.create();
      }).toThrow('Missing required environment variables: AUTH0_CLIENT_ID, NEXTAUTH_SECRET');
    });

    it('should throw error when NEXTAUTH_SECRET is too short', () => {
      process.env.NEXTAUTH_SECRET = 'short';

      expect(() => {
        EnvironmentConfigFactory.create();
      }).toThrow('NEXTAUTH_SECRET must be at least 32 characters long for security');
    });

    it('should throw error when NEXTAUTH_URL is invalid', () => {
      process.env.NEXTAUTH_URL = 'not-a-valid-url';

      expect(() => {
        EnvironmentConfigFactory.create();
      }).toThrow('NEXTAUTH_URL must be a valid URL');
    });

    it('should skip validation during build phase', () => {
      process.env.NEXT_PHASE = 'phase-production-build';
      delete process.env.AUTH0_CLIENT_ID;
      delete process.env.NEXTAUTH_SECRET;

      expect(() => {
        EnvironmentConfigFactory.create();
      }).not.toThrow();
    });

    it('should validate URL format correctly', () => {
      const validUrls = [
        'http://localhost:3000',
        'https://myapp.com',
        'https://sub.domain.com:8080',
      ];

      validUrls.forEach(url => {
        process.env.NEXTAUTH_URL = url;
        expect(() => {
          EnvironmentConfigFactory.create();
        }).not.toThrow();
      });
    });
  });

  describe('environment-specific behavior', () => {
    it('should detect production environment correctly', () => {
      process.env.NODE_ENV = 'production';

      const config = EnvironmentConfigFactory.create();

      expect(config.app.nodeEnv).toBe('production');
    });

    it('should default to development environment', () => {
      delete process.env.NODE_ENV;

      const config = EnvironmentConfigFactory.create();

      expect(config.app.nodeEnv).toBe('development');
    });

    it('should handle custom app metadata', () => {
      process.env.APP_NAME = 'Custom App';
      process.env.APP_VERSION = '2.0.0';
      process.env.BUILD_NUMBER = 'build-123';

      const config = EnvironmentConfigFactory.create();

      expect(config.app.appName).toBe('Custom App');
      expect(config.app.version).toBe('2.0.0');
      expect(config.app.buildNumber).toBe('build-123');
    });
  });
});

describe('getEnvironmentConfig', () => {
  beforeEach(() => {
    // Reset singleton
    jest.resetModules();
    Object.assign(process.env, {
      AUTH0_CLIENT_ID: 'test_client_id',
      AUTH0_CLIENT_SECRET: 'test_client_secret',
      AUTH0_DOMAIN: 'test.auth0.com',
      NEXTAUTH_URL: 'http://localhost:3000',
      NEXTAUTH_SECRET: 'test-secret-min-32-characters-long',
      NODE_ENV: 'test',
    });
  });

  it('should return the same instance on multiple calls (singleton)', () => {
    const config1 = getEnvironmentConfig();
    const config2 = getEnvironmentConfig();

    expect(config1).toBe(config2);
  });

  it('should create configuration based on NODE_ENV', () => {
    process.env.NODE_ENV = 'development';

    // Need to reload module to get fresh singleton
    jest.resetModules();
    const { getEnvironmentConfig: getDevConfig } = require('../environment');
    
    const config = getDevConfig();
    expect(config.logging.level).toBe('debug');
  });
});