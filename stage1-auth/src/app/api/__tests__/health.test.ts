/**
 * @jest-environment node
 */

import { GET } from '../health/route';
import { NextRequest } from 'next/server';

// Mock environment configuration
jest.mock('@/config/environment', () => ({
  getEnvironmentConfig: jest.fn(() => ({
    app: {
      version: '1.0.0',
      nodeEnv: 'test',
    },
    auth: {
      nextAuthSecret: 'test-secret',
    },
  })),
}));

// Mock environment variables
const originalEnv = process.env;

beforeEach(() => {
  jest.resetModules();
  process.env = {
    ...originalEnv,
    NODE_ENV: 'test',
    AUTH0_CLIENT_ID: 'test-client-id',
    AUTH0_CLIENT_SECRET: 'test-client-secret',
    AUTH0_DOMAIN: 'test.auth0.com',
    NEXTAUTH_URL: 'http://localhost:3000',
    NEXTAUTH_SECRET: 'test-secret-min-32-characters-long',
  };
});

afterEach(() => {
  process.env = originalEnv;
});

describe('/api/health', () => {
  it('should return healthy status when all services are available', async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      status: 'healthy',
      timestamp: expect.any(String),
      version: '1.0.0',
      environment: 'test',
      uptime: expect.any(Number),
      services: {
        auth: 'available',
        environment: 'configured',
      },
    });
  });

  it('should return unhealthy status when auth service is unavailable', async () => {
    // Remove required auth environment variables
    delete process.env.AUTH0_CLIENT_ID;
    delete process.env.NEXTAUTH_SECRET;

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.status).toBe('unhealthy');
    expect(data.services.auth).toBe('unavailable');
  });

  it('should return unhealthy status when environment configuration fails', async () => {
    // Mock environment config to throw error
    jest.doMock('@/config/environment', () => ({
      getEnvironmentConfig: jest.fn(() => {
        throw new Error('Configuration error');
      }),
    }));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.status).toBe('unhealthy');
    expect(data.services.environment).toBe('misconfigured');
  });

  it('should include proper timestamp format', async () => {
    const response = await GET();
    const data = await response.json();

    expect(data.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);
  });

  it('should include uptime as a number', async () => {
    const response = await GET();
    const data = await response.json();

    expect(typeof data.uptime).toBe('number');
    expect(data.uptime).toBeGreaterThanOrEqual(0);
  });

  it('should handle partial environment configuration', async () => {
    // Keep some required variables but remove others
    delete process.env.AUTH0_DOMAIN;

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.status).toBe('unhealthy');
    expect(data.services.auth).toBe('unavailable');
  });

  it('should validate NextAuth configuration separately', async () => {
    // Remove only NextAuth config
    delete process.env.NEXTAUTH_SECRET;

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.services.auth).toBe('unavailable');
  });

  it('should return consistent response structure even on errors', async () => {
    // Cause an error by mocking the entire function to throw
    const originalConsoleError = console.error;
    console.error = jest.fn();

    // Mock environment config to throw error
    jest.doMock('@/config/environment', () => ({
      getEnvironmentConfig: jest.fn(() => {
        throw new Error('Fatal error');
      }),
    }));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data).toEqual({
      status: 'unhealthy',
      timestamp: expect.any(String),
      version: 'unknown',
      environment: 'test',
      uptime: expect.any(Number),
      services: {
        auth: 'unavailable',
        environment: 'misconfigured',
      },
    });

    console.error = originalConsoleError;
  });
});