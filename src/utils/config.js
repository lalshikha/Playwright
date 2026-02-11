/**
 * @file Configuration module for Playwright automation
 * @description Centralized configuration for all test settings
 */

/**
 * Test configuration object
 * @typedef {Object} TestConfig
 * @property {string} BASE_URL - Application URL
 * @property {Object} CREDENTIALS - Login credentials
 * @property {string} CREDENTIALS.email - Test email
 * @property {string} CREDENTIALS.password - Test password
 * @property {Object} TIMEOUTS - Timeout configurations
 * @property {number} TIMEOUTS.SHORT - Short timeout (2s)
 * @property {number} TIMEOUTS.MEDIUM - Medium timeout (5s)
 * @property {number} TIMEOUTS.LONG - Long timeout (10s)
 * @property {Object} DELAYS - Intentional wait times
 * @property {number} DELAYS.SHORT_DELAY - 500ms
 * @property {number} DELAYS.MEDIUM_DELAY - 1000ms
 */

const config = {
  // Application URL
  BASE_URL: process.env.BASE_URL || 'https://sauce-demo.myshopify.com/',

  // Test Credentials
  CREDENTIALS: {
    email: process.env.TEST_EMAIL || 'test@example.com',
    password: process.env.TEST_PASSWORD || 'testPassword123',
    invalidEmail: 'invalid@test.com',
    invalidPassword: 'wrongPassword'
  },

  // Timeout configurations (in milliseconds)
  TIMEOUTS: {
    SHORT: 2000,      // 2 seconds
    MEDIUM: 5000,     // 5 seconds
    LONG: 10000,      // 10 seconds
    NAVIGATION: 8000, // Navigation timeout
    ELEMENT: 3000     // Element visibility timeout
  },

  // Intentional delays for test flow
  DELAYS: {
    SHORT_DELAY: 500,     // 500ms
    MEDIUM_DELAY: 1000,   // 1 second
    LONG_DELAY: 2000      // 2 seconds
  },

  // Test data
  TEST_DATA: {
    validProducts: ['shirt', 'jacket', 'pants'],
    searchQuery: 'shirt',
    invalidSearchQuery: 'nonexistentproduct12345'
  },

  // Environment
  ENV: {
    HEADLESS: process.env.HEADLESS !== 'false',
    DEBUG: process.env.DEBUG === 'true',
    SLOW_MO: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 0
  }
};

module.exports = config;
