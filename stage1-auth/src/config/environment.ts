// Environment configuration following 12-Factor App principles

export interface EnvironmentConfig {
  // III. Config - Store config in the environment
  auth: {
    auth0ClientId: string;
    auth0ClientSecret: string;
    auth0Domain: string;
    nextAuthUrl: string;
    nextAuthSecret: string;
    jwtSecret?: string;
    sessionMaxAge: number;
    sessionUpdateAge: number;
  };
  app: {
    nodeEnv: string;
    port: number;
    appName: string;
    version: string;
    buildNumber?: string;
    baseUrl: string;
  };
  security: {
    corsOrigins: string[];
    rateLimitMax: number;
    rateLimitWindowMs: number;
    enableDebug: boolean;
  };
  logging: {
    level: string;
    enableConsole: boolean;
    enableFile: boolean;
  };
}

// Environment validation with clear error messages
class EnvironmentValidator {
  private static requiredVars = [
    'AUTH0_CLIENT_ID',
    'AUTH0_CLIENT_SECRET', 
    'AUTH0_DOMAIN',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
  ];

  static validate(): void {
    // Skip validation during build process
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return;
    }

    // Skip validation on client side (environment variables are not available)
    if (typeof window !== 'undefined') {
      return;
    }

    const missing: string[] = [];
    
    for (const varName of this.requiredVars) {
      if (!process.env[varName]) {
        missing.push(varName);
      }
    }

    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}\n` +
        'Please check your .env.local file and ensure all required variables are set.'
      );
    }

    // Validate NEXTAUTH_SECRET length
    if (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length < 32) {
      throw new Error('NEXTAUTH_SECRET must be at least 32 characters long for security');
    }

    // Validate URL format
    if (process.env.NEXTAUTH_URL && !this.isValidUrl(process.env.NEXTAUTH_URL)) {
      throw new Error('NEXTAUTH_URL must be a valid URL');
    }
  }

  private static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}

// Environment configuration factory
export class EnvironmentConfigFactory {
  static create(): EnvironmentConfig {
    // Validate environment variables first
    EnvironmentValidator.validate();

    const nodeEnv = process.env.NODE_ENV || 'development';
    const isProduction = nodeEnv === 'production';
    const isDevelopment = nodeEnv === 'development';
    const isBuild = process.env.NEXT_PHASE === 'phase-production-build';
    const isClientSide = typeof window !== 'undefined';

    return {
      auth: {
        auth0ClientId: process.env.AUTH0_CLIENT_ID || (isClientSide ? 'client-side-placeholder' : (isBuild ? 'build-placeholder' : '')),
        auth0ClientSecret: process.env.AUTH0_CLIENT_SECRET || (isClientSide ? 'client-side-placeholder' : (isBuild ? 'build-placeholder' : '')),
        auth0Domain: process.env.AUTH0_DOMAIN || (isClientSide ? 'client-side-placeholder' : (isBuild ? 'build-placeholder' : '')),
        nextAuthUrl: process.env.NEXTAUTH_URL || (isClientSide ? (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000') : (isBuild ? 'http://localhost:3000' : '')),
        nextAuthSecret: process.env.NEXTAUTH_SECRET || (isClientSide ? 'client-side-placeholder-not-available' : (isBuild ? 'build-placeholder-min-32-characters-long' : '')),
        jwtSecret: process.env.JWT_SECRET,
        sessionMaxAge: parseInt(process.env.SESSION_MAX_AGE || '2592000'), // 30 days
        sessionUpdateAge: parseInt(process.env.SESSION_UPDATE_AGE || '86400'), // 24 hours
      },
      app: {
        nodeEnv,
        port: parseInt(process.env.PORT || '3000'),
        appName: process.env.APP_NAME || 'Next.js Auth App',
        version: process.env.APP_VERSION || '1.0.0',
        buildNumber: process.env.BUILD_NUMBER,
        baseUrl: process.env.NEXTAUTH_URL || (isClientSide ? (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000') : 'http://localhost:3000'),
      },
      security: {
        corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
        rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100'),
        rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
        enableDebug: process.env.NEXTAUTH_DEBUG === 'true' || isDevelopment,
      },
      logging: {
        level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
        enableConsole: process.env.LOG_CONSOLE !== 'false',
        enableFile: process.env.LOG_FILE === 'true' && isProduction,
      },
    };
  }

  // Different configurations for different environments
  static createForEnvironment(env: 'development' | 'production' | 'test'): EnvironmentConfig {
    const baseConfig = this.create();

    switch (env) {
      case 'development':
        return {
          ...baseConfig,
          security: {
            ...baseConfig.security,
            enableDebug: true,
            rateLimitMax: 1000, // More lenient for development
          },
          logging: {
            ...baseConfig.logging,
            level: 'debug',
            enableConsole: true,
            enableFile: false,
          },
        };

      case 'production':
        return {
          ...baseConfig,
          security: {
            ...baseConfig.security,
            enableDebug: false,
            rateLimitMax: 100, // Stricter for production
          },
          logging: {
            ...baseConfig.logging,
            level: 'info',
            enableConsole: true,
            enableFile: true,
          },
        };

      case 'test':
        return {
          ...baseConfig,
          auth: {
            ...baseConfig.auth,
            sessionMaxAge: 300, // 5 minutes for tests
          },
          security: {
            ...baseConfig.security,
            enableDebug: false,
            rateLimitMax: 10000, // Very lenient for tests
          },
          logging: {
            ...baseConfig.logging,
            level: 'error',
            enableConsole: false,
            enableFile: false,
          },
        };

      default:
        return baseConfig;
    }
  }
}

// Singleton instance
let environmentConfig: EnvironmentConfig | null = null;

export function getEnvironmentConfig(): EnvironmentConfig {
  if (!environmentConfig) {
    environmentConfig = EnvironmentConfigFactory.createForEnvironment(
      (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development'
    );
  }
  return environmentConfig;
}

// Export for easier access
export const env = getEnvironmentConfig();