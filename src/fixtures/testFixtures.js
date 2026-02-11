/**
 * @file Test Fixtures - Reusable test setup and page objects
 * @description Custom fixtures for Playwright tests with auto-login and page objects
 */

const { test: baseTest } = require('@playwright/test');
const BasePage = require('../pages/BasePage');
const LoginPage = require('../pages/LoginPage');
const HomePage = require('../pages/HomePage');
const config = require('../utils/config');
const logger = require('../utils/logger');

/**
 * Extended test object with custom fixtures
 */
const test = baseTest.extend({
  /**
   * Fresh page fixture - provides a clean page object
   * @param {Object} use - Use function to provide the page
   * @param {Object} page - Playwright page
   * @returns {Promise<void>}
   */
  freshPage: async ({ page }, use) => {
    logger.info('Setting up fresh page fixture');
    const basePage = new BasePage(page);
    
    // Setup: Configure page to handle dialogs
    page.on('dialog', async dialog => {
      logger.warn(`Dialog detected: ${dialog.message()}`);
      await dialog.accept();
    });
    
    // Setup: Log all console messages
    page.on('console', msg => {
      if (msg.type() === 'error') {
        logger.warn(`Console error: ${msg.text()}`);
      }
    });
    
    // Setup: Log all page errors
    page.on('pageerror', error => {
      logger.error('Page error:', error);
    });
    
    await use(basePage);
    
    // Teardown: Log session end
    logger.info('Fresh page fixture teardown completed');
  },

  /**
   * Authenticated page fixture - provides logged-in page with HomePageObject
   * @param {Object} use - Use function to provide the page
   * @param {Object} page - Playwright page
   * @returns {Promise<void>}
   */
  authenticatedPage: async ({ page }, use) => {
    logger.section('SETTING UP AUTHENTICATED PAGE');
    
    try {
      const loginPage = new LoginPage(page);
      const homePage = new HomePage(page);
      
      // Navigate to app
      await loginPage.navigateToLogin();
      
      // Check if already logged in
      const isLoginFormVisible = await loginPage.isLoginFormDisplayed();
      
      if (isLoginFormVisible) {
        logger.info('Login form visible - performing login');
        await loginPage.login(config.CREDENTIALS.email, config.CREDENTIALS.password);
        
        const loginSuccess = await loginPage.verifyLoginSuccess();
        if (!loginSuccess) {
          throw new Error('Login verification failed');
        }
        logger.pass('Successfully authenticated');
      } else {
        logger.info('Already authenticated - skipping login');
      }
      
      // Provide the authenticated page and page objects
      const pageObjects = {
        page,
        homePage,
        loginPage
      };
      
      await use(pageObjects);
      
      logger.info('Authenticated page fixture teardown completed');
    } catch (error) {
      logger.error('Failed to set up authenticated page', error);
      throw error;
    }
  },

  /**
   * Test data fixture - provides centralized test data
   * @param {Function} use - Use function to provide test data
   * @returns {Promise<void>}
   */
  testData: async ({}, use) => {
    logger.debug('Setting up test data fixture');
    
    const testData = {
      // User credentials
      users: {
        validUser: {
          email: config.CREDENTIALS.email,
          password: config.CREDENTIALS.password
        },
        invalidUser: {
          email: config.CREDENTIALS.invalidEmail,
          password: config.CREDENTIALS.invalidPassword
        }
      },
      
      // Product data
      products: {
        validSearch: config.TEST_DATA.validProducts[0],
        invalidSearch: config.TEST_DATA.invalidSearchQuery,
        productList: config.TEST_DATA.validProducts
      },
      
      // Test constants
      timeouts: config.TIMEOUTS,
      delays: config.DELAYS,
      baseUrl: config.BASE_URL,
      
      // Helper methods for test data
      getRandomProduct() {
        const products = this.products.productList;
        return products[Math.floor(Math.random() * products.length)];
      },
      
      /**
       * Generate random email for test
       * @returns {string} - Random email
       */
      generateRandomEmail() {
        const timestamp = Date.now();
        return `testuser_${timestamp}@example.com`;
      },
      
      /**
       * Get test timeout by level
       * @param {string} level - Timeout level (short, medium, long)
       * @returns {number} - Timeout in ms
       */
      getTimeout(level = 'medium') {
        const levels = {
          short: this.timeouts.SHORT,
          medium: this.timeouts.MEDIUM,
          long: this.timeouts.LONG
        };
        return levels[level] || this.timeouts.MEDIUM;
      }
    };
    
    await use(testData);
  },

  /**
   * Page objects fixture - provides all page objects
   * @param {Object} use - Use function to provide page objects
   * @param {Object} page - Playwright page
   * @returns {Promise<void>}
   */
  pages: async ({ page }, use) => {
    logger.debug('Setting up page objects fixture');
    
    const pageObjects = {
      basePage: new BasePage(page),
      loginPage: new LoginPage(page),
      homePage: new HomePage(page)
    };
    
    await use(pageObjects);
  }
});

// Export test instance and page classes
module.exports = {
  test,
  BasePage,
  LoginPage,
  HomePage,
  expect: baseTest.expect
};
