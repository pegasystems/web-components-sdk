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
  test('should login, create case and run the Integer tests', async ({ page }) => {
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

    /** Selecting Integer from the Selected Category dropdown */
    await page.selectOption('lion-select[datatestid="76729937a5eb6b0fd88c42581161facd"] select', 'Integer');

    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Required');

    await page.locator('button:has-text("submit")').click();

    await expect(page.locator('lion-validation-feedback[type="error"]')).toBeVisible();

    /** Required tests */

    const requiredInteger = page.locator('lion-input-amount[datatestid="0658481a174254dded4a0c1ffe6b8380"] >> input');
    requiredInteger.click();
    await requiredInteger.clear();
    await requiredInteger.pressSequentially('1000');
    requiredInteger.blur();
    await expect(page.locator('lion-validation-feedback[type="error"]')).toBeHidden();

    attributes = await common.getAttributes(requiredInteger);
    await expect(attributes.includes('aria-required')).toBeTruthy();

    const notRequiredInteger = page.locator('lion-input-amount[datatestid="898ba585340f471eecde6b5e798e4df9"] >> input');
    attributes = await common.getAttributes(notRequiredInteger);
    await expect(attributes.includes('aria-required')).toBeFalsy();

    /** Selecting Disable from the Sub Category dropdown */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Disable');

    // /** Disable tests */
    const alwaysDisabledInteger = page.locator('lion-input-amount[datatestid="54a4d3f4aa52da1985ec70df7cae41bf"] >> input');
    attributes = await common.getAttributes(alwaysDisabledInteger);
    await expect(attributes.includes('disabled')).toBeTruthy();

    const conditionallyDisabledInteger = page.locator('lion-input-amount[datatestid="880afccc457382196a2164f04aeeb19d"] >> input');
    attributes = await common.getAttributes(conditionallyDisabledInteger);
    if (isDisabled) {
      await expect(attributes.includes('disabled')).toBeTruthy();
    } else {
      await expect(attributes.includes('disabled')).toBeFalsy();
    }

    const neverDisabledInteger = page.locator('lion-input-amount[datatestid="42369a000d05b1bb387c743252b94085"] >> input');
    attributes = await common.getAttributes(neverDisabledInteger);
    await expect(attributes.includes('disabled')).toBeFalsy();

    /** Selecting Update from the Sub Category dropdown */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Update');

    const readonlyInteger = page.locator('lion-input[datatestid="c6f04035ab4212992a31968bf190875b"]  >> input');
    attributes = await common.getAttributes(readonlyInteger);
    await expect(attributes.includes('readonly')).toBeTruthy();

    const EditableInteger = page.locator('lion-input-amount[datatestid="c2aac6ae0d08ac599edf0ea4f27c5437"]  >> input');
    EditableInteger.fill('1000');
    attributes = await common.getAttributes(EditableInteger);
    await expect(attributes.includes('readonly')).toBeFalsy();

    /** Selecting Update from the Sub Category dropdown */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Visibility');

    const alwaysVisibleInteger = await page.locator('lion-input-amount[datatestid="4c6e4bb7d9b71d6b45cd6ae61b9ca334"]  >> input');
    await expect(alwaysVisibleInteger).toBeVisible();

    const neverVisibleInteger = await page.locator('lion-input-amount[datatestid="98c754d4acf25bb98ea8a2c46b28275c"]  >> input');
    await expect(neverVisibleInteger).not.toBeVisible();

    const conditionallyVisibleInteger = await page.locator('lion-input-amount[datatestid="655ddd9a5d76e464311c32d2b53bf963"]  >> input');

    if (isVisible) {
      await expect(conditionallyVisibleInteger).toBeVisible();
    } else {
      await expect(conditionallyVisibleInteger).not.toBeVisible();
    }
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
