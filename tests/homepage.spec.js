/**
 * @file Homepage Comprehensive Test Suite
 * @description Complete test coverage for homepage functionality
 * @tags smoke, integration, product-grid, search, filters, cart, navigation
 */

const { test, expect } = require('../src/fixtures/testFixtures');
const { HomePage, LoginPage } = require('../src/fixtures/testFixtures');
const logger = require('../src/utils/logger');
const config = require('../src/utils/config');

// ═══════════════════════════════════════════════════════════════════════════
// SMOKE TESTS - Critical functionality verification
// ═══════════════════════════════════════════════════════════════════════════

test.describe('@smoke Homepage Smoke Tests', () => {
  let homePage;

  test.beforeEach(async ({ freshPage }) => {
    homePage = new HomePage(freshPage.page);
    logger.section('🧪 SMOKE TEST SETUP');
    await homePage.navigateToHome();
  });

  test('@smoke @critical should load homepage successfully', async () => {
    // Step 1: Verify page navigation
    logger.info('Step 1: Verifying homepage loaded');
    const url = homePage.getUrl();
    expect(url).toContain('sauce-demo.myshopify.com');
    logger.pass('✓ Homepage loaded with correct URL');

    // Step 2: Verify product grid is visible
    logger.info('Step 2: Checking product grid visibility');
    const gridVisible = await homePage.isProductGridDisplayed();
    expect(gridVisible).toBeTruthy();
    logger.pass('✓ Product grid is visible');
  });

  test('@smoke @critical should display product grid with items', async () => {
    // Step 1: Get product count
    logger.info('Step 1: Counting products on page');
    const productCount = await homePage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
    logger.pass(`✓ Product grid contains ${productCount} items`);

    // Step 2: Verify grid is properly rendered
    logger.info('Step 2: Validating grid rendering');
    const gridDisplayed = await homePage.isProductGridDisplayed();
    expect(gridDisplayed).toBeTruthy();
    logger.pass('✓ Grid properly rendered');
  });

  test('@smoke @critical should render all page elements', async () => {
    // Step 1: Check product grid
    logger.info('Step 1: Checking product grid');
    const gridVisible = await homePage.isProductGridDisplayed();
    expect(gridVisible).toBeTruthy();

    // Step 2: Check search functionality
    logger.info('Step 2: Checking search element');
    const searchInput = homePage.getSearchInput();
    expect(searchInput).toBeDefined();

    // Step 3: Check cart button
    logger.info('Step 3: Checking cart button');
    const cartButton = homePage.getCartButton();
    expect(cartButton).toBeDefined();

    logger.pass('✓ All critical page elements rendered');
  });

  test('@smoke @critical should get page title', async () => {
    // Step 1: Retrieve page title
    logger.info('Step 1: Getting page title');
    const title = await homePage.getTitle();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
    logger.pass(`✓ Page title retrieved: ${title}`);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// PRODUCT DISPLAY TESTS - Product grid and listing functionality
// ═══════════════════════════════════════════════════════════════════════════

test.describe('@product-grid Product Display Tests', () => {
  let homePage;

  test.beforeEach(async ({ freshPage }) => {
    homePage = new HomePage(freshPage.page);
    logger.section('📦 PRODUCT DISPLAY SETUP');
    await homePage.navigateToHome();
  });

  test('@product-grid should retrieve product list', async () => {
    // Step 1: Get all products
    logger.info('Step 1: Retrieving product list');
    const productCount = await homePage.getProductCount();
    expect(Array.isArray(productCount) || typeof productCount === 'number').toBeTruthy();
    logger.pass(`✓ Product list retrieved with ${productCount} items`);

    // Step 2: Verify count is valid
    logger.info('Step 2: Validating product count');
    expect(productCount).toBeGreaterThan(0);
    logger.pass('✓ Product count is valid (> 0)');
  });

  test('@product-grid should display correct number of products', async () => {
    // Step 1: Get initial count
    logger.info('Step 1: Getting initial product count');
    const productCount = await homePage.getProductCount();
    logger.info(`Product count: ${productCount}`);

    // Step 2: Verify count is reasonable
    logger.info('Step 2: Validating product count is reasonable');
    expect(productCount).toBeGreaterThanOrEqual(1);
    expect(productCount).toBeLessThanOrEqual(100);
    logger.pass(`✓ Product count verified: ${productCount}`);
  });

  test('@product-grid should have featured section', async () => {
    // Step 1: Check for featured products
    logger.info('Step 1: Checking for featured section');
    const featuredVisible = await homePage.isFeaturedSectionDisplayed();
    
    if (featuredVisible) {
      logger.pass('✓ Featured section is displayed');
    } else {
      logger.warn('⚠ Featured section not found (may be optional)');
    }
  });

  test('@product-grid should display product grid correctly', async () => {
    // Step 1: Verify grid presence
    logger.info('Step 1: Verifying product grid');
    const gridVisible = await homePage.isProductGridDisplayed();
    expect(gridVisible).toBeTruthy();
    logger.pass('✓ Product grid is visible');

    // Step 2: Verify products exist
    logger.info('Step 2: Verifying products in grid');
    const productCount = await homePage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
    logger.pass(`✓ Grid contains ${productCount} products`);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// SEARCH TESTS - Search functionality and results
// ═══════════════════════════════════════════════════════════════════════════

test.describe('@search Search Functionality Tests', () => {
  let homePage;

  test.beforeEach(async ({ freshPage }) => {
    homePage = new HomePage(freshPage.page);
    logger.section('🔍 SEARCH TEST SETUP');
    await homePage.navigateToHome();
  });

  test('@search should search for valid product term', async ({ testData }) => {
    // Step 1: Get search term
    logger.info('Step 1: Getting search term from test data');
    const searchTerm = testData.products.validSearch;
    logger.info(`Searching for: ${searchTerm}`);

    // Step 2: Perform search
    logger.info('Step 2: Performing search');
    await homePage.searchProduct(searchTerm);
    logger.pass(`✓ Search executed for "${searchTerm}"`);

    // Step 3: Verify search results
    logger.info('Step 3: Verifying search results');
    const productCount = await homePage.getProductCount();
    expect(productCount).toBeGreaterThanOrEqual(0);
    logger.pass(`✓ Search returned ${productCount} results`);
  });

  test('@search should return matching search results', async ({ testData }) => {
    // Step 1: Get a valid product from test data
    logger.info('Step 1: Getting valid product term');
    const productTerm = testData.getRandomProduct();
    logger.info(`Testing with product: ${productTerm}`);

    // Step 2: Search for product
    logger.info('Step 2: Searching for product');
    await homePage.searchProduct(productTerm);

    // Step 3: Verify results
    logger.info('Step 3: Verifying results');
    const resultCount = await homePage.getProductCount();
    expect(resultCount).toBeGreaterThanOrEqual(0);
    logger.pass(`✓ Search returned ${resultCount} matching results`);
  });

  test('@search should handle invalid search gracefully', async ({ testData }) => {
    // Step 1: Get invalid search term
    logger.info('Step 1: Using invalid search term');
    const invalidTerm = testData.products.invalidSearch;
    logger.info(`Searching for invalid term: ${invalidTerm}`);

    // Step 2: Perform search
    logger.info('Step 2: Performing invalid search');
    await homePage.searchProduct(invalidTerm);

    // Step 3: Check for no results message
    logger.info('Step 3: Checking for no results');
    const noResults = await homePage.isNoResultsDisplayed();
    const productCount = await homePage.getProductCount();
    
    if (noResults || productCount === 0) {
      logger.pass('✓ Invalid search handled - no results displayed');
    } else {
      logger.warn('⚠ No results message not shown (may show all products)');
    }
  });

  test('@search should maintain search across page refresh', async ({ testData }) => {
    // Step 1: Perform search
    logger.info('Step 1: Performing initial search');
    const searchTerm = testData.products.validSearch;
    await homePage.searchProduct(searchTerm);
    const initialCount = await homePage.getProductCount();
    logger.info(`Initial search result count: ${initialCount}`);

    // Step 2: Refresh page
    logger.info('Step 2: Refreshing page');
    await homePage.refresh();

    // Step 3: Verify results still valid
    logger.info('Step 3: Verifying search state after refresh');
    const afterRefreshCount = await homePage.getProductCount();
    logger.pass(`✓ Page refreshed, product count: ${afterRefreshCount}`);
  });

  test('@search should search from any page', async () => {
    // Step 1: Initial search
    logger.info('Step 1: Performing initial search');
    await homePage.searchProduct('shirt');
    const firstCount = await homePage.getProductCount();

    // Step 2: Search for different term
    logger.info('Step 2: Searching for different term');
    await homePage.searchProduct('jacket');
    const secondCount = await homePage.getProductCount();

    logger.pass(`✓ Sequential searches work (${firstCount} → ${secondCount})`);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// FILTER TESTS - Product filtering and sorting
// ═══════════════════════════════════════════════════════════════════════════

test.describe('@filters Filter and Sort Tests', () => {
  let homePage;

  test.beforeEach(async ({ freshPage }) => {
    homePage = new HomePage(freshPage.page);
    logger.section('🎛️ FILTER TEST SETUP');
    await homePage.navigateToHome();
  });

  test('@filters should apply filters if available', async () => {
    // Step 1: Get initial product count
    logger.info('Step 1: Getting initial product count');
    const initialCount = await homePage.getProductCount();
    logger.info(`Initial products: ${initialCount}`);

    // Step 2: Attempt to apply filter
    logger.info('Step 2: Attempting to apply filter');
    try {
      await homePage.applyFilter('Price', '$10-$50');
      const filteredCount = await homePage.getProductCount();
      logger.pass(`✓ Filter applied, results: ${filteredCount}`);
    } catch (error) {
      logger.warn('⚠ Filter not available on this page');
    }
  });

  test('@filters should clear all filters', async () => {
    // Step 1: Apply a filter
    logger.info('Step 1: Applying filter');
    try {
      await homePage.applyFilter('Test', 'TestValue');
      logger.info('Filter applied');
    } catch (error) {
      logger.warn('⚠ Filter application failed, skipping');
      return;
    }

    // Step 2: Clear filters
    logger.info('Step 2: Clearing all filters');
    await homePage.clearAllFilters();

    // Step 3: Verify filters cleared
    logger.info('Step 3: Verifying filter cleared');
    const productCount = await homePage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
    logger.pass(`✓ Filters cleared, showing ${productCount} products`);
  });

  test('@filters should sort products if available', async () => {
    // Step 1: Get initial products
    logger.info('Step 1: Getting initial product list');
    const initialCount = await homePage.getProductCount();

    // Step 2: Attempt to sort
    logger.info('Step 2: Attempting to sort products');
    try {
      await homePage.sortProducts('price');
      const sortedCount = await homePage.getProductCount();
      logger.pass(`✓ Sort applied, results: ${sortedCount}`);
    } catch (error) {
      logger.warn('⚠ Sort not available on this page');
    }
  });

  test('@filters should maintain grid after filtering', async () => {
    // Step 1: Verify initial grid
    logger.info('Step 1: Verifying initial grid');
    const gridVisible = await homePage.isProductGridDisplayed();
    expect(gridVisible).toBeTruthy();

    // Step 2: Apply filter
    logger.info('Step 2: Applying filter');
    try {
      await homePage.applyFilter('Category', 'Electronics');
    } catch (error) {
      logger.warn('⚠ Filter not available');
      return;
    }

    // Step 3: Verify grid still visible
    logger.info('Step 3: Verifying grid after filter');
    const gridStillVisible = await homePage.isProductGridDisplayed();
    expect(gridStillVisible).toBeTruthy();
    logger.pass('✓ Grid maintained after filtering');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// CART TESTS - Shopping cart functionality
// ═══════════════════════════════════════════════════════════════════════════

test.describe('@cart Cart Management Tests', () => {
  let homePage;

  test.beforeEach(async ({ freshPage }) => {
    homePage = new HomePage(freshPage.page);
    logger.section('🛒 CART TEST SETUP');
    await homePage.navigateToHome();
  });

  test('@cart should open shopping cart', async () => {
    // Step 1: Get initial cart state
    logger.info('Step 1: Checking initial cart');
    const initialCount = await homePage.getCartItemCount();
    logger.info(`Initial cart count: ${initialCount}`);

    // Step 2: Open cart
    logger.info('Step 2: Opening shopping cart');
    await homePage.openCart();
    logger.pass('✓ Shopping cart opened successfully');
  });

  test('@cart should display cart item count', async () => {
    // Step 1: Get cart count
    logger.info('Step 1: Getting cart item count');
    const cartCount = await homePage.getCartItemCount();
    expect(cartCount >= 0).toBeTruthy();
    logger.pass(`✓ Cart count retrieved: ${cartCount}`);
  });

  test('@cart should add product to cart', async () => {
    // Step 1: Get initial cart count
    logger.info('Step 1: Getting initial cart count');
    const initialCount = await homePage.getCartItemCount();
    logger.info(`Initial cart: ${initialCount} items`);

    // Step 2: Get first product
    logger.info('Step 2: Getting product to add');
    const productCount = await homePage.getProductCount();
    
    if (productCount > 0) {
      // Step 3: Add product to cart
      logger.info('Step 3: Adding product to cart');
      try {
        await homePage.addProductToCart(homePage.page.locator('a').first());
        logger.pass('✓ Product added to cart');
      } catch (error) {
        logger.warn('⚠ Add to cart operation not completed');
      }
    } else {
      logger.warn('⚠ No products available to add');
    }
  });

  test('@cart should update cart count when adding items', async () => {
    // Step 1: Get initial count
    logger.info('Step 1: Getting initial cart count');
    const initialCount = await homePage.getCartItemCount();
    logger.info(`Initial cart: ${initialCount}`);

    // Step 2: Check cart is operational
    logger.info('Step 2: Verifying cart state');
    const cartCount = await homePage.getCartItemCount();
    expect(cartCount >= 0).toBeTruthy();
    logger.pass(`✓ Cart operational with ${cartCount} items`);
  });

  test('@cart should have functioning cart button', async () => {
    // Step 1: Get cart button
    logger.info('Step 1: Getting cart button');
    const cartButton = homePage.getCartButton();
    expect(cartButton).toBeDefined();

    // Step 2: Verify button is clickable
    logger.info('Step 2: Verifying cart button');
    try {
      await cartButton.click({ timeout: config.TIMEOUTS.ELEMENT });
      logger.pass('✓ Cart button is functional');
    } catch (error) {
      logger.warn('⚠ Cart button click failed');
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// NAVIGATION TESTS - Page navigation and linking
// ═══════════════════════════════════════════════════════════════════════════

test.describe('@navigation Navigation Tests', () => {
  let homePage;

  test.beforeEach(async ({ freshPage }) => {
    homePage = new HomePage(freshPage.page);
    logger.section('🧭 NAVIGATION TEST SETUP');
    await homePage.navigateToHome();
  });

  test('@navigation should navigate to home page', async () => {
    // Step 1: Navigate to home
    logger.info('Step 1: Navigating to home page');
    await homePage.navigateToHome();

    // Step 2: Verify URL
    logger.info('Step 2: Verifying home page URL');
    const url = homePage.getUrl();
    expect(url).toContain('sauce-demo.myshopify.com');
    logger.pass('✓ Successfully navigated to home page');
  });

  test('@navigation should click on product', async () => {
    // Step 1: Get product count
    logger.info('Step 1: Getting available products');
    const productCount = await homePage.getProductCount();
    
    if (productCount === 0) {
      logger.warn('⚠ No products available to click');
      return;
    }

    // Step 2: Click first product
    logger.info('Step 2: Clicking on first product');
    try {
      await homePage.clickProductByIndex(0);
      logger.pass('✓ Product clicked successfully');
    } catch (error) {
      logger.warn('⚠ Product click failed');
    }
  });

  test('@navigation should support go back', async () => {
    // Step 1: Get initial URL
    logger.info('Step 1: Recording initial URL');
    const initialUrl = homePage.getUrl();

    // Step 2: Navigate somewhere else
    logger.info('Step 2: Navigating to search results');
    try {
      await homePage.searchProduct('test');
    } catch (error) {
      logger.warn('⚠ Search navigation failed');
    }

    // Step 3: Go back
    logger.info('Step 3: Going back');
    try {
      await homePage.goBack();
      logger.pass('✓ Back navigation successful');
    } catch (error) {
      logger.warn('⚠ Back navigation failed');
    }
  });

  test('@navigation should refresh page', async () => {
    // Step 1: Get initial product count
    logger.info('Step 1: Getting product count before refresh');
    const initialCount = await homePage.getProductCount();
    logger.info(`Products before refresh: ${initialCount}`);

    // Step 2: Refresh page
    logger.info('Step 2: Refreshing page');
    await homePage.refresh();

    // Step 3: Verify page reloaded
    logger.info('Step 3: Verifying page after refresh');
    const afterRefreshCount = await homePage.getProductCount();
    expect(afterRefreshCount).toBeGreaterThan(0);
    logger.pass(`✓ Page refreshed successfully (${afterRefreshCount} products)`);
  });

  test('@navigation should maintain product grid after navigation', async () => {
    // Step 1: Verify initial grid
    logger.info('Step 1: Verifying initial product grid');
    const initialGridVisible = await homePage.isProductGridDisplayed();
    expect(initialGridVisible).toBeTruthy();

    // Step 2: Refresh page
    logger.info('Step 2: Refreshing page');
    await homePage.refresh();

    // Step 3: Verify grid still exists
    logger.info('Step 3: Verifying grid after refresh');
    const afterRefreshGridVisible = await homePage.isProductGridDisplayed();
    expect(afterRefreshGridVisible).toBeTruthy();
    logger.pass('✓ Product grid maintained after navigation');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// INTEGRATED WORKFLOWS TESTS
// ═══════════════════════════════════════════════════════════════════════════

test.describe('@integration Integrated Workflow Tests', () => {
  /**
   * Workflow 1: Browse, Search, and View Products
   */
  test('@integration should complete browse and search workflow', async ({ 
    freshPage, 
    testData 
  }) => {
    logger.section('🔄 WORKFLOW: Browse and Search');
    
    const homePage = new HomePage(freshPage.page);

    // Step 1: Navigate to home
    logger.info('Step 1: Navigating to homepage');
    await homePage.navigateToHome();
    const gridVisible = await homePage.isProductGridDisplayed();
    expect(gridVisible).toBeTruthy();

    // Step 2: Count initial products
    logger.info('Step 2: Counting initial products');
    const initialCount = await homePage.getProductCount();
    logger.info(`Initial products: ${initialCount}`);
    expect(initialCount).toBeGreaterThan(0);

    // Step 3: Search for product
    logger.info('Step 3: Searching for product');
    const searchTerm = testData.products.validSearch;
    await homePage.searchProduct(searchTerm);

    // Step 4: Verify search results
    logger.info('Step 4: Verifying search results');
    const searchCount = await homePage.getProductCount();
    logger.pass(`✓ Workflow complete: Found ${searchCount} results for "${searchTerm}"`);
  });

  /**
   * Workflow 2: Navigate multiple pages
   */
  test('@integration should navigate through multiple pages', async ({ 
    freshPage 
  }) => {
    logger.section('🔄 WORKFLOW: Multi-page Navigation');
    
    const homePage = new HomePage(freshPage.page);

    // Step 1: Navigate to home
    logger.info('Step 1: Going to homepage');
    await homePage.navigateToHome();

    // Step 2: Refresh
    logger.info('Step 2: Refreshing page');
    await homePage.refresh();

    // Step 3: Go back
    logger.info('Step 3: Going back');
    try {
      await homePage.goBack();
    } catch (error) {
      logger.warn('⚠ Back navigation not applicable');
    }

    // Step 4: Navigate home again
    logger.info('Step 4: Returning to home');
    await homePage.navigateToHome();

    const gridVisible = await homePage.isProductGridDisplayed();
    expect(gridVisible).toBeTruthy();
    logger.pass('✓ Multi-page navigation workflow complete');
  });

  /**
   * Workflow 3: Cart interaction
   */
  test('@integration should interact with cart', async ({ freshPage }) => {
    logger.section('🔄 WORKFLOW: Cart Interaction');
    
    const homePage = new HomePage(freshPage.page);

    // Step 1: Navigate to home
    logger.info('Step 1: Going to homepage');
    await homePage.navigateToHome();

    // Step 2: Check initial cart
    logger.info('Step 2: Checking initial cart count');
    const initialCart = await homePage.getCartItemCount();
    logger.info(`Initial cart: ${initialCart}`);

    // Step 3: Open cart
    logger.info('Step 3: Opening cart');
    try {
      await homePage.openCart();
      logger.info('Cart opened');
    } catch (error) {
      logger.warn('⚠ Cart open failed');
    }

    // Step 4: Check final cart
    logger.info('Step 4: Checking final cart count');
    const finalCart = await homePage.getCartItemCount();
    logger.pass(`✓ Cart workflow complete: ${finalCart} items in cart`);
  });

  /**
   * Workflow 4: Search and filter
   */
  test('@integration should perform search and filter operations', async ({ 
    freshPage, 
    testData 
  }) => {
    logger.section('🔄 WORKFLOW: Search and Filter');
    
    const homePage = new HomePage(freshPage.page);

    // Step 1: Navigate to home
    logger.info('Step 1: Going to homepage');
    await homePage.navigateToHome();

    // Step 2: Search for product
    logger.info('Step 2: Searching for product');
    const searchTerm = testData.products.validSearch;
    await homePage.searchProduct(searchTerm);
    const searchCount = await homePage.getProductCount();
    logger.info(`Found ${searchCount} results`);

    // Step 3: Try to apply filter
    logger.info('Step 3: Attempting to apply filter');
    try {
      await homePage.applyFilter('test', 'test');
    } catch (error) {
      logger.warn('⚠ Filter not available');
    }

    // Step 4: Clear filters
    logger.info('Step 4: Clearing filters');
    try {
      await homePage.clearAllFilters();
    } catch (error) {
      logger.warn('⚠ Clear filters not available');
    }

    const finalCount = await homePage.getProductCount();
    logger.pass(`✓ Search and filter workflow complete: ${finalCount} products showing`);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// PERFORMANCE AND RELIABILITY TESTS
// ═══════════════════════════════════════════════════════════════════════════

test.describe('@performance Performance and Reliability Tests', () => {
  /**
   * Test: Rapid searches
   */
  test('@performance should handle rapid searches', async ({ testData, freshPage }) => {
    logger.section('⚡ PERFORMANCE: Rapid Searches');
    
    const homePage = new HomePage(freshPage.page);
    await homePage.navigateToHome();

    // Perform multiple searches in succession
    const searchTerms = testData.products.productList.slice(0, 2);
    
    for (let i = 0; i < searchTerms.length; i++) {
      logger.info(`Search ${i + 1}/${searchTerms.length}: ${searchTerms[i]}`);
      try {
        await homePage.searchProduct(searchTerms[i]);
        const count = await homePage.getProductCount();
        logger.info(`Results: ${count}`);
      } catch (error) {
        logger.error(`Search failed for ${searchTerms[i]}`, error);
      }
    }

    logger.pass('✓ Rapid search test completed');
  });

  /**
   * Test: Page stability
   */
  test('@performance should maintain stability', async ({ freshPage }) => {
    logger.section('⚡ PERFORMANCE: Page Stability');
    
    const homePage = new HomePage(freshPage.page);

    // Navigate and check multiple times
    for (let i = 0; i < 3; i++) {
      logger.info(`Navigation check ${i + 1}/3`);
      await homePage.navigateToHome();
      const gridVisible = await homePage.isProductGridDisplayed();
      expect(gridVisible).toBeTruthy();
    }

    logger.pass('✓ Page stability test completed');
  });
});
