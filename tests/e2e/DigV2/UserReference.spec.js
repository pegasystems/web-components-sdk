const { test, expect } = require('@playwright/test');
const config = require('../../config');
const common = require('../../common');
const endpoints = require('../../../sdk-config.json');

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1720, height: 1080 });
  await page.goto('http://localhost:3501/portal');
});

test.describe('E2E test', () => {
  test('should login, create case and run different test cases for User Reference', async ({ page }) => {
    await common.Login(config.config.apps.digv2.user.username, config.config.apps.digv2.user.password, page);

    /** Testing announcement banner presence */
    const announcementBanner = page.locator('#announcement-header');
    await expect(announcementBanner).toBeVisible();

    /** Testing worklist presence */
    const worklist = page.locator('#header-text');
    await expect(worklist).toBeVisible();

    const createServiceNav = page.locator('#create-nav');
    await createServiceNav.click();

    /** Creating a Complex Fields case-type */
    const complexFieldsCase = page.locator('button:has-text("Complex Fields")');
    await complexFieldsCase.click();

    /** Selecting UserReference from the Category dropdown */
    await page.selectOption('lion-select[datatestid="76729937a5eb6b0fd88c42581161facd"] select', 'UserReference');

    await page.locator('button:has-text("submit")').click();

    await expect(page.locator('div[id="APP/PRIMARY_1/WORKAREA"]')).toBeVisible();

    // To ensure users are available before we look for them in the autocomplete/dropdown controls
    await Promise.all([page.waitForResponse(`${endpoints.serverConfig.infinityRestServerUrl}/api/application/v2/data_views/D_pyC11nOperatorsList`)]);

    /** selecting user from autocomplete field  */
    await page.locator('lion-combobox[datatestid="75c6db46c48c2d7bb102c91d13ed766e"] input').click();
    const lionOptions = page.locator('lion-options');
    const user = lionOptions.locator('lion-option:first-child');
    await user.click();
    let userName = await user.textContent();
    userName = userName.trim();
    await page.locator('body').click(); //clicking outside to dismiss combobox

    /** selecting user from dropdown field  */
    await page.selectOption(`lion-select[datatestid="12781aa4899d4a2141570b5e52b27156"] select`, userName);

    /** Check readonly user reference value is same as dropdown selected user */
    await expect(page.locator(`operator-extension >> span >> text="${userName}"`)).toBeVisible();

    /** Submitting the case */
    await page.locator('button:has-text("submit")').click();
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
