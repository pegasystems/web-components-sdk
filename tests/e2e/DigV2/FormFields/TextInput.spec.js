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
  test('should login, create case and run the Text Input tests', async ({ page }) => {
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

    /** Selecting TextInput from the Selected Category dropdown */
    await page.selectOption('lion-select[datatestid="76729937a5eb6b0fd88c42581161facd"] select', 'TextInput');

    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Required');

    /** Required tests */
    const requiredTextInput = page.locator('lion-input[datatestid="6d83ba2ad05ae97a2c75e903e6f8a660"] >> input');
    attributes = await common.getAttributes(requiredTextInput);
    await expect(attributes.includes('aria-required')).toBeTruthy();

    const notRequiredTextInput = page.locator('lion-input[datatestid="206bc0200017cc475d88b1bf4279cda0"] >> input');
    attributes = await common.getAttributes(notRequiredTextInput);
    await expect(attributes.includes('aria-required')).toBeFalsy();

    /** Selecting Disable from the Sub Category dropdown */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Disable');

    // /** Disable tests */
    const alwaysDisabledTextInput = page.locator('lion-input[datatestid="52ad9e3ceacdb9ccea7ca193c213228a"] >> input');
    attributes = await common.getAttributes(alwaysDisabledTextInput);
    await expect(attributes.includes('disabled')).toBeTruthy();

    const conditionallyDisabledTextInput = page.locator('lion-input[datatestid="9fd3c38fdf5de68aaa56e298a8c89587"] >> input');
    attributes = await common.getAttributes(conditionallyDisabledTextInput);
    if (isDisabled) {
      await expect(attributes.includes('disabled')).toBeTruthy();
    } else {
      await expect(attributes.includes('disabled')).toBeFalsy();
    }

    const neverDisabledTextInput = page.locator('lion-input[datatestid="0aac4de2a6b79dd12ef91c6f16708533"] >> input');
    attributes = await common.getAttributes(neverDisabledTextInput);
    await expect(attributes.includes('disabled')).toBeFalsy();

    /** Selecting Update from the Sub Category dropdown */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Update');

    const readonlyTextInput = page.locator('lion-input[datatestid="2fff66b4f045e02eab5826ba25608807"]  >> input');
    attributes = await common.getAttributes(readonlyTextInput);
    await expect(attributes.includes('readonly')).toBeTruthy();

    const EditableTextInput = page.locator('lion-input[datatestid="95134a02d891264bca28c3aad682afb7"]  >> input');
    attributes = await common.getAttributes(EditableTextInput);
    await expect(attributes.includes('readonly')).toBeFalsy();

    /** Selecting Update from the Sub Category dropdown */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Visibility');

    const alwaysVisibleTextInput = await page.locator('lion-input[datatestid="a03145775f20271d9f1276b0959d0b8e"]  >> input');
    await expect(alwaysVisibleTextInput).toBeVisible();

    const neverVisibleTextInput = await page.locator('lion-input[datatestid="05bf85e34402515bd91335928c06117d"]  >> input');
    await expect(neverVisibleTextInput).not.toBeVisible();

    const conditionallyVisibleTextInput = await page.locator('lion-input[datatestid="d4b374793638017e2ec1b86c81bb1208"]  >> input');

    if (isVisible) {
      await expect(conditionallyVisibleTextInput).toBeVisible();
    } else {
      await expect(conditionallyVisibleTextInput).not.toBeVisible();
    }
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
