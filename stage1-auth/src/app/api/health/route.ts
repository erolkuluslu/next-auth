// Health check endpoint for 12-Factor App monitoring

import { NextResponse } from 'next/server';
import { getEnvironmentConfig } from '@/config/environment';

interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version: string;
  environment: string;
  uptime: number;
  services: {
    auth: 'available' | 'unavailable';
    environment: 'configured' | 'misconfigured';
  };
}

export async function GET(): Promise<NextResponse<HealthStatus>> {
  try {
    const env = getEnvironmentConfig();
    
    // Check if essential services are available
    const authStatus = checkAuthService();
    const envStatus = checkEnvironmentConfig();
    
    const health: HealthStatus = {
      status: (authStatus === 'available' && envStatus === 'configured') ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      version: env.app.version,
      environment: env.app.nodeEnv,
      uptime: process.uptime(),
      services: {
        auth: authStatus,
        environment: envStatus,
      },
    };

    const statusCode = health.status === 'healthy' ? 200 : 503;
    
    return NextResponse.json(health, { status: statusCode });
  } catch (error) {
    console.error('Health check failed:', error);
    
    const health: HealthStatus = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: 'unknown',
      environment: process.env.NODE_ENV || 'unknown',
      uptime: process.uptime(),
      services: {
        auth: 'unavailable',
        environment: 'misconfigured',
      },
    };

    return NextResponse.json(health, { status: 503 });
  }
}

function checkAuthService(): 'available' | 'unavailable' {
  try {
    // Check if Auth0 configuration is present
    const hasAuth0Config = !!(
      process.env.AUTH0_CLIENT_ID &&
      process.env.AUTH0_CLIENT_SECRET &&
      process.env.AUTH0_DOMAIN
    );
    
    // Check if NextAuth configuration is present
    const hasNextAuthConfig = !!(
      process.env.NEXTAUTH_URL &&
      process.env.NEXTAUTH_SECRET
    );
    
    return (hasAuth0Config && hasNextAuthConfig) ? 'available' : 'unavailable';
  } catch {
    return 'unavailable';
  }
}

function checkEnvironmentConfig(): 'configured' | 'misconfigured' {
  try {
    // Verify environment configuration can be loaded
    const env = getEnvironmentConfig();
    
    // Check required configuration sections
    const hasAuthConfig = !!(env.auth && env.auth.nextAuthSecret);
    const hasAppConfig = !!(env.app && env.app.nodeEnv);
    
    return (hasAuthConfig && hasAppConfig) ? 'configured' : 'misconfigured';
  } catch {
    return 'misconfigured';
  }
}