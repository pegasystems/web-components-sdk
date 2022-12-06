/* eslint-disable no-undef */
const { test, expect } = require("@playwright/test");
const config = require("../../config");
const common = require("../../common");

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1720, height: 1080 });
  await page.goto("http://localhost:3501/portal");
});

test.describe("E2E test", () => {
  test("should login, create case and run different test cases for Query", async ({
    page,
  }) => {
    await common.Login(
      config.config.apps.digv2.user.username,
      config.config.apps.digv2.user.password,
      page
    );

    /** Testing announcement banner presence */
    const announcementBanner = page.locator(
      'h2[id="announcement-header"]:has-text("Announcements")'
    );
    await expect(announcementBanner).toBeVisible();

    /** Testing worklist presence */
    const worklist = page.locator(
      'div[id="header-text"]:has-text("My Worklist")'
    );
    await expect(worklist).toBeVisible();

    const createServiceNav = page.locator("#create-nav");
    await createServiceNav.click();

    /** Creating a Complex Fields case-type */
    const complexFieldsCase = page.locator('button:has-text("Complex Fields")');
    await complexFieldsCase.click();

    /** Selecting Query from the Category dropdown */
    await page.selectOption(
      'lion-select[datatestid="76729937a5eb6b0fd88c42581161facd"] select',
      "Query"
    );

    await page.locator('button:has-text("submit")').click();

    /** selecting SingleRecord option from dropdown  */
    await page.selectOption(
      'lion-select[datatestid="365ab066d5dd67171317bc3fc755245a"] select',
      "SingleRecord"
    );

    const detailsFieldsList = await page.locator(
      'dl[id="details-fields-list"]'
    );

    /** Testing presence of Single Record Query data */
    await expect(
      detailsFieldsList.locator('dd >> span:has-text("Sacramento")')
    ).toBeVisible();
    await expect(
      detailsFieldsList.locator('dd >> span:has-text("CA")')
    ).toBeVisible();
    await expect(
      detailsFieldsList.locator('dd >> span:has-text("2653")')
    ).toBeVisible();

    /** selecting ListOfReords option from dropdown  */
    await page.selectOption(
      'lion-select[datatestid="365ab066d5dd67171317bc3fc755245a"] select',
      "ListOfRecords"
    );

    /** selecting Table option from dropdown  */
    await page.selectOption(
      'lion-select[datatestid="03e83bd975984c06d12c584cb59cc4ad"] select',
      "Table"
    );

    const table = page.locator("simple-table-manual >> table");

    /** Testing values in the table */
    await expect(
      table.locator('tbody >> tr:has-text("Luxury Product")')
    ).toBeVisible();
    await expect(
      table.locator('tbody >> tr:has-text("Basic Product")')
    ).toBeVisible();
    await expect(
      table.locator('tbody >> tr:has-text("Green Item")')
    ).toBeVisible();
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
