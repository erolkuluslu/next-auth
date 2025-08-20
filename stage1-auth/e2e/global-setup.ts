import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0]?.use || {};
  
  // Launch browser for setup
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('Setting up E2E test environment...');
    
    // Wait for the application to be ready
    console.log(`Checking if app is ready at ${baseURL}`);
    await page.goto(`${baseURL}/api/health`);
    
    // Check if health endpoint responds
    const response = await page.waitForResponse(`${baseURL}/api/health`);
    if (!response.ok()) {
      throw new Error(`Health check failed: ${response.status()}`);
    }
    
    console.log('Application is ready for E2E testing');

    // Create test data or setup if needed
    // This could include seeding test users, setting up test Auth0 tenant, etc.
    
  } catch (error) {
    console.error('Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;