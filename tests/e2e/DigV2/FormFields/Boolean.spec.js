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
  test('should login, create case and run the Boolean tests', async ({ page }) => {
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

    /** Selecting Boolean from the Selected Category dropdown */
    await page.selectOption('lion-select[datatestid="76729937a5eb6b0fd88c42581161facd"] select', 'Boolean');

    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Required');

    /** Required tests */
    const requiredBooleanLabel = page.locator('lion-checkbox[datatestid="325f4eb20dc7c90a4fb697cd6c6bf0ea"] >> input');
    attributes = await common.getAttributes(requiredBooleanLabel);
    await expect(attributes.includes('aria-required')).toBeTruthy();

    const notRequiredBooleanLabel = page.locator('lion-checkbox[datatestid="da0d9f2c08a5bebe777c814af80a2351"] >> input');
    attributes = await common.getAttributes(notRequiredBooleanLabel);
    await expect(attributes.includes('aria-required')).toBeFalsy();

    /** Selecting Disable from the Sub Category dropdown */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Disable');

    // /** Disable tests */
    const alwaysDisabledBoolean = page.locator('lion-checkbox[datatestid="2f75cd75149315abb9d17aedfe1e129f"] >> input');
    attributes = await common.getAttributes(alwaysDisabledBoolean);
    await expect(attributes.includes('disabled')).toBeTruthy();

    const conditionallyDisabledBoolean = page.locator('lion-checkbox[datatestid="a1e631c61eef59321ecda65e5b1e74df"] >> input');
    attributes = await common.getAttributes(conditionallyDisabledBoolean);
    if (isDisabled) {
      await expect(attributes.includes('disabled')).toBeTruthy();
    } else {
      await expect(attributes.includes('disabled')).toBeFalsy();
    }

    const neverDisabledBoolean = page.locator('lion-checkbox[datatestid="c02c55807a1cda4f36c9736c17230e27"] >> input');
    attributes = await common.getAttributes(neverDisabledBoolean);
    await expect(attributes.includes('disabled')).toBeFalsy();

    /** Selecting Update from the Sub Category dropdown */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Update');

    // const readonlyBoolean = page.locator(
    //   'lion-checkbox[datatestid="1a2aa7aad5f32dbd4638c3d5cf7b5d29"]  >> input'
    // );
    // attributes = await common.getAttributes(readonlyBoolean);
    // await expect(attributes.includes('readonly')).toBeTruthy();

    const editableBoolean = page.locator('lion-checkbox[datatestid="d8d1f4bcad30bda634454182e0d1e67c"]  >> input');
    attributes = await common.getAttributes(editableBoolean);
    await expect(attributes.includes('readonly')).toBeFalsy();

    /** Selecting Update from the Sub Category dropdown */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Visibility');

    const alwaysVisibleBoolean = page.locator('lion-checkbox[datatestid="9a31d647526143ebb08c22a58836510d"]  >> input');
    await expect(alwaysVisibleBoolean).toBeVisible();

    const neverVisibleBoolean = await page.locator('lion-checkbox[datatestid="521a807a0967b9fbbcc4a1232f1f8b46"]  >> input');
    await expect(neverVisibleBoolean).not.toBeVisible();

    const conditionallyVisibleBoolean = await page.locator('lion-checkbox[datatestid="dfbced3de44b50c470a58131004c31fe"]  >> input');

    if (isVisible) {
      await expect(conditionallyVisibleBoolean).toBeVisible();
    } else {
      await expect(conditionallyVisibleBoolean).not.toBeVisible();
    }
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
