/**
 * @file HomePage class - Page Object Model for home page functionality
 * @description Handles all home page interactions including products, search, and cart
 */

const BasePage = require('./BasePage');
const config = require('../utils/config');

/**
 * Home Page Object
 */
class HomePage extends BasePage {
  /**
   * Create a HomePage instance
   * @param {import('@playwright/test').Page} page - Playwright page object
   */
  constructor(page) {
    super(page);
    this.logger.info('HomePage initialized');
  }

  /**
   * Navigate to home page
   * @returns {Promise<void>}
   * @throws {Error} If navigation fails
   */
  async navigateToHome() {
    try {
      await this.goto(config.BASE_URL);
      this.logger.pass('Navigated to home page');
    } catch (error) {
      this.logger.error('Failed to navigate to home page', error);
      throw error;
    }
  }

  /**
   * Get product grid container locator
   * @returns {import('@playwright/test').Locator} - Product grid locator
   */
  getProductGrid() {
    return this.page.locator('[class*="product"], [class*="grid"], [role="main"]').first();
  }

  /**
   * Get all product items
   * @returns {import('@playwright/test').Locator} - Product items locator
   */
  getAllProducts() {
    return this.page.locator('[class*="product-item"], [class*="product"], li[role="option"], article');
  }

  /**
   * Get search input field
   * @returns {import('@playwright/test').Locator} - Search input locator
   */
  getSearchInput() {
    return this.page.getByPlaceholder(/search/i);
  }

  /**
   * Get search button
   * @returns {import('@playwright/test').Locator} - Search button locator
   */
  getSearchButton() {
    return this.page.getByRole('button', { name: /search|go|find/i });
  }

  /**
   * Get cart button/icon
   * @returns {import('@playwright/test').Locator} - Cart button locator
   */
  getCartButton() {
    return this.page.getByRole('button', { name: /cart|shopping bag|basket/i });
  }

  /**
   * Get filter button
   * @returns {import('@playwright/test').Locator} - Filter button locator
   */
  getFilterButton() {
    return this.page.getByRole('button', { name: /filter|sort|refine/i });
  }

  /**
   * Search for a product
   * @param {string} productName - Product name to search
   * @returns {Promise<void>}
   * @throws {Error} If search fails
   */
  async searchProduct(productName) {
    try {
      this.logger.info(`Searching for product: ${productName}`);
      const searchInput = this.getSearchInput();
      await searchInput.fill(productName, { timeout: config.TIMEOUTS.ELEMENT });
      
      const searchButton = this.getSearchButton();
      const buttonExists = await searchButton.isVisible({ timeout: config.TIMEOUTS.SHORT }).catch(() => false);
      
      if (buttonExists) {
        await searchButton.click({ timeout: config.TIMEOUTS.ELEMENT });
      } else {
        // Press Enter if button doesn't exist
        await searchInput.press('Enter');
      }
      
      await this.delay(config.DELAYS.MEDIUM_DELAY);
      this.logger.pass(`Searched for product: ${productName}`);
    } catch (error) {
      this.logger.error(`Failed to search for product: ${productName}`, error);
      throw error;
    }
  }

  /**
   * Get count of products displayed
   * @returns {Promise<number>} - Number of products
   */
  async getProductCount() {
    try {
      const products = this.getAllProducts();
      const count = await products.count();
      this.logger.debug(`Product count: ${count}`);
      return count;
    } catch (error) {
      this.logger.error('Failed to get product count', error);
      return 0;
    }
  }

  /**
   * Click on a product by name
   * @param {string} productName - Product name
   * @returns {Promise<void>}
   * @throws {Error} If product not found or click fails
   */
  async clickProduct(productName) {
    try {
      this.logger.info(`Clicking product: ${productName}`);
      const productLocator = this.page.getByText(new RegExp(productName, 'i')).first();
      await productLocator.click({ timeout: config.TIMEOUTS.ELEMENT });
      await this.delay(config.DELAYS.MEDIUM_DELAY);
      this.logger.pass(`Clicked product: ${productName}`);
    } catch (error) {
      this.logger.error(`Failed to click product: ${productName}`, error);
      throw error;
    }
  }

  /**
   * Click on product by index
   * @param {number} index - Product index (0-based)
   * @returns {Promise<void>}
   * @throws {Error} If product not found or click fails
   */
  async clickProductByIndex(index) {
    try {
      this.logger.info(`Clicking product at index: ${index}`);
      const products = this.getAllProducts();
      await products.nth(index).click({ timeout: config.TIMEOUTS.ELEMENT });
      await this.delay(config.DELAYS.MEDIUM_DELAY);
      this.logger.pass(`Clicked product at index: ${index}`);
    } catch (error) {
      this.logger.error(`Failed to click product at index: ${index}`, error);
      throw error;
    }
  }

  /**
   * Add product to cart by name
   * @param {string} productName - Product name
   * @returns {Promise<void>}
   * @throws {Error} If action fails
   */
  async addProductToCart(productName) {
    try {
      this.logger.info(`Adding product to cart: ${productName}`);
      
      // First, click the product to open it
      await this.clickProduct(productName);
      
      // Look for add to cart button
      const addToCartButton = this.page.getByRole('button', { name: /add to cart|add to bag|add/i });
      const buttonExists = await addToCartButton.isVisible({ timeout: config.TIMEOUTS.ELEMENT }).catch(() => false);
      
      if (buttonExists) {
        await addToCartButton.click({ timeout: config.TIMEOUTS.ELEMENT });
        await this.delay(config.DELAYS.MEDIUM_DELAY);
        this.logger.pass(`Added product to cart: ${productName}`);
      } else {
        this.logger.warn(`Add to cart button not found for: ${productName}`);
      }
    } catch (error) {
      this.logger.error(`Failed to add product to cart: ${productName}`, error);
      throw error;
    }
  }

  /**
   * Open shopping cart
   * @returns {Promise<void>}
   * @throws {Error} If cart button not found or click fails
   */
  async openCart() {
    try {
      this.logger.info('Opening shopping cart');
      const cartButton = this.getCartButton();
      await cartButton.click({ timeout: config.TIMEOUTS.ELEMENT });
      await this.delay(config.DELAYS.MEDIUM_DELAY);
      this.logger.pass('Shopping cart opened');
    } catch (error) {
      this.logger.error('Failed to open shopping cart', error);
      throw error;
    }
  }

  /**
   * Get cart item count
   * @returns {Promise<number>} - Number of items in cart
   */
  async getCartItemCount() {
    try {
      const cartBadge = this.page.locator('[class*="cart-count"], [class*="badge"], span:has-text(/\\d+/)').first();
      const isVisible = await cartBadge.isVisible({ timeout: config.TIMEOUTS.SHORT }).catch(() => false);
      
      if (isVisible) {
        const count = await cartBadge.textContent();
        const numCount = parseInt(count?.replace(/\D/g, '') || '0');
        this.logger.debug(`Cart item count: ${numCount}`);
        return numCount;
      }
      
      return 0;
    } catch (error) {
      this.logger.debug('Failed to get cart item count');
      return 0;
    }
  }

  /**
   * Sort products
   * @param {string} sortOption - Sort option (price, name, newest, etc.)
   * @returns {Promise<void>}
   * @throws {Error} If sort fails
   */
  async sortProducts(sortOption) {
    try {
      this.logger.info(`Sorting products by: ${sortOption}`);
      
      const sortButton = this.getFilterButton();
      const sortExists = await sortButton.isVisible({ timeout: config.TIMEOUTS.ELEMENT }).catch(() => false);
      
      if (sortExists) {
        await sortButton.click({ timeout: config.TIMEOUTS.ELEMENT });
        await this.delay(config.DELAYS.SHORT_DELAY);
        
        const sortOptionLocator = this.page.getByRole('option', { name: new RegExp(sortOption, 'i') });
        const optionExists = await sortOptionLocator.isVisible({ timeout: config.TIMEOUTS.SHORT }).catch(() => false);
        
        if (optionExists) {
          await sortOptionLocator.click({ timeout: config.TIMEOUTS.ELEMENT });
          await this.delay(config.DELAYS.MEDIUM_DELAY);
          this.logger.pass(`Sorted products by: ${sortOption}`);
        } else {
          this.logger.warn(`Sort option not found: ${sortOption}`);
        }
      } else {
        this.logger.warn('Sort button not found');
      }
    } catch (error) {
      this.logger.error(`Failed to sort products by: ${sortOption}`, error);
      throw error;
    }
  }

  /**
   * Apply filter
   * @param {string} filterName - Filter name
   * @param {string} filterValue - Filter value
   * @returns {Promise<void>}
   * @throws {Error} If filter fails
   */
  async applyFilter(filterName, filterValue) {
    try {
      this.logger.info(`Applying filter: ${filterName} = ${filterValue}`);
      
      const filterLocator = this.page.getByLabel(new RegExp(filterValue, 'i'));
      const filterExists = await filterLocator.isVisible({ timeout: config.TIMEOUTS.ELEMENT }).catch(() => false);
      
      if (filterExists) {
        await filterLocator.click({ timeout: config.TIMEOUTS.ELEMENT });
        await this.delay(config.DELAYS.MEDIUM_DELAY);
        this.logger.pass(`Applied filter: ${filterName} = ${filterValue}`);
      } else {
        this.logger.warn(`Filter not found: ${filterValue}`);
      }
    } catch (error) {
      this.logger.error(`Failed to apply filter: ${filterName}`, error);
      throw error;
    }
  }

  /**
   * Clear all filters
   * @returns {Promise<void>}
   * @throws {Error} If clear fails
   */
  async clearAllFilters() {
    try {
      this.logger.info('Clearing all filters');
      const clearButton = this.page.getByRole('button', { name: /clear|reset|show all/i });
      const buttonExists = await clearButton.isVisible({ timeout: config.TIMEOUTS.ELEMENT }).catch(() => false);
      
      if (buttonExists) {
        await clearButton.click({ timeout: config.TIMEOUTS.ELEMENT });
        await this.delay(config.DELAYS.MEDIUM_DELAY);
        this.logger.pass('All filters cleared');
      } else {
        this.logger.warn('Clear filters button not found');
      }
    } catch (error) {
      this.logger.error('Failed to clear filters', error);
      throw error;
    }
  }

  /**
   * Verify product grid is displayed
   * @returns {Promise<boolean>} - True if product grid is visible
   */
  async isProductGridDisplayed() {
    try {
      const grid = this.getProductGrid();
      const isVisible = await grid.isVisible({ timeout: config.TIMEOUTS.SHORT }).catch(() => false);
      
      if (isVisible) {
        this.logger.pass('Product grid is displayed');
      } else {
        this.logger.warn('Product grid is NOT displayed');
      }
      
      return isVisible;
    } catch (error) {
      this.logger.error('Failed to verify product grid', error);
      return false;
    }
  }

  /**
   * Check if product search returned no results
   * @returns {Promise<boolean>} - True if no results found
   */
  async isNoResultsDisplayed() {
    try {
      const noResultsLocator = this.page.getByText(/no results|no products|nothing found/i);
      const isVisible = await noResultsLocator.isVisible({ timeout: config.TIMEOUTS.SHORT }).catch(() => false);
      
      if (isVisible) {
        this.logger.pass('No results message is displayed');
      }
      
      return isVisible;
    } catch (error) {
      this.logger.debug('No results message not found');
      return false;
    }
  }

  /**
   * Get featured products section
   * @returns {import('@playwright/test').Locator} - Featured products locator
   */
  getFeaturedSection() {
    return this.page.locator('[class*="featured"], [class*="banner"], [class*="hero"]').first();
  }

  /**
   * Check if featured section is displayed
   * @returns {Promise<boolean>} - True if featured section is visible
   */
  async isFeaturedSectionDisplayed() {
    try {
      const section = this.getFeaturedSection();
      const isVisible = await section.isVisible({ timeout: config.TIMEOUTS.SHORT }).catch(() => false);
      
      if (isVisible) {
        this.logger.pass('Featured section is displayed');
      }
      
      return isVisible;
    } catch (error) {
      this.logger.debug('Featured section not found');
      return false;
    }
  }
}

module.exports = HomePage;
