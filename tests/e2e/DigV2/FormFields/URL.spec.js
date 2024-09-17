const { test, expect } = require('@playwright/test');
const config = require('../../../config');
const common = require('../../../common');

// These values represent the data values used for the conditions and are initialised in pyDefault DT
const isDisabled = true;
const isVisible = true;

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1720, height: 1080 });
  await page.goto(config.config.portalUrl, { waitUntil: 'networkidle' });
});

test.describe('E2E test', () => {
  let attributes;
  test('should login, create case and run the URL tests', async ({ page }) => {
    await common.Login(config.config.apps.digv2.user.username, config.config.apps.digv2.user.password, page);

    /** Testing announcement banner presence */
    const announcementBanner = page.locator('#announcement-header');
    await expect(announcementBanner).toBeVisible();

    /** Testing worklist presence */
    const worklist = page.locator('#header-text');
    await expect(worklist).toBeVisible();

    const createServiceNav = page.locator('#create-nav');
    await createServiceNav.click();

    /** Creating a Form Fields case-type */
    const formFieldsCase = page.locator('button:has-text("Form Field")');
    await formFieldsCase.click();

    /** Selecting URL from the Selected Category dropdown */
    await page.selectOption('lion-select[datatestid="76729937a5eb6b0fd88c42581161facd"] select', 'URL');

    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Required');

    await page.locator('button:has-text("submit")').click();

    await expect(page.locator('lion-validation-feedback[type="error"]')).toBeVisible();

    /** Required tests */
    const requiredURL = page.locator('lion-input-url[datatestid="20815fd8b2e59e25b75185515b126212"] >> input');

    attributes = await common.getAttributes(requiredURL);
    await expect(attributes.includes('aria-required')).toBeTruthy();

    const notRequiredURL = page.locator('lion-input-url[datatestid="d50c2aa9fe6df301d0d3d5a667daeda2"] >> input');
    attributes = await common.getAttributes(notRequiredURL);
    await expect(attributes.includes('aria-required')).toBeFalsy();

    /** Selecting Disable from the Sub Category dropdown */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Disable');

    // /** Disable tests */
    const alwaysDisabledURL = page.locator('lion-input-url[datatestid="922758766489b064688aba17552c566d"] >> input');
    attributes = await common.getAttributes(alwaysDisabledURL);
    await expect(attributes.includes('disabled')).toBeTruthy();

    const conditionallyDisabledURL = page.locator('lion-input-url[datatestid="ae2e04faf34d58c5bff6be9b4fc9b0d9"] >> input');
    attributes = await common.getAttributes(conditionallyDisabledURL);
    if (isDisabled) {
      await expect(attributes.includes('disabled')).toBeTruthy();
    } else {
      await expect(attributes.includes('disabled')).toBeFalsy();
    }

    const neverDisabledURL = page.locator('lion-input-url[datatestid="cd5da1117b7b64256f2749d1664866bc"] >> input');
    attributes = await common.getAttributes(neverDisabledURL);
    await expect(attributes.includes('disabled')).toBeFalsy();

    /** Selecting Update from the Sub Category dropdown */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Update');

    const readonlyURL = page.locator('lion-input[datatestid="6180c34fa2ef0cbfe3459b6f94b89d62"]  >> input');
    attributes = await common.getAttributes(readonlyURL);
    await expect(attributes.includes('readonly')).toBeTruthy();

    const editableURL = page.locator('lion-input-url[datatestid="79504c0d99166c4c0a0749bef59b5e0f"]  >> input');
    // validation message to be checked -- ToDo

    attributes = await common.getAttributes(editableURL);
    await expect(attributes.includes('readonly')).toBeFalsy();

    /** Selecting Update from the Sub Category dropdown */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Visibility');

    const alwaysVisibleURL = await page.locator('lion-input-url[datatestid="c239893d906b22bc8de9c7f3d0c1e219"]  >> input');
    await expect(alwaysVisibleURL).toBeVisible();

    const neverVisibleURL = await page.locator('lion-input-url[datatestid="01cec81e2fe61acf1b0480187998d1ee"]  >> input');
    await expect(neverVisibleURL).not.toBeVisible();

    const conditionallyVisibleURL = await page.locator('lion-input-url[datatestid="c7a204d92fc6300c68859901de172f8b"]  >> input');

    if (isVisible) {
      await expect(conditionallyVisibleURL).toBeVisible();
    } else {
      await expect(conditionallyVisibleURL).not.toBeVisible();
    }
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
