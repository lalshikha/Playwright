// @ts-check
import { test, expect } from '@playwright/test';

test('browser test for Saucelabs', async ({ page }) => {
  // Open the Saucedemo site
  await page.goto('https://www.saucedemo.com/');

  // Focus the username field and enter credentials
  await page.locator('//input[@id="user-name"]').click();
  await page.locator('//input[@id="user-name"]').fill('standard_user');
  await page.locator('//input[@id="password"]').fill('secret_sauce');

  // Click the login button
  await page.locator('//input[@id="login-button"]').click();

  // Verify that we landed on the inventory page
  await expect(page).toHaveURL(/.*inventory.html/);
  await expect(page.getByText('Products')).toBeVisible();

  // Assert that "Sauce Labs Backpack" is present using XPath
  await expect(page.locator('//div[text()="Sauce Labs Backpack"]')).toBeVisible();
  // Assert that products are present using XPath with index
  await expect(page.locator('(//div[@class="inventory_item_name"])[1]')).toHaveText('Sauce Labs Backpack');
  await expect(page.locator('(//div[@class="inventory_item_name"])[2]')).toHaveText('Sauce Labs Bike Light');
  await expect(page.locator('(//div[@class="inventory_item_name"])[3]')).toHaveText('Sauce Labs Bolt T-Shirt');

  // Additional `contains` assertions using indexed XPath locators
  await expect(page.locator('(//div[@class="inventory_item_name"])[1]')).toContainText('Sauce Labs Backpack');
  await expect(page.locator('(//div[@class="inventory_item_name"])[2]')).toContainText('Sauce Labs Bike Light');
  await expect(page.locator('(//div[@class="inventory_item_name"])[3]')).toContainText('Sauce Labs Bolt T-Shirt');

  // Regex assertions for "Sauce Labs Backpack" (different regex styles)
  await expect(page.locator('(//div[@class="inventory_item_name"])[1]')).toHaveText(/Sauce Labs Backpack/);
  await expect(page.locator('(//div[@class="inventory_item_name"])[1]')).toHaveText(/Sauce\s+Labs\s+Backpack/);
  await expect(page.locator('(//div[@class="inventory_item_name"])[1]')).toHaveText(/sauce labs backpack/i);
  await expect(page.locator('(//div[@class="inventory_item_name"])[1]')).toHaveText(/^Sauce Labs Backpack$/);
  await expect(page.locator('(//div[@class="inventory_item_name"])[1]')).toHaveText(new RegExp('Sauce Labs Backpack'));
});
