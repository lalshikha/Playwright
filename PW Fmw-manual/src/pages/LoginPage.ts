import { Page, expect } from "@playwright/test";
import HomePage from "../pages/HomePage";
import logger from "../utils/LoggerUtil";

export default class LoginPage {
  private readonly usernameInputSelector = "//input[@id='user-name']";
  private readonly passwordInputSelector = "//input[@id='password']";
  private readonly loginButtonSelector = "//input[@id='login-button']";

  constructor(private page: Page) {}

  async navigateToLoginPage() {
    logger.info("Navigating to the login page...");
    await this.page.goto("https://www.saucedemo.com/");
    await expect(this.page.locator(this.loginButtonSelector)).toBeVisible({timeout: 15000});

  }

  async fillUsername(username: string) {
    await this.page.locator(this.usernameInputSelector).fill(username);
  }

  async fillPassword(password: string) {
    await this.page.locator(this.passwordInputSelector).fill(password);
  }

  async clickLoginButton() {
    await this.page
      .locator(this.loginButtonSelector)
      .click()
      .catch((error) => {
        console.error(`Error clicking login button: ${error}`);
        throw error;
      });

    const homePage = new HomePage(this.page);
    return homePage;
  }
}

