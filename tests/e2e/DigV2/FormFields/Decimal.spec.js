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
  test('should login, create case and run the Decimal tests', async ({ page }) => {
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

    /** Selecting Decimal from the Selected Category dropdown */
    await page.selectOption('lion-select[datatestid="76729937a5eb6b0fd88c42581161facd"] select', 'Decimal');

    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Required');

    await page.locator('button:has-text("submit")').click();

    await expect(page.locator('lion-validation-feedback[type="error"]')).toBeVisible();

    /** Required tests */

    const requiredDecimal = page.locator('lion-input-amount[datatestid="9de2a78c2dd0d4dfff4a9bf33349197d"] >> input');
    requiredDecimal.click();
    await requiredDecimal.clear();
    await requiredDecimal.pressSequentially('12345');
    await expect(page.locator('lion-validation-feedback[type="error"]')).toBeHidden();

    attributes = await common.getAttributes(requiredDecimal);
    await expect(attributes.includes('aria-required')).toBeTruthy();

    const notRequiredDecimal = page.locator('lion-input-amount[datatestid="ec06f580c56642afef52547b6755695e"] >> input');
    attributes = await common.getAttributes(notRequiredDecimal);
    await expect(attributes.includes('aria-required')).toBeFalsy();

    /** Selecting Disable from the Sub Category dropdown */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Disable');

    // /** Disable tests */
    const alwaysDisabledDecimal = page.locator('lion-input-amount[datatestid="a8216a966548578ad7e015a05ae518f5"] >> input');
    attributes = await common.getAttributes(alwaysDisabledDecimal);
    await expect(attributes.includes('disabled')).toBeTruthy();

    const conditionallyDisabledDecimal = page.locator('lion-input-amount[datatestid="fdd7f2ac36278186ac15c11d4c30ece1"] >> input');
    attributes = await common.getAttributes(conditionallyDisabledDecimal);
    if (isDisabled) {
      await expect(attributes.includes('disabled')).toBeTruthy();
    } else {
      await expect(attributes.includes('disabled')).toBeFalsy();
    }

    const neverDisabledDecimal = page.locator('lion-input-amount[datatestid="e91313ec779184e1b172bdc7870f3d4c"] >> input');
    attributes = await common.getAttributes(neverDisabledDecimal);
    await expect(attributes.includes('disabled')).toBeFalsy();

    /** Selecting Update from the Sub Category dropdown */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Update');

    const readonlyDecimal = page.locator('lion-input-amount[datatestid="acdcc5f01c940f07cf14373612721a0c"]');
    attributes = await common.getAttributes(readonlyDecimal);
    await expect(attributes.includes('readonly')).toBeTruthy();

    const EditableDecimal = page.locator('lion-input-amount[datatestid="3e8f5b4dd3786ae5d79fd2dfa2e53cac"]  >> input');
    attributes = await common.getAttributes(EditableDecimal);
    await expect(attributes.includes('readonly')).toBeFalsy();

    // const decimalAsCurrency = page.locator('lion-input[datatestid="9e438afab6d7ec67b5582bded10f5172"]  >> input');
    // attributes = await common.getAttributes(decimalAsCurrency);
    // await expect(attributes.includes('readonly')).toBeTruthy();
    // await expect(await decimalAsCurrency.inputValue()).toBe('$20.00');

    /** Selecting Update from the Sub Category dropdown */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Visibility');

    const alwaysVisibleDecimal = await page.locator('lion-input-amount[datatestid="847e3fd45a1aca1c3242d2735124eb9a"]  >> input');
    await expect(alwaysVisibleDecimal).toBeVisible();

    const neverVisibleDecimal = await page.locator('lion-input-amount[datatestid="c73cc441b5988a07bfb30ce168c98800"]  >> input');
    await expect(neverVisibleDecimal).not.toBeVisible();

    const conditionallyVisibleDecimal = await page.locator('lion-input-amount[datatestid="6e93264d15f63cf06e79a402e48c283b"]  >> input');

    if (isVisible) {
      await expect(conditionallyVisibleDecimal).toBeVisible();
    } else {
      await expect(conditionallyVisibleDecimal).not.toBeVisible();
    }
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
