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
  test('should login, create case and run the Currency tests', async ({ page }) => {
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

    /** Selecting Currency from the Selected Category dropdown */
    await page.selectOption('lion-select[datatestid="76729937a5eb6b0fd88c42581161facd"] select', 'Currency');

    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Required');

    /** Required tests */
    const requiredCurrency = page.locator('lion-input-amount[datatestid="77af0bd660f2e0276e23a7db7d48235a"] >> input');
    attributes = await common.getAttributes(requiredCurrency);
    await expect(attributes.includes('aria-required')).toBeTruthy();

    const notRequiredCurrency = page.locator('lion-input-amount[datatestid="cab671a0ad307780a2de423a3d19924e"] >> input');
    attributes = await common.getAttributes(notRequiredCurrency);
    await expect(attributes.includes('aria-required')).toBeFalsy();

    /** Selecting Disable from the Sub Category dropdown */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Disable');

    // /** Disable tests */
    const alwaysDisabledCurrency = page.locator('lion-input-amount[datatestid="0d14f3717305e0238966749e6a853dad"] >> input');
    attributes = await common.getAttributes(alwaysDisabledCurrency);
    await expect(attributes.includes('disabled')).toBeTruthy();

    const conditionallyDisabledCurrency = page.locator('lion-input-amount[datatestid="d5e33df8e1d99971f69b7c0015a5ea58"] >> input');
    attributes = await common.getAttributes(conditionallyDisabledCurrency);
    if (isDisabled) {
      await expect(attributes.includes('disabled')).toBeTruthy();
    } else {
      await expect(attributes.includes('disabled')).toBeFalsy();
    }

    const neverDisabledCurrency = page.locator('lion-input-amount[datatestid="40fba95f48961ac8ead17beca7535294"] >> input');
    attributes = await common.getAttributes(neverDisabledCurrency);
    await expect(attributes.includes('disabled')).toBeFalsy();

    /** Selecting Update from the Sub Category dropdown */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Update');

    // const readonlyCurrency = page.locator(
    //   'lion-input-amount[datatestid="32bc05c9bac42b8d76ea72511afa89d0"]  >> input'
    // );
    // attributes = await common.getAttributes(readonlyCurrency);
    // await expect(attributes.includes('readonly')).toBeTruthy();

    const editableCurrency = page.locator('lion-input-amount[datatestid="837e53069fc48e63debdee7fa61fbc1a"]  >> input');
    attributes = await common.getAttributes(editableCurrency);
    editableCurrency.fill('120');

    await expect(attributes.includes('readonly')).toBeFalsy();

    // const currencyAsDecimal = page.locator('lion-input-amount[datatestid="a792300f2080cdbcf7a496220fa7a44e"]  >> input');
    // attributes = await common.getAttributes(currencyAsDecimal);
    // await expect(attributes.includes('readonly')).toBeTruthy();
    // await expect(await currencyAsDecimal.inputValue()).toBe('$20.00');

    /** Selecting Update from the Sub Category dropdown */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Visibility');

    const alwaysVisibleCurrency = await page.locator('lion-input-amount[datatestid="756f918704ee7dcd859928f068d02633"]  >> input');
    await expect(alwaysVisibleCurrency).toBeVisible();

    const neverVisibleCurrency = await page.locator('lion-input-amount[datatestid="5aa7a927ac4876abf1fcff6187ce5d76"]  >> input');
    await expect(neverVisibleCurrency).not.toBeVisible();

    const conditionallyVisibleCurrency = await page.locator('lion-input-amount[datatestid="730a18d88ac68c9cc5f89bf5f6a5caea"]  >> input');

    if (isVisible) {
      await expect(conditionallyVisibleCurrency).toBeVisible();
    } else {
      await expect(conditionallyVisibleCurrency).not.toBeVisible();
    }
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
