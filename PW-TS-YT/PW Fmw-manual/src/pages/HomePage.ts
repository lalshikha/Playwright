import { Page, expect } from "@playwright/test";

export default class HomePage {
  private readonly serviceTitleLocator = "//*[@class='app_logo' and normalize-space(.)='Swag Labs']";

  constructor(private page: Page) {}

  async expectServiceTitleToBeVisible() {
    await expect(this.page.locator(this.serviceTitleLocator)).toBeVisible();
  }
}