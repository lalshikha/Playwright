/**
 * @file LoginPage class - Page Object Model for login functionality
 * @description Handles all login-related interactions
 */

const BasePage = require('./BasePage');
const config = require('../utils/config');

/**
 * Login Page Object
 */
class LoginPage extends BasePage {
  /**
   * Create a LoginPage instance
   * @param {import('@playwright/test').Page} page - Playwright page object
   */
  constructor(page) {
    super(page);
    this.logger.info('LoginPage initialized');
  }

  /**
   * Navigate to login page
   * @returns {Promise<void>}
   * @throws {Error} If navigation fails
   */
  async navigateToLogin() {
    try {
      await this.goto(config.BASE_URL);
      this.logger.pass('Navigated to login page');
    } catch (error) {
      this.logger.error('Failed to navigate to login page', error);
      throw error;
    }
  }

  /**
   * Get email input field locator
   * @returns {import('@playwright/test').Locator} - Email input locator
   */
  getEmailField() {
    return this.page.getByPlaceholder(/email|e-?mail/i);
  }

  /**
   * Get password input field locator
   * @returns {import('@playwright/test').Locator} - Password input locator
   */
  getPasswordField() {
    return this.page.getByPlaceholder(/password/i);
  }

  /**
   * Get login button locator
   * @returns {import('@playwright/test').Locator} - Login button locator
   */
  getLoginButton() {
    return this.page.getByRole('button', { name: /sign in|login|submit/i });
  }

  /**
   * Enter email address
   * @param {string} email - Email address
   * @returns {Promise<void>}
   * @throws {Error} If email field not found or fill fails
   */
  async enterEmail(email) {
    try {
      const emailField = this.getEmailField();
      await emailField.fill(email, { timeout: config.TIMEOUTS.ELEMENT });
      this.logger.pass(`Entered email: ${email}`);
    } catch (error) {
      this.logger.error('Failed to enter email', error);
      throw error;
    }
  }

  /**
   * Enter password
   * @param {string} password - Password
   * @returns {Promise<void>}
   * @throws {Error} If password field not found or fill fails
   */
  async enterPassword(password) {
    try {
      const passwordField = this.getPasswordField();
      await passwordField.fill(password, { timeout: config.TIMEOUTS.ELEMENT });
      this.logger.pass('Entered password');
    } catch (error) {
      this.logger.error('Failed to enter password', error);
      throw error;
    }
  }

  /**
   * Click login button
   * @returns {Promise<void>}
   * @throws {Error} If login button not found or click fails
   */
  async clickLoginButton() {
    try {
      const loginButton = this.getLoginButton();
      await loginButton.click({ timeout: config.TIMEOUTS.ELEMENT });
      this.logger.pass('Clicked login button');
      await this.delay(config.DELAYS.MEDIUM_DELAY);
    } catch (error) {
      this.logger.error('Failed to click login button', error);
      throw error;
    }
  }

  /**
   * Perform complete login
   * @param {string} email - Email address
   * @param {string} password - Password
   * @returns {Promise<void>}
   * @throws {Error} If login process fails
   */
  async login(email = config.CREDENTIALS.email, password = config.CREDENTIALS.password) {
    try {
      this.logger.info('Starting login process');
      await this.enterEmail(email);
      await this.enterPassword(password);
      await this.clickLoginButton();
      this.logger.pass('Login completed successfully');
    } catch (error) {
      this.logger.error('Login process failed', error);
      throw error;
    }
  }

  /**
   * Get error message text
   * @returns {Promise<string|null>} - Error message text or null
   */
  async getErrorMessage() {
    try {
      const errorElement = this.page.locator('[role="alert"], .error, .error-message, [class*="error"]').first();
      const isVisible = await errorElement.isVisible({ timeout: config.TIMEOUTS.SHORT }).catch(() => false);
      
      if (isVisible) {
        const errorText = await errorElement.textContent();
        this.logger.warn(`Error message found: ${errorText}`);
        return errorText;
      }
      
      return null;
    } catch (error) {
      this.logger.debug('No error message found');
      return null;
    }
  }

  /**
   * Check if error message is displayed
   * @returns {Promise<boolean>} - True if error is displayed
   */
  async isErrorDisplayed() {
    try {
      const errorMessage = await this.getErrorMessage();
      return errorMessage !== null && errorMessage.trim().length > 0;
    } catch (error) {
      this.logger.debug('Error checking for error message');
      return false;
    }
  }

  /**
   * Validate login form is displayed
   * @returns {Promise<boolean>} - True if login form is visible
   */
  async isLoginFormDisplayed() {
    try {
      const emailField = this.getEmailField();
      const passwordField = this.getPasswordField();
      const loginButton = this.getLoginButton();
      
      const emailVisible = await emailField.isVisible({ timeout: config.TIMEOUTS.SHORT }).catch(() => false);
      const passwordVisible = await passwordField.isVisible({ timeout: config.TIMEOUTS.SHORT }).catch(() => false);
      const buttonVisible = await loginButton.isVisible({ timeout: config.TIMEOUTS.SHORT }).catch(() => false);
      
      const isDisplayed = emailVisible && passwordVisible && buttonVisible;
      
      if (isDisplayed) {
        this.logger.pass('Login form is displayed');
      } else {
        this.logger.warn('Login form is NOT fully displayed');
      }
      
      return isDisplayed;
    } catch (error) {
      this.logger.error('Failed to validate login form', error);
      return false;
    }
  }

  /**
   * Verify successful login by checking dashboard
   * @returns {Promise<boolean>} - True if logged in successfully
   */
  async verifyLoginSuccess() {
    try {
      // Check if we're no longer on login page by verifying email field is gone
      const emailField = this.getEmailField();
      const isLoginPageStillVisible = await emailField.isVisible({ timeout: config.TIMEOUTS.SHORT }).catch(() => false);
      
      if (!isLoginPageStillVisible) {
        this.logger.pass('Successfully verified login - login form is no longer visible');
        return true;
      }
      
      this.logger.warn('Login verification failed - still on login page');
      return false;
    } catch (error) {
      this.logger.error('Failed to verify login success', error);
      return false;
    }
  }

  /**
   * Clear email field
   * @returns {Promise<void>}
   * @throws {Error} If field not found or clear fails
   */
  async clearEmail() {
    try {
      const emailField = this.getEmailField();
      await emailField.clear();
      this.logger.debug('Email field cleared');
    } catch (error) {
      this.logger.error('Failed to clear email field', error);
      throw error;
    }
  }

  /**
   * Clear password field
   * @returns {Promise<void>}
   * @throws {Error} If field not found or clear fails
   */
  async clearPassword() {
    try {
      const passwordField = this.getPasswordField();
      await passwordField.clear();
      this.logger.debug('Password field cleared');
    } catch (error) {
      this.logger.error('Failed to clear password field', error);
      throw error;
    }
  }

  /**
   * Attempt login with invalid credentials
   * @param {string} email - Invalid email
   * @param {string} password - Invalid password
   * @returns {Promise<string|null>} - Error message if displayed
   */
  async attemptInvalidLogin(
    email = config.CREDENTIALS.invalidEmail,
    password = config.CREDENTIALS.invalidPassword
  ) {
    try {
      this.logger.info('Attempting login with invalid credentials');
      await this.login(email, password);
      await this.delay(config.DELAYS.MEDIUM_DELAY);
      
      const errorMessage = await this.getErrorMessage();
      if (errorMessage) {
        this.logger.pass(`Invalid login error captured: ${errorMessage}`);
      } else {
        this.logger.warn('No error message displayed for invalid credentials');
      }
      
      return errorMessage;
    } catch (error) {
      this.logger.error('Failed during invalid login attempt', error);
      throw error;
    }
  }
}

module.exports = LoginPage;
