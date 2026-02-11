# Playwright Test Automation Framework

A comprehensive, production-ready Playwright testing framework following the **Page Object Model (POM)** pattern with AI-friendly architecture and semantic locators.

## 📋 Table of Contents

- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [Page Objects](#page-objects)
- [Fixtures](#fixtures)
- [Writing Tests](#writing-tests)
- [Running Tests](#running-tests)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## 📁 Project Structure

```
Playwright/
├── src/
│   ├── pages/
│   │   ├── BasePage.js          # Base class with common methods
│   │   ├── LoginPage.js         # Login page object
│   │   └── HomePage.js          # Home page object
│   ├── fixtures/
│   │   └── testFixtures.js      # Custom test fixtures
│   └── utils/
│       ├── config.js            # Configuration settings
│       └── logger.js            # Color-coded logging
├── tests/
│   ├── login.spec.js            # Login tests
│   ├── homepage.spec.js         # Home page tests
│   └── example.spec.js          # Example tests
├── playwright-report/           # Test reports
├── test-results/                # Test results
├── package.json
├── playwright.config.js         # Playwright configuration
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites

- Node.js 16+ installed
- npm or yarn package manager

### Step 1: Install Dependencies

```bash
npm install
```

This installs:
- `@playwright/test` - Playwright testing framework
- `@types/node` - Node.js type definitions
- `winston` - Logging library

### Step 2: Verify Installation

```bash
npx playwright --version
```

## ⚙️ Configuration

### Config File: `src/utils/config.js`

All test configuration is centralized in this file:

```javascript
const config = {
  BASE_URL: 'https://sauce-demo.myshopify.com/',
  CREDENTIALS: {
    email: 'test@example.com',
    password: 'testPassword123'
  },
  TIMEOUTS: {
    SHORT: 2000,
    MEDIUM: 5000,
    LONG: 10000,
    NAVIGATION: 8000
  },
  DELAYS: {
    SHORT_DELAY: 500,
    MEDIUM_DELAY: 1000,
    LONG_DELAY: 2000
  },
  TEST_DATA: {
    validProducts: ['shirt', 'jacket', 'pants'],
    searchQuery: 'shirt'
  }
};
```

### Environment Variables

Set environment variables to override defaults:

```bash
# Testing without headless mode
export HEADLESS=false

# Enable debug mode
export DEBUG=true

# Set custom timeout
export SLOW_MO=1000

# Override credentials (optional)
export TEST_EMAIL=your@email.com
export TEST_PASSWORD=yourpassword

# Override base URL
export BASE_URL=https://your-app.com
```

## 📄 Page Objects

### BasePage Class

The foundation for all page objects. Provides:

- **Navigation Methods**
  - `goto(url, options)` - Navigate to URL
  - `goBack()`, `goForward()`, `refresh()` - Browser controls
  - `getUrl()`, `getTitle()` - Page information

- **Locator Methods (Semantic)**
  - `clickByRole(role, name)` - Click by ARIA role
  - `clickByText(text)` - Click by text content
  - `clickByTestId(testId)` - Click by test ID
  - `fillInput(name, value)` - Fill text input
  - `fillPassword(name, value)` - Fill password field

- **Visibility Methods**
  - `isVisible(locatorType, value)` - Check visibility
  - `waitForVisibility(locatorType, value)` - Wait for element
  - `waitForPageLoad()` - Wait for page to load

- **Utility Methods**
  - `delay(ms)` - Wait for specified time
  - `takeScreenshot(filename)` - Capture screenshot

### LoginPage Class

Extends `BasePage` with login-specific functionality:

```javascript
const { LoginPage } = require('../src/fixtures/testFixtures');

// Example usage
const loginPage = new LoginPage(page);
await loginPage.navigateToLogin();
await loginPage.enterEmail('test@example.com');
await loginPage.enterPassword('password123');
await loginPage.clickLoginButton();
const success = await loginPage.verifyLoginSuccess();
```

**Available Methods:**

- `navigateToLogin()` - Navigate to login page
- `enterEmail(email)` - Enter email address
- `enterPassword(password)` - Enter password
- `login(email, password)` - Complete login flow
- `getErrorMessage()` - Get error message
- `isErrorDisplayed()` - Check if error shown
- `isLoginFormDisplayed()` - Check form visibility
- `verifyLoginSuccess()` - Verify successful login
- `attemptInvalidLogin(email, password)` - Test invalid login

### HomePage Class

Extends `BasePage` with home page-specific functionality:

```javascript
const { HomePage } = require('../src/fixtures/testFixtures');

const homePage = new HomePage(page);
await homePage.navigateToHome();
await homePage.searchProduct('shirt');
const count = await homePage.getProductCount();
await homePage.openCart();
```

**Available Methods:**

- `navigateToHome()` - Navigate to home page
- `searchProduct(productName)` - Search for product
- `getProductCount()` - Get number of products
- `clickProduct(productName)` - Click product by name
- `clickProductByIndex(index)` - Click product by index
- `addProductToCart(productName)` - Add to cart
- `openCart()` - Open shopping cart
- `sortProducts(sortOption)` - Sort products
- `applyFilter(filterName, value)` - Apply filter
- `clearAllFilters()` - Clear all filters
- `isProductGridDisplayed()` - Check grid visibility
- `isNoResultsDisplayed()` - Check no results message

## 🔧 Fixtures

Custom fixtures provide reusable test setup and page objects.

### freshPage Fixture

Provides a clean page object with automatic setup:

```javascript
test('example', async ({ freshPage }) => {
  await freshPage.goto('https://example.com');
  // Use freshPage methods
});
```

**Features:**
- Automatic dialog handling
- Console message logging
- Error handling

### authenticatedPage Fixture

Provides an already-logged-in page:

```javascript
test('authenticated test', async ({ authenticatedPage }) => {
  const { homePage } = authenticatedPage;
  await homePage.navigateToHome();
  // Already logged in!
});
```

### testData Fixture

Provides centralized test data:

```javascript
test('with test data', async ({ testData }) => {
  const user = testData.users.validUser;
  const product = testData.getRandomProduct();
  const email = testData.generateRandomEmail();
  const timeout = testData.getTimeout('medium');
});
```

### pages Fixture

Provides all page objects:

```javascript
test('using page objects', async ({ pages }) => {
  const { loginPage, homePage, basePage } = pages;
  // Use all page objects
});
```

## ✍️ Writing Tests

### Basic Test Structure

```javascript
const { test, expect } = require('../src/fixtures/testFixtures');
const { LoginPage } = require('../src/fixtures/testFixtures');

test.describe('Login Tests', () => {
  let loginPage;

  test.beforeEach(async ({ freshPage }) => {
    loginPage = new LoginPage(freshPage.page);
    await loginPage.navigateToLogin();
  });

  test('should login successfully', async ({ testData }) => {
    // Arrange
    const user = testData.users.validUser;
    
    // Act
    await loginPage.login(user.email, user.password);
    
    // Assert
    const success = await loginPage.verifyLoginSuccess();
    expect(success).toBeTruthy();
  });
});
```

### AAA Pattern (Arrange-Act-Assert)

```javascript
test('descriptive test name', async ({ freshPage, testData }) => {
  // Arrange - Setup test data and page state
  const testUser = testData.users.validUser;
  
  // Act - Perform the action
  await loginPage.login(testUser.email, testUser.password);
  
  // Assert - Verify the result
  const result = await loginPage.verifyLoginSuccess();
  expect(result).toBeTruthy();
});
```

### Using Semantic Locators

Always use semantic locators (recommended by Playwright):

```javascript
// ✅ Good - Semantic locators
await page.getByRole('button', { name: 'Login' }).click();
await page.getByText('Welcome').isVisible();
await page.getByPlaceholder('Email').fill('test@example.com');
await page.getByTestId('submit-btn').click();

// ❌ Avoid - CSS/XPath selectors in tests
await page.locator('#login-button').click();
await page.locator('//div[@class="message"]').textContent();
```

### Parameterized Tests

```javascript
test.describe('Login with multiple users', () => {
  const testUsers = [
    { email: 'user1@test.com', password: 'pass1' },
    { email: 'user2@test.com', password: 'pass2' },
    { email: 'user3@test.com', password: 'pass3' }
  ];

  testUsers.forEach(user => {
    test(`should login as ${user.email}`, async ({ freshPage }) => {
      const loginPage = new LoginPage(freshPage.page);
      await loginPage.login(user.email, user.password);
      const success = await loginPage.verifyLoginSuccess();
      expect(success).toBeTruthy();
    });
  });
});
```

## ▶️ Running Tests

### Run All Tests

```bash
npm run test:all
```

### Run Specific Test Suite

```bash
# Run login tests
npm run test:login

# Run homepage tests
npm run test:homepage
```

### Run in UI Mode

```bash
npm run test:ui
```

Interactive browser window to watch tests run.

### Run in Headed Mode

```bash
npm run test:headed
```

See browser actions in real-time.

### Run with Debugging

```bash
npm run test:debug
```

Step through tests with Playwright Inspector.

### Run Specific Test File

```bash
npx playwright test tests/login.spec.js
```

### Run Specific Test by Name

```bash
npx playwright test -g "should login successfully"
```

### Run on Specific Browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
npx playwright test --project="Mobile Chrome"
```

### Run with Screenshots and Videos

```bash
npx playwright test --headed --screenshot=on --video=on
```

### Run with Retry (CI Mode)

```bash
npx playwright test --retries=2
```

## 📊 Reports

Test reports are automatically generated:

### HTML Report

```bash
npx playwright show-report
```

Opens interactive HTML report in browser.

**Location:** `playwright-report/index.html`

### JUnit Report

**Location:** `test-results/junit.xml`

Useful for CI/CD integration (Jenkins, GitLab CI, GitHub Actions).

### JSON Report

**Location:** `test-results/results.json`

Detailed results for custom parsing.

## 📝 Logging

The framework includes color-coded logging with timestamps.

### Logger Methods

```javascript
const logger = require('./src/utils/logger');

logger.info('Informational message');      // Cyan
logger.pass('Success message');             // Green
logger.warn('Warning message');             // Yellow
logger.error('Error message');              // Red
logger.debug('Debug message');              // Magenta
logger.section('Section Header');           // Blue with borders
```

### Automatic Logging

All page object methods automatically log:

```javascript
// Automatically logs: [HH:MM:SS] [PASS] Clicked element with role: button
await basePage.clickByRole('button', 'Login');

// Automatically logs: [HH:MM:SS] [INFO] Navigating to: https://example.com
await basePage.goto('https://example.com');

// Automatically logs: [HH:MM:SS] [ERROR] Failed to click element with text: Login
await basePage.clickByText('NonExistentButton').catch(e => {});
```

## ✅ Best Practices

### 1. Use Page Objects for All Interactions

```javascript
// ✅ Good
const loginPage = new LoginPage(page);
await loginPage.login(email, password);

// ❌ Avoid
await page.locator('#email').fill(email);
await page.locator('#password').fill(password);
await page.locator('#login-btn').click();
```

### 2. Use Semantic Locators

```javascript
// ✅ Recommended
await page.getByRole('button', { name: 'Submit' }).click();
await page.getByText('Success').isVisible();
await page.getByPlaceholder('Enter email').fill(email);
await page.getByTestId('modal-close').click();

// ❌ Avoid
await page.locator('button.submit').click();
await page.locator('.success-message').isVisible();
await page.locator('input[placeholder="Enter email"]').fill(email);
```

### 3. Error Handling

All page object methods have built-in error handling:

```javascript
// Methods throw informative errors with logging
try {
  await loginPage.login(email, password);
} catch (error) {
  // Error is already logged with details
  console.error('Login failed:', error.message);
}
```

### 4. Use Fixtures for Setup/Teardown

```javascript
test.describe('Tests', () => {
  test.beforeEach(async ({ freshPage }) => {
    // Run before each test - automated setup
  });

  test.afterEach(async () => {
    // Run after each test - cleanup
  });
});
```

### 5. Use Test Data Fixture

```javascript
// ✅ Good - Centralized test data
test('login', async ({ testData }) => {
  const user = testData.users.validUser;
  // Use centralized credentials
});

// ❌ Avoid - Hardcoded values
test('login', async () => {
  await page.fill('#email', 'test@example.com');
  await page.fill('#password', 'password123');
});
```

### 6. Clear, Descriptive Test Names

```javascript
// ✅ Good
test('should display error message when logging in with invalid credentials', ...);
test('should add product to cart and verify cart count increases', ...);

// ❌ Avoid
test('test 1', ...);
test('login test', ...);
```

### 7. Use AAA Pattern

```javascript
test('example', async ({ freshPage, testData }) => {
  // Arrange - Setup
  const user = testData.users.validUser;
  const loginPage = new LoginPage(freshPage.page);
  
  // Act - Execute
  await loginPage.login(user.email, user.password);
  
  // Assert - Verify
  expect(await loginPage.verifyLoginSuccess()).toBeTruthy();
});
```

### 8. Add JSDoc Comments

```javascript
/**
 * Verify user login was successful
 * @param {string} username - Username to verify
 * @returns {Promise<boolean>} - True if login successful
 * @throws {Error} If verification fails
 */
async verifyLogin(username) {
  // Implementation
}
```

## 🔍 Troubleshooting

### Tests Timing Out

**Problem:** Test exceeds timeout

**Solutions:**

```javascript
// Increase timeout in config.js
TIMEOUTS: {
  LONG: 15000  // Increase from 10000 to 15000
}

// Or increase for specific test
test('slow test', async ({ freshPage }) => {
  // test code
}, { timeout: 30000 });
```

### Element Not Found

**Problem:** `Error: Target page, context or browser has been closed`

**Solutions:**

```javascript
// Wait for element to appear
await loginPage.waitForVisibility('role', 'button');

// Increase timeout
await page.getByRole('button').click({ timeout: 10000 });

// Check if element exists before interaction
const exists = await page.getByRole('button').isVisible().catch(() => false);
if (exists) {
  await page.getByRole('button').click();
}
```

### Flaky Tests

**Problem:** Tests pass sometimes, fail other times

**Solutions:**

```javascript
// Use explicit waits
await page.waitForLoadState('networkidle');
await loginPage.waitForVisibility('role', 'button');

// Avoid fixed delays when possible
// await page.waitForTimeout(1000);  // ❌ Avoid
await page.waitForLoadState('networkidle');  // ✅ Better

// Use retry strategy in config
retries: 2,  // Retry failed tests
```

### Authentication Issues

**Problem:** Tests fail because not logged in

**Solution:** Use `authenticatedPage` fixture

```javascript
// ✅ Use authenticatedPage fixture
test('need auth', async ({ authenticatedPage }) => {
  const { homePage } = authenticatedPage;
  // Already logged in!
});

// Instead of manual login in each test
test('example', async ({ freshPage }) => {
  const loginPage = new LoginPage(freshPage.page);
  await loginPage.login(email, password);
  // More setup...
});
```

### Selector Not Working

**Problem:** Locator returns no elements

**Solutions:**

```javascript
// Use Playwright Inspector
npx playwright test --debug

// Log available locators
const text = await page.getByText(/.*/).allTextContents();
console.log(text);

// Use more flexible regex
await page.getByRole('button', { name: /submit|save/i }).click();

// Try alternative locators
await page.getByPlaceholder('Email').or(page.getByLabel('Email')).fill(email);
```

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright API Reference](https://playwright.dev/docs/api/class-page)
- [Page Object Model Best Practices](https://playwright.dev/docs/pom)
- [Locator Strategy](https://playwright.dev/docs/locators)
- [Test Configuration](https://playwright.dev/docs/test-configuration)

## 📞 Support

For issues or questions:

1. Check the [Playwright Discord](https://discord.gg/playwright)
2. Review [GitHub Issues](https://github.com/microsoft/playwright/issues)
3. Check test logs in `playwright-report/`
4. Run tests with `--debug` flag for detailed output

---

**Happy Testing! 🎭**
