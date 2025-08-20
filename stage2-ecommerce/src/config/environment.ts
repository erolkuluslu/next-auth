// Environment configuration following 12-Factor App principles
import { z } from 'zod';

export interface Stage2EnvironmentConfig {
  // III. Config - Store config in the environment
  auth: {
    auth0ClientId: string;
    auth0ClientSecret: string;
    auth0Domain: string;
    nextAuthUrl: string;
    nextAuthSecret: string;
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
    siteUrl: string;
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
  i18n: {
    defaultLocale: string;
    supportedLocales: string[];
  };
  api: {
    fakeStoreApiUrl: string;
    timeout: number;
    retries: number;
  };
}

// Environment validation schema using Zod
const environmentSchema = z.object({
  // Auth (reuse from Stage 1)
  AUTH0_CLIENT_ID: z.string().min(1),
  AUTH0_CLIENT_SECRET: z.string().min(1),
  AUTH0_DOMAIN: z.string().min(1),
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),

  // App
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z
    .string()
    .transform(val => parseInt(val))
    .default('3001'),
  APP_NAME: z.string().default('Stage 2 E-commerce'),
  APP_VERSION: z.string().default('2.0.0'),
  BUILD_NUMBER: z.string().optional(),
  SITE_URL: z.string().url().default('http://localhost:3001'),

  // I18n
  NEXT_PUBLIC_DEFAULT_LOCALE: z.string().default('tr'),
  NEXT_PUBLIC_SUPPORTED_LOCALES: z.string().default('tr,en'),

  // API
  FAKE_STORE_API_URL: z.string().url().default('https://fakestoreapi.com'),
  API_TIMEOUT: z
    .string()
    .transform(val => parseInt(val))
    .default('5000'),
  API_RETRIES: z
    .string()
    .transform(val => parseInt(val))
    .default('3'),

  // Security
  CORS_ORIGINS: z.string().optional(),
  RATE_LIMIT_MAX: z
    .string()
    .transform(val => parseInt(val))
    .default('100'),
  RATE_LIMIT_WINDOW_MS: z
    .string()
    .transform(val => parseInt(val))
    .default('900000'),
  NEXTAUTH_DEBUG: z.string().optional(),

  // Logging
  LOG_LEVEL: z.string().default('info'),
  LOG_CONSOLE: z.string().optional(),
  LOG_FILE: z.string().optional(),

  // Session
  SESSION_MAX_AGE: z
    .string()
    .transform(val => parseInt(val))
    .default('2592000'),
  SESSION_UPDATE_AGE: z
    .string()
    .transform(val => parseInt(val))
    .default('86400'),
});

// Environment validation with clear error messages
class Stage2EnvironmentValidator {
  private static requiredVars = [
    'AUTH0_CLIENT_ID',
    'AUTH0_CLIENT_SECRET',
    'AUTH0_DOMAIN',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
  ];

  static validate(): z.infer<typeof environmentSchema> {
    // Skip validation during build process
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return this.getBuildPlaceholders();
    }

    // Skip validation on client side (environment variables are not available)
    if (typeof window !== 'undefined') {
      return this.getClientPlaceholders();
    }

    try {
      return environmentSchema.parse(process.env);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const missing = error.errors
          .filter(err => err.code === 'invalid_type')
          .map(err => err.path.join('.'));

        throw new Error(
          `Missing or invalid environment variables: ${missing.join(', ')}\n` +
            'Please check your .env.local file and ensure all required variables are set.\n' +
            'Required variables: ' +
            this.requiredVars.join(', ')
        );
      }
      throw error;
    }
  }

  private static getBuildPlaceholders(): z.infer<typeof environmentSchema> {
    return {
      AUTH0_CLIENT_ID: 'build-placeholder',
      AUTH0_CLIENT_SECRET: 'build-placeholder',
      AUTH0_DOMAIN: 'build-placeholder',
      NEXTAUTH_URL: 'http://localhost:3001',
      NEXTAUTH_SECRET: 'build-placeholder-min-32-characters-long',
      NODE_ENV: 'production',
      PORT: 3001,
      APP_NAME: 'Stage 2 E-commerce',
      APP_VERSION: '2.0.0',
      SITE_URL: 'http://localhost:3001',
      NEXT_PUBLIC_DEFAULT_LOCALE: 'tr',
      NEXT_PUBLIC_SUPPORTED_LOCALES: 'tr,en',
      FAKE_STORE_API_URL: 'https://fakestoreapi.com',
      API_TIMEOUT: 5000,
      API_RETRIES: 3,
      RATE_LIMIT_MAX: 100,
      RATE_LIMIT_WINDOW_MS: 900000,
      LOG_LEVEL: 'info',
      SESSION_MAX_AGE: 2592000,
      SESSION_UPDATE_AGE: 86400,
    };
  }

  private static getClientPlaceholders(): z.infer<typeof environmentSchema> {
    return {
      AUTH0_CLIENT_ID: 'client-side-placeholder',
      AUTH0_CLIENT_SECRET: 'client-side-placeholder',
      AUTH0_DOMAIN: 'client-side-placeholder',
      NEXTAUTH_URL:
        typeof window !== 'undefined'
          ? window.location.origin
          : 'http://localhost:3001',
      NEXTAUTH_SECRET: 'client-side-placeholder',
      NODE_ENV: 'development',
      PORT: 3001,
      APP_NAME: 'Stage 2 E-commerce',
      APP_VERSION: '2.0.0',
      SITE_URL:
        typeof window !== 'undefined'
          ? window.location.origin
          : 'http://localhost:3001',
      NEXT_PUBLIC_DEFAULT_LOCALE: 'tr',
      NEXT_PUBLIC_SUPPORTED_LOCALES: 'tr,en',
      FAKE_STORE_API_URL: 'https://fakestoreapi.com',
      API_TIMEOUT: 5000,
      API_RETRIES: 3,
      RATE_LIMIT_MAX: 100,
      RATE_LIMIT_WINDOW_MS: 900000,
      LOG_LEVEL: 'info',
      SESSION_MAX_AGE: 2592000,
      SESSION_UPDATE_AGE: 86400,
    };
  }
}

// Environment configuration factory
export class Stage2EnvironmentConfigFactory {
  static create(): Stage2EnvironmentConfig {
    // Validate environment variables first
    const env = Stage2EnvironmentValidator.validate();

    const isProduction = env.NODE_ENV === 'production';
    const isDevelopment = env.NODE_ENV === 'development';

    return {
      auth: {
        auth0ClientId: env.AUTH0_CLIENT_ID,
        auth0ClientSecret: env.AUTH0_CLIENT_SECRET,
        auth0Domain: env.AUTH0_DOMAIN,
        nextAuthUrl: env.NEXTAUTH_URL,
        nextAuthSecret: env.NEXTAUTH_SECRET,
        sessionMaxAge: env.SESSION_MAX_AGE,
        sessionUpdateAge: env.SESSION_UPDATE_AGE,
      },
      app: {
        nodeEnv: env.NODE_ENV,
        port: env.PORT,
        appName: env.APP_NAME,
        version: env.APP_VERSION,
        buildNumber: env.BUILD_NUMBER,
        baseUrl: env.NEXTAUTH_URL,
        siteUrl: env.SITE_URL,
      },
      security: {
        corsOrigins: env.CORS_ORIGINS?.split(',') || ['http://localhost:3001'],
        rateLimitMax: env.RATE_LIMIT_MAX,
        rateLimitWindowMs: env.RATE_LIMIT_WINDOW_MS,
        enableDebug: env.NEXTAUTH_DEBUG === 'true' || isDevelopment,
      },
      logging: {
        level: env.LOG_LEVEL,
        enableConsole: env.LOG_CONSOLE !== 'false',
        enableFile: env.LOG_FILE === 'true' && isProduction,
      },
      i18n: {
        defaultLocale: env.NEXT_PUBLIC_DEFAULT_LOCALE,
        supportedLocales: env.NEXT_PUBLIC_SUPPORTED_LOCALES.split(','),
      },
      api: {
        fakeStoreApiUrl: env.FAKE_STORE_API_URL,
        timeout: env.API_TIMEOUT,
        retries: env.API_RETRIES,
      },
    };
  }

  // Different configurations for different environments
  static createForEnvironment(
    env: 'development' | 'production' | 'test'
  ): Stage2EnvironmentConfig {
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
let environmentConfig: Stage2EnvironmentConfig | null = null;

export function getStage2EnvironmentConfig(): Stage2EnvironmentConfig {
  if (!environmentConfig) {
    environmentConfig = Stage2EnvironmentConfigFactory.createForEnvironment(
      (process.env.NODE_ENV as 'development' | 'production' | 'test') ||
        'development'
    );
  }
  return environmentConfig;
}

// Export for easier access
export const stage2Env = getStage2EnvironmentConfig();
