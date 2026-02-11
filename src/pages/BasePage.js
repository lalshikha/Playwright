/**
 * @file BasePage class - Base class for all page objects
 * @description Provides common functionality for all page objects
 */

const logger = require('../utils/logger');
const config = require('../utils/config');

/**
 * Base Page Object class with common automation methods
 */
class BasePage {
  /**
   * Create a BasePage instance
   * @param {import('@playwright/test').Page} page - Playwright page object
   * @throws {Error} If page is not provided
   */
  constructor(page) {
    if (!page) {
      throw new Error('Page object is required to initialize BasePage');
    }
    this.page = page;
    this.logger = logger;
  }

  /**
   * Navigate to a URL
   * @param {string} url - URL to navigate to
   * @param {Object} options - Navigation options
   * @param {number} options.timeout - Navigation timeout in ms
   * @returns {Promise<import('@playwright/test').Response|null>}
   * @throws {Error} If navigation fails
   */
  async goto(url, options = {}) {
    try {
      const timeout = options.timeout || config.TIMEOUTS.NAVIGATION;
      this.logger.info(`Navigating to: ${url}`);
      const response = await this.page.goto(url, { waitUntil: 'networkidle', timeout });
      this.logger.pass(`Successfully navigated to: ${url}`);
      return response;
    } catch (error) {
      this.logger.error(`Failed to navigate to ${url}`, error);
      throw error;
    }
  }

  /**
   * Wait for page to load completely
   * @param {number} timeout - Timeout in ms
   * @returns {Promise<void>}
   */
  async waitForPageLoad(timeout = config.TIMEOUTS.MEDIUM) {
    try {
      await this.page.waitForLoadState('networkidle', { timeout });
      this.logger.debug('Page loaded successfully');
    } catch (error) {
      this.logger.warn('Page load timeout - proceeding with test');
    }
  }

  /**
   * Click an element using getByRole
   * @param {string} role - ARIA role (button, link, menuitem, etc.)
   * @param {string|Object} nameOrOptions - Element name or options object
   * @param {Object} options - Additional click options
   * @returns {Promise<void>}
   * @throws {Error} If element not found or click fails
   */
  async clickByRole(role, nameOrOptions, options = {}) {
    try {
      const timeout = options.timeout || config.TIMEOUTS.ELEMENT;
      let locator;
      
      if (typeof nameOrOptions === 'string') {
        locator = this.page.getByRole(role, { name: new RegExp(nameOrOptions, 'i') });
      } else {
        locator = this.page.getByRole(role, nameOrOptions);
      }
      
      await locator.click({ timeout, ...options });
      this.logger.pass(`Clicked element with role: ${role}`);
    } catch (error) {
      this.logger.error(`Failed to click element with role: ${role}`, error);
      throw error;
    }
  }

  /**
   * Click an element using getByText
   * @param {string} text - Exact or partial text to match
   * @param {Object} options - Click and locator options
   * @returns {Promise<void>}
   * @throws {Error} If element not found or click fails
   */
  async clickByText(text, options = {}) {
    try {
      const timeout = options.timeout || config.TIMEOUTS.ELEMENT;
      const locator = this.page.getByText(new RegExp(text, 'i'));
      await locator.first().click({ timeout, ...options });
      this.logger.pass(`Clicked element with text: ${text}`);
    } catch (error) {
      this.logger.error(`Failed to click element with text: ${text}`, error);
      throw error;
    }
  }

  /**
   * Click an element using getByTestId
   * @param {string} testId - Test ID value
   * @param {Object} options - Click options
   * @returns {Promise<void>}
   * @throws {Error} If element not found or click fails
   */
  async clickByTestId(testId, options = {}) {
    try {
      const timeout = options.timeout || config.TIMEOUTS.ELEMENT;
      const locator = this.page.getByTestId(testId);
      await locator.click({ timeout, ...options });
      this.logger.pass(`Clicked element with testId: ${testId}`);
    } catch (error) {
      this.logger.error(`Failed to click element with testId: ${testId}`, error);
      throw error;
    }
  }

  /**
   * Fill input field using getByRole
   * @param {string} name - Accessible name of the input
   * @param {string} value - Value to enter
   * @param {Object} options - Fill options
   * @returns {Promise<void>}
   * @throws {Error} If input not found or fill fails
   */
  async fillInput(name, value, options = {}) {
    try {
      const locator = this.page.getByRole('textbox', { name: new RegExp(name, 'i') });
      await locator.fill(value, options);
      this.logger.pass(`Filled input "${name}" with value: ${value}`);
    } catch (error) {
      this.logger.error(`Failed to fill input "${name}"`, error);
      throw error;
    }
  }

  /**
   * Fill password field
   * @param {string} name - Accessible name of the password field
   * @param {string} value - Password value
   * @param {Object} options - Fill options
   * @returns {Promise<void>}
   * @throws {Error} If field not found or fill fails
   */
  async fillPassword(name, value, options = {}) {
    try {
      const locator = this.page.locator(`input[type="password"]`).filter({ has: this.page.locator(`label:has-text("${name}")`) }).first();
      await locator.fill(value, options);
      this.logger.pass(`Filled password field with masked value`);
    } catch (error) {
      // Fallback to getByPlaceholder or getByLabel
      try {
        await this.page.getByPlaceholder(new RegExp(name, 'i')).fill(value, options);
        this.logger.pass(`Filled password field with placeholder`);
      } catch (fallbackError) {
        this.logger.error(`Failed to fill password field "${name}"`, fallbackError);
        throw fallbackError;
      }
    }
  }

  /**
   * Get text content of an element
   * @param {string} text - Text to search for
   * @returns {Promise<string>} - Text content
   * @throws {Error} If element not found
   */
  async getTextByText(text) {
    try {
      const content = await this.page.getByText(new RegExp(text, 'i')).first().textContent();
      this.logger.debug(`Retrieved text: ${content}`);
      return content || '';
    } catch (error) {
      this.logger.error(`Failed to get text for: ${text}`, error);
      throw error;
    }
  }

  /**
   * Check if element is visible
   * @param {string} locatorType - Type of locator (role, text, testId)
   * @param {string} locatorValue - Value of locator
   * @returns {Promise<boolean>} - True if visible, false otherwise
   */
  async isVisible(locatorType, locatorValue) {
    try {
      let locator;
      
      switch (locatorType) {
        case 'role':
          locator = this.page.getByRole(locatorValue);
          break;
        case 'text':
          locator = this.page.getByText(new RegExp(locatorValue, 'i'));
          break;
        case 'testId':
          locator = this.page.getByTestId(locatorValue);
          break;
        default:
          throw new Error(`Unknown locator type: ${locatorType}`);
      }
      
      const isVisible = await locator.isVisible({ timeout: config.TIMEOUTS.SHORT });
      this.logger.debug(`Element visibility check [${locatorType}: ${locatorValue}]: ${isVisible}`);
      return isVisible;
    } catch (error) {
      this.logger.debug(`Element not visible: ${locatorValue}`);
      return false;
    }
  }

  /**
   * Wait for element to be visible
   * @param {string} locatorType - Type of locator (role, text, testId)
   * @param {string} locatorValue - Value of locator
   * @param {number} timeout - Timeout in ms
   * @returns {Promise<void>}
   * @throws {Error} If element not visible after timeout
   */
  async waitForVisibility(locatorType, locatorValue, timeout = config.TIMEOUTS.ELEMENT) {
    try {
      let locator;
      
      switch (locatorType) {
        case 'role':
          locator = this.page.getByRole(locatorValue);
          break;
        case 'text':
          locator = this.page.getByText(new RegExp(locatorValue, 'i'));
          break;
        case 'testId':
          locator = this.page.getByTestId(locatorValue);
          break;
        default:
          throw new Error(`Unknown locator type: ${locatorType}`);
      }
      
      await locator.waitFor({ state: 'visible', timeout });
      this.logger.pass(`Element became visible: ${locatorValue}`);
    } catch (error) {
      this.logger.error(`Element did not become visible: ${locatorValue}`, error);
      throw error;
    }
  }

  /**
   * Delay execution for specified time
   * @param {number} ms - Milliseconds to wait
   * @returns {Promise<void>}
   */
  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get page URL
   * @returns {string} - Current page URL
   */
  getUrl() {
    return this.page.url();
  }

  /**
   * Get page title
   * @returns {Promise<string>} - Page title
   */
  async getTitle() {
    return await this.page.title();
  }

  /**
   * Go back in browser history
   * @returns {Promise<void>}
   * @throws {Error} If navigation fails
   */
  async goBack() {
    try {
      await this.page.goBack({ waitUntil: 'networkidle' });
      this.logger.pass('Navigated back');
    } catch (error) {
      this.logger.error('Failed to navigate back', error);
      throw error;
    }
  }

  /**
   * Go forward in browser history
   * @returns {Promise<void>}
   * @throws {Error} If navigation fails
   */
  async goForward() {
    try {
      await this.page.goForward({ waitUntil: 'networkidle' });
      this.logger.pass('Navigated forward');
    } catch (error) {
      this.logger.error('Failed to navigate forward', error);
      throw error;
    }
  }

  /**
   * Refresh the page
   * @returns {Promise<void>}
   * @throws {Error} If refresh fails
   */
  async refresh() {
    try {
      await this.page.reload({ waitUntil: 'networkidle' });
      this.logger.pass('Page refreshed');
    } catch (error) {
      this.logger.error('Failed to refresh page', error);
      throw error;
    }
  }

  /**
   * Take screenshot
   * @param {string} filename - Filename for screenshot
   * @returns {Promise<Buffer>} - Screenshot buffer
   * @throws {Error} If screenshot capture fails
   */
  async takeScreenshot(filename) {
    try {
      const screenshot = await this.page.screenshot({ path: filename });
      this.logger.info(`Screenshot saved: ${filename}`);
      return screenshot;
    } catch (error) {
      this.logger.error(`Failed to take screenshot: ${filename}`, error);
      throw error;
    }
  }
}

module.exports = BasePage;
