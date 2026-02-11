/**
 * @file Quick Start Guide
 * @description Fast setup and first test guide
 */

/*
╔══════════════════════════════════════════════════════════════════════════════╗
║              PLAYWRIGHT TESTING FRAMEWORK - QUICK START GUIDE                 ║
╚══════════════════════════════════════════════════════════════════════════════╝

📦 STEP 1: INSTALL DEPENDENCIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

npm install

This will install:
  ✓ @playwright/test - Playwright test framework
  ✓ winston - Logging library
  ✓ @types/node - Node.js type definitions


🚀 STEP 2: VERIFY INSTALLATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

npx playwright --version
npx playwright test --version


⚙️ STEP 3: CONFIGURE APPLICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Edit: src/utils/config.js

Set your:
  • BASE_URL (default: https://sauce-demo.myshopify.com/)
  • CREDENTIALS (email and password)
  • TIMEOUTS (adjust if needed)

Optional: Create .env file from .env.example
  cp .env.example .env
  # Update with your values


🧪 STEP 4: RUN YOUR FIRST TEST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Run all tests
npm run test:all

# Run login tests only
npm run test:login

# Run homepage tests only
npm run test:homepage

# Run in UI mode (interactive)
npm run test:ui

# Run with browser visible
npm run test:headed

# Run specific test
npx playwright test -g "should login successfully"


📊 STEP 5: VIEW TEST REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

npx playwright show-report

Open in browser: playwright-report/index.html


📝 STEP 6: CREATE YOUR FIRST TEST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create file: tests/my-first-test.spec.js

Content:
┌──────────────────────────────────────────────────────────────────────────────┐
│ const { test, expect } = require('../src/fixtures/testFixtures');            │
│ const { LoginPage } = require('../src/fixtures/testFixtures');               │
│                                                                              │
│ test('my first test', async ({ freshPage }) => {                            │
│   const loginPage = new LoginPage(freshPage.page);                          │
│   await loginPage.navigateToLogin();                                        │
│   const formVisible = await loginPage.isLoginFormDisplayed();               │
│   expect(formVisible).toBeTruthy();                                         │
│ });                                                                          │
└──────────────────────────────────────────────────────────────────────────────┘

Run it:
  npx playwright test tests/my-first-test.spec.js


💡 KEY CONCEPTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. PAGE OBJECTS
   ✓ LoginPage - Login functionality
   ✓ HomePage - Product browsing
   ✓ BasePage - Common methods

2. FIXTURES (Reusable setup)
   ✓ freshPage - Clean page
   ✓ authenticatedPage - Logged-in page
   ✓ testData - Test data
   ✓ pages - All page objects

3. SEMANTIC LOCATORS (Recommended)
   ✓ getByRole('button', { name: 'Login' })
   ✓ getByText('Welcome')
   ✓ getByPlaceholder('Email')
   ✓ getByTestId('submit-button')

4. LOGGING
   ✓ Automatic color-coded logs
   ✓ Timestamps on every action
   ✓ Error tracking


📂 PROJECT STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Playwright/
├── src/
│   ├── pages/
│   │   ├── BasePage.js .............. Base class with common methods
│   │   ├── LoginPage.js ............ Login page object
│   │   └── HomePage.js ............ Home page object
│   ├── fixtures/
│   │   └── testFixtures.js ......... Custom test fixtures
│   └── utils/
│       ├── config.js ............... Configuration settings
│       └── logger.js ............... Logging utility
├── tests/
│   ├── login.spec.js ............... Login test examples
│   ├── homepage.spec.js ........... Home page test examples
│   └── your-test.spec.js ......... Your custom tests
├── playwright.config.js ........... Test configuration
├── package.json ................... Dependencies
└── README.md ...................... Full documentation


🔧 USEFUL COMMANDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

npm run test:all                 Run all tests
npm run test:login              Run login tests only
npm run test:homepage           Run homepage tests only
npm run test:ui                 Run in UI mode
npm run test:headed             Run with visible browser
npm run test:debug              Debug mode with inspector

npx playwright test -g "pattern"      Run tests matching pattern
npx playwright test --project=chromium   Run on specific browser
npx playwright test --headed --headed    See browser actions
npx playwright show-report              View test report


⚡ COMMON PATTERNS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PATTERN 1: Using freshPage
┌──────────────────────────────────────────────────────────────────────────────┐
│ test('my test', async ({ freshPage }) => {                                  │
│   const basePage = new BasePage(freshPage.page);                            │
│   await basePage.goto('https://example.com');                              │
│   // Test code...                                                           │
│ });                                                                          │
└──────────────────────────────────────────────────────────────────────────────┘

PATTERN 2: Using authenticatedPage
┌──────────────────────────────────────────────────────────────────────────────┐
│ test('authenticated', async ({ authenticatedPage }) => {                     │
│   const { homePage } = authenticatedPage;                                   │
│   await homePage.searchProduct('shirt');                                    │
│   // Already logged in!                                                     │
│ });                                                                          │
└──────────────────────────────────────────────────────────────────────────────┘

PATTERN 3: Using testData
┌──────────────────────────────────────────────────────────────────────────────┐
│ test('with data', async ({ testData, freshPage }) => {                      │
│   const loginPage = new LoginPage(freshPage.page);                          │
│   const user = testData.users.validUser;                                   │
│   await loginPage.login(user.email, user.password);                        │
│ });                                                                          │
└──────────────────────────────────────────────────────────────────────────────┘

PATTERN 4: AAA Pattern (Arrange-Act-Assert)
┌──────────────────────────────────────────────────────────────────────────────┐
│ test('example', async ({ testData, freshPage }) => {                        │
│   // ARRANGE - Setup                                                        │
│   const loginPage = new LoginPage(freshPage.page);                          │
│   const user = testData.users.validUser;                                   │
│                                                                              │
│   // ACT - Do the thing                                                     │
│   await loginPage.login(user.email, user.password);                        │
│                                                                              │
│   // ASSERT - Verify results                                               │
│   const success = await loginPage.verifyLoginSuccess();                    │
│   expect(success).toBeTruthy();                                            │
│ });                                                                          │
└──────────────────────────────────────────────────────────────────────────────┘


🎯 NEXT STEPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. ✓ Install dependencies (npm install)
2. ✓ Configure BASE_URL and credentials
3. ✓ Run example tests (npm run test:all)
4. ✓ View report (npx playwright show-report)
5. ✓ Create your own page objects extending BasePage
6. ✓ Write tests using fixtures and page objects
7. ✓ Run tests in UI mode for development (npm run test:ui)
8. ✓ Check README.md for detailed documentation


❓ TROUBLESHOOTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Issue: "Cannot find module" error
Solution: Run npm install first

Issue: Tests timeout
Solution: Increase TIMEOUTS in src/utils/config.js

Issue: Element not found
Solution: Use --debug flag to inspect elements
  npx playwright test --debug

Issue: Tests fail locally but pass in CI
Solution: Check BASE_URL and CREDENTIALS environment variables

Issue: Port already in use
Solution: Kill the process or change port in playwright.config.js


📚 DOCUMENTATION FILES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

README.md ..................... Complete documentation
QUICKSTART.md (this file) .... Quick setup guide
.env.example ................ Configuration template
src/pages/BasePage.js ....... Base class documentation
src/pages/LoginPage.js ...... Login page examples
src/pages/HomePage.js ....... Home page examples
src/fixtures/testFixtures.js  Fixture documentation


🌐 USEFUL LINKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Playwright Docs: https://playwright.dev
API Reference: https://playwright.dev/docs/api/class-page
Locators Guide: https://playwright.dev/docs/locators
Best Practices: https://playwright.dev/docs/best-practices
Debug Guide: https://playwright.dev/docs/debug


✨ YOU'RE ALL SET!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Now run:  npm run test:all

Happy testing! 🎭
*/
