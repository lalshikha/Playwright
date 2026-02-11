/**
 * @file Example Login Tests
 * @description Demonstration of login functionality tests using Page Object Model
 */

const { test, expect } = require('../src/fixtures/testFixtures');
const { LoginPage } = require('../src/fixtures/testFixtures');

test.describe('Login Functionality', () => {
  let loginPage;

  test.beforeEach(async ({ freshPage }) => {
    loginPage = new LoginPage(freshPage.page);
    await loginPage.navigateToLogin();
  });

  test('should display login form elements', async ({ freshPage }) => {
    // Act & Assert
    const isFormDisplayed = await loginPage.isLoginFormDisplayed();
    
    // Verify
    expect(isFormDisplayed).toBeTruthy();
  });

  test('should successfully login with valid credentials', async ({ freshPage, testData }) => {
    // Arrange
    const validUser = testData.users.validUser;
    
    // Act
    await loginPage.login(validUser.email, validUser.password);
    
    // Assert
    const loginSuccess = await loginPage.verifyLoginSuccess();
    expect(loginSuccess).toBeTruthy();
  });

  test('should display error message on invalid credentials', async ({ freshPage, testData }) => {
    // Arrange
    const invalidUser = testData.users.invalidUser;
    
    // Act
    await loginPage.login(invalidUser.email, invalidUser.password);
    
    // Assert
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
    expect(errorMessage?.length).toBeGreaterThan(0);
  });

  test('should clear email field', async ({ freshPage, testData }) => {
    // Arrange
    const validUser = testData.users.validUser;
    
    // Act
    await loginPage.enterEmail(validUser.email);
    const emailValue1 = await loginPage.getEmailField().inputValue();
    await loginPage.clearEmail();
    const emailValue2 = await loginPage.getEmailField().inputValue();
    
    // Assert
    expect(emailValue1).toBe(validUser.email);
    expect(emailValue2).toBe('');
  });

  test('should validate email field is required', async ({ freshPage }) => {
    // Arrange
    const password = 'testPassword123';
    
    // Act
    await loginPage.enterPassword(password);
    await loginPage.clickLoginButton();
    
    // Assert - Check if error is displayed
    const hasError = await loginPage.isErrorDisplayed();
    expect(hasError || !(await loginPage.verifyLoginSuccess())).toBeTruthy();
  });

  test('should navigate to login page correctly', async ({ freshPage }) => {
    // Assert
    const currentUrl = loginPage.getUrl();
    expect(currentUrl).toContain('sauce-demo.myshopify.com');
  });
});

test.describe('Login Form Validation', () => {
  let loginPage;

  test.beforeEach(async ({ freshPage }) => {
    loginPage = new LoginPage(freshPage.page);
    await loginPage.navigateToLogin();
  });

  test('should handle multiple failed login attempts', async ({ freshPage, testData }) => {
    // Arrange
    const invalidUser = testData.users.invalidUser;
    const attempts = 3;
    
    // Act & Assert
    for (let i = 0; i < attempts; i++) {
      await loginPage.attemptInvalidLogin(invalidUser.email, invalidUser.password);
      const hasError = await loginPage.isErrorDisplayed();
      expect(hasError).toBeTruthy();
    }
  });

  test('should maintain form state during errors', async ({ freshPage, testData }) => {
    // Arrange
    const testEmail = 'test@example.com';
    const invalidUser = testData.users.invalidUser;
    
    // Act
    await loginPage.enterEmail(testEmail);
    await loginPage.enterPassword(invalidUser.password);
    await loginPage.clickLoginButton();
    
    // Assert - Email should still be filled
    const emailValue = await loginPage.getEmailField().inputValue();
    expect(emailValue).toBe(testEmail);
  });
});
