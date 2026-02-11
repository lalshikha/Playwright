import { expect, test } from "@playwright/test";
import LoginPage from "../pages/LoginPage";
import logger from "../utils/LoggerUtil";
import cdata from "../testdata/loginCreds.json";

for (const { username, password } of cdata) {
  test(`login with user: ${username}, password: ${password}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    await loginPage.fillUsername(username);
    await loginPage.fillPassword(password);
    const homePage = await loginPage.clickLoginButton();
    await homePage.expectServiceTitleToBeVisible();
  });
};

test.skip("env test", async ({ page }) => {
  console.log(process.env.NODE_ENV);
  console.log(process.env.userId);
  console.log(process.env.password);
  console.log("--------------------");
});