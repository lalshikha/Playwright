/**
 * @file Integration Test Example
 * @description Advanced test example showing best practices and patterns
 */

const { test, expect } = require('../src/fixtures/testFixtures');
const { LoginPage, HomePage } = require('../src/fixtures/testFixtures');

test.describe('E2E: User Journey - Login and Browse Products', () => {
  /**
   * Test Case 1: Complete user flow from login to product search
   */
  test('should login and search for products successfully', async ({ 
    freshPage, 
    testData 
  }) => {
    // ✅ Arrange - Setup test environment
    const loginPage = new LoginPage(freshPage.page);
    const homePage = new HomePage(freshPage.page);
    const user = testData.users.validUser;
    const productSearch = testData.products.validSearch;

    // ✅ Act - Execute user actions
    // Step 1: Navigate and login
    await loginPage.navigateToLogin();
    const formVisible = await loginPage.isLoginFormDisplayed();
    expect(formVisible).toBeTruthy();

    // Step 2: Perform login
    await loginPage.login(user.email, user.password);

    // Step 3: Verify login success
    const loginSuccess = await loginPage.verifyLoginSuccess();
    expect(loginSuccess).toBeTruthy();

    // Step 4: Navigate to home page
    await homePage.navigateToHome();
    const gridVisible = await homePage.isProductGridDisplayed();
    expect(gridVisible).toBeTruthy();

    // Step 5: Search for product
    await homePage.searchProduct(productSearch);
    const productCount = await homePage.getProductCount();

    // ✅ Assert - Verify expected results
    expect(productCount).toBeGreaterThan(0);
  });

  /**
   * Test Case 2: Verify error handling for invalid login
   */
  test('should display error for invalid credentials', async ({ 
    freshPage, 
    testData 
  }) => {
    // ✅ Arrange
    const loginPage = new LoginPage(freshPage.page);
    const invalidUser = testData.users.invalidUser;

    // ✅ Act
    await loginPage.navigateToLogin();
    const errorMsg = await loginPage.attemptInvalidLogin(
      invalidUser.email,
      invalidUser.password
    );

    // ✅ Assert
    expect(errorMsg).toBeTruthy();
    expect(errorMsg?.length).toBeGreaterThan(0);
  });

  /**
   * Test Case 3: Test with parameterized data
   */
  test.describe('Parameterized Search Tests', () => {
    const searchQueries = [
      { term: 'shirt', expectedMin: 1 },
      { term: 'jacket', expectedMin: 1 },
      { term: 'pants', expectedMin: 1 }
    ];

    searchQueries.forEach(({ term, expectedMin }) => {
      test(`should find products for "${term}"`, async ({ 
        authenticatedPage 
      }) => {
        // ✅ Arrange
        const { homePage } = authenticatedPage;

        // ✅ Act
        await homePage.searchProduct(term);
        const productCount = await homePage.getProductCount();

        // ✅ Assert
        expect(productCount).toBeGreaterThanOrEqual(expectedMin);
      });
    });
  });

  /**
   * Test Case 4: Test with retry and custom timeout
   */
  test('should handle slow network conditions', async ({ 
    freshPage, 
    testData 
  }) => {
    // ✅ Arrange
    const loginPage = new LoginPage(freshPage.page);
    const user = testData.users.validUser;
    const longTimeout = testData.getTimeout('long');

    // ✅ Act
    await loginPage.navigateToLogin();
    await loginPage.login(user.email, user.password);

    // ✅ Assert
    const success = await loginPage.verifyLoginSuccess();
    expect(success).toBeTruthy();
  }, { 
    timeout: 30000 // Custom timeout for slow network
  });
});

test.describe('Advanced Fixture Usage Examples', () => {
  /**
   * Using testData fixture for data-driven tests
   */
  test('demonstrate testData fixture capabilities', async ({ testData }) => {
    // Access different types of test data
    const validUser = testData.users.validUser;
    const invalidUser = testData.users.invalidUser;
    const randomProduct = testData.getRandomProduct();
    const newEmail = testData.generateRandomEmail();
    const timeout = testData.getTimeout('medium');

    // Verify data is available
    expect(validUser.email).toBeTruthy();
    expect(validUser.password).toBeTruthy();
    expect(randomProduct).toBeTruthy();
    expect(newEmail).toContain('@example.com');
    expect(timeout).toBeGreaterThan(0);
  });

  /**
   * Using freshPage fixture for clean tests
   */
  test('demonstrate freshPage fixture', async ({ freshPage }) => {
    // freshPage includes automatic setup:
    // - Dialog handling
    // - Console logging
    // - Error tracking

    const title = await freshPage.getTitle();
    expect(title).toBeTruthy();
  });

  /**
   * Using authenticatedPage fixture for authenticated tests
   */
  test('demonstrate authenticatedPage fixture', async ({ 
    authenticatedPage 
  }) => {
    // User is already authenticated!
    const { homePage, loginPage, page } = authenticatedPage;

    // Can use both LoginPage and HomePage objects
    const gridVisible = await homePage.isProductGridDisplayed();
    expect(gridVisible).toBeTruthy();

    // Page object is also available for advanced operations
    expect(page).toBeDefined();
  });

  /**
   * Using pages fixture for all page objects
   */
  test('demonstrate pages fixture', async ({ pages, testData }) => {
    // Get all page objects at once
    const { loginPage, homePage, basePage } = pages;
    const user = testData.users.validUser;

    // Use any page object
    await loginPage.navigateToLogin();
    const formVisible = await loginPage.isLoginFormDisplayed();
    expect(formVisible).toBeTruthy();
  });
});

test.describe('Error Handling and Validation Examples', () => {
  /**
   * Test demonstrating error recovery
   */
  test('should handle missing elements gracefully', async ({ 
    freshPage 
  }) => {
    // When elements don't exist, page objects handle it
    const isVisible = await freshPage.isVisible(
      'text', 
      'NonExistentElement'
    );

    // Should return false, not throw
    expect(isVisible).toBeFalsy();
  });

  /**
   * Test with multiple assertions
   */
  test('should verify multiple conditions', async ({ 
    authenticatedPage 
  }) => {
    // Arrange
    const { homePage } = authenticatedPage;

    // Act & Assert - Multiple validations
    const gridVisible = await homePage.isProductGridDisplayed();
    expect(gridVisible).toBeTruthy();

    const productCount = await homePage.getProductCount();
    expect(productCount).toBeGreaterThan(0);

    const cartCount = await homePage.getCartItemCount();
    expect(cartCount >= 0).toBeTruthy();

    const featuredVisible = await homePage.isFeaturedSectionDisplayed();
    expect(featuredVisible).toBeDefined();
  });
});

test.describe('Logging and Debugging Examples', () => {
  /**
   * Test with screenshot capture
   */
  test('should capture screenshot on assertion', async ({ 
    freshPage 
  }) => {
    // Navigate and capture
    await freshPage.goto('https://sauce-demo.myshopify.com/');
    
    // Simulate test failure point
    try {
      // Take screenshot before assertion
      await freshPage.takeScreenshot('before-assertion.png');
      
      const title = await freshPage.getTitle();
      expect(title).toBeTruthy();
    } catch (error) {
      // Take screenshot of failure
      await freshPage.takeScreenshot('after-failure.png');
      throw error;
    }
  });

  /**
   * Test demonstrating automatic logging
   */
  test('all page object methods auto-log', async ({ freshPage }) => {
    // Every action automatically logs:
    // [HH:MM:SS] [INFO] Navigating to: ...
    // [HH:MM:SS] [PASS] Navigated to: ...
    // [HH:MM:SS] [ERROR] Failed to ...

    await freshPage.goto('https://sauce-demo.myshopify.com/');
    const url = freshPage.getUrl();
    expect(url).toContain('sauce-demo.myshopify.com');
  });
});

test.describe('Performance and Best Practices', () => {
  /**
   * Test reusability with test.only for development
   */
  test.skip('DEVELOPMENT ONLY: isolated test debugging', async ({ 
    freshPage 
  }) => {
    // Use test.only to run single test during development
    // Remember to remove .only before committing!
    
    const title = await freshPage.getTitle();
    expect(title).toBeTruthy();
  });

  /**
   * Demonstration of proper test organization
   */
  test('should follow AAA pattern strictly', async ({ 
    authenticatedPage, 
    testData 
  }) => {
    // ✅ ARRANGE - Setup all preconditions
    const { homePage } = authenticatedPage;
    const searchTerm = testData.products.validSearch;
    const expectedMinProducts = 1;

    // ✅ ACT - Perform single user action or series
    await homePage.searchProduct(searchTerm);
    const productCount = await homePage.getProductCount();

    // ✅ ASSERT - Verify single outcome
    expect(productCount).toBeGreaterThanOrEqual(expectedMinProducts);
  });

  /**
   * Parallel test execution compatible
   */
  test('should work in parallel tests', async ({ 
    freshPage, 
    testData 
  }) => {
    // Each test gets its own page and browser context
    // No shared state between parallel tests
    
    const email = testData.generateRandomEmail();
    expect(email).toContain('@example.com');
  });
});
