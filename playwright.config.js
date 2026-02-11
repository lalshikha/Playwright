/**
 * @file Playwright Configuration
 * @description Complete Playwright test configuration with multi-browser setup
 */

const { defineConfig, devices } = require('@playwright/test');
const config = require('./src/utils/config');
const logger = require('./src/utils/logger');

/**
 * Playwright configuration object
 * @type {import('@playwright/test').PlaywrightTestConfig}
 */
module.exports = defineConfig({
  testDir: './tests',
  
  /**
   * Test execution settings
   */
  
  /* Run tests in files in parallel */
  fullyParallel: false,
  
  /* Maximum time one test can run */
  timeout: config.TIMEOUTS.LONG,
  
  /* Expect timeout for assertions */
  expect: {
    timeout: config.TIMEOUTS.MEDIUM
  },
  
  /* Fail the build on CI if test.only is left in code */
  forbidOnly: !!process.env.CI,
  
  /* Retry strategy */
  retries: process.env.CI ? 2 : 0,
  
  /* Worker configuration */
  workers: process.env.CI ? 1 : undefined,
  
  /**
   * Reporter configuration
   */
  reporter: [
    /* HTML reporter with detailed report */
    ['html', {
      open: process.env.CI ? 'never' : 'on-failure',
      outputFolder: 'playwright-report'
    }],
    
    /* List reporter for console output */
    ['list'],
    
    /* JUnit reporter for CI integration */
    ['junit', { outputFile: 'test-results/junit.xml' }],
    
    /* JSON reporter for detailed analysis */
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  
  /**
   * Shared settings for all projects
   */
  use: {
    /* Base URL for the application */
    baseURL: config.BASE_URL,
    
    /* Slow down actions for debugging */
    slowMo: config.ENV.SLOW_MO,
    
    /* Screenshot configuration */
    screenshot: 'only-on-failure',
    
    /* Video recording */
    video: 'retain-on-failure',
    
    /* Trace recording for debugging */
    trace: 'on-first-retry',
    
    /* Accept all downloads without prompting */
    acceptDownloads: true,
    
    /* Ignore HTTPS errors for testing */
    ignoreHTTPSErrors: true,
    
    /* Navigation timeout */
    navigationTimeout: config.TIMEOUTS.NAVIGATION
  },
  
  /**
   * Global setup and teardown
   */
  // globalSetup: './src/hooks/globalSetup.js',
  // globalTeardown: './src/hooks/globalTeardown.js',
  
  /**
   * Browser projects configuration
   */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchArgs: ['--disable-blink-features=AutomationControlled']
      }
    },
    
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox']
      }
    },
    
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari']
      }
    },
    
    /* Chromium in headed mode for debugging */
    {
      name: 'chromium-headed',
      use: {
        ...devices['Desktop Chrome'],
        headless: false
      }
    },
    
    /* Mobile Chrome testing */
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5']
      }
    },
    
    /* Mobile Safari testing */
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 12']
      }
    }
  ],
  
  /**
   * Web server configuration (if needed)
   */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120 * 1000
  // }
});

