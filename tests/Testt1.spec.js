// @ts-check
import { test, expect } from '@playwright/test';

test('browser test for Saucelabs', async ({ page }) => {
  // Open the Saucedemo site
  await page.goto('https://www.saucedemo.com/');

  // Focus the username field and enter credentials
  await page.locator('#user-name').click();
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');

  // Click the login button
  await page.locator('#login-button').click();

  // Verify that we landed on the inventory page
  await expect(page).toHaveURL(/.*inventory.html/);
  await expect(page.getByText('Products')).toBeVisible();
});
