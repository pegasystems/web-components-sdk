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
  test('should login, create case and run the Percentage tests', async ({ page }) => {
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

    /** Selecting Percentage from the Selected Category dropdown */
    await page.selectOption('lion-select[datatestid="76729937a5eb6b0fd88c42581161facd"] select', 'Percentage');

    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Required');

    await page.locator('button:has-text("submit")').click();

    await page.waitForTimeout(2000);
    
    await expect(page.locator('lion-validation-feedback[type="error"]')).toBeVisible();

    /** Required tests */

    const requiredPercentage = page.locator('lion-input-amount[datatestid="86a805ca8375ed5df057777df74dd085"] >> input');

    attributes = await common.getAttributes(requiredPercentage);
    await expect(attributes.includes('aria-required')).toBeTruthy();

    const notRequiredPercentage = page.locator('lion-input-amount[datatestid="b1de2a4d96400570b2f6de9defed1adc"] >> input');
    attributes = await common.getAttributes(notRequiredPercentage);
    await expect(attributes.includes('aria-required')).toBeFalsy();

    /** Selecting Disable from the Sub Category dropdown */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Disable');

    // /** Disable tests */
    const alwaysDisabledPercentage = page.locator('lion-input-amount[datatestid="7900b3bd0ac7a6a59b1f5fe9b23749c4"] >> input');
    attributes = await common.getAttributes(alwaysDisabledPercentage);
    await expect(attributes.includes('disabled')).toBeTruthy();

    const conditionallyDisabledPercentage = page.locator('lion-input-amount[datatestid="2ba7bcc4ab57debc35f68e4dfd2c15d8"] >> input');
    attributes = await common.getAttributes(conditionallyDisabledPercentage);
    if (isDisabled) {
      await expect(attributes.includes('disabled')).toBeTruthy();
    } else {
      await expect(attributes.includes('disabled')).toBeFalsy();
    }

    const neverDisabledPercentage = page.locator('lion-input-amount[datatestid="bbbf1d564583c33adcd086b330fcb1f7"] >> input');
    attributes = await common.getAttributes(neverDisabledPercentage);
    await expect(attributes.includes('disabled')).toBeFalsy();

    /** Selecting Update from the Sub Category dropdown */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Update');

    const readonlyPercentage = page.locator('lion-input[datatestid="4d28c40ee619dafd16f7f4813e18ece6"]  >> input');
    attributes = await common.getAttributes(readonlyPercentage);
    await expect(attributes.includes('readonly')).toBeTruthy();

    const EditablePercentage = page.locator('lion-input-amount[datatestid="2cf58b575154624084c009d2648659ad"]  >> input');
    EditablePercentage.fill('1000');
    attributes = await common.getAttributes(EditablePercentage);
    await expect(attributes.includes('readonly')).toBeFalsy();

    /** Selecting Update from the Sub Category dropdown */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Visibility');

    const alwaysVisiblePercentage = await page.locator('lion-input-amount[datatestid="bc2c3cb45ab755e262b381abbb0307fa"]  >> input');
    await expect(alwaysVisiblePercentage).toBeVisible();

    const neverVisiblePercentage = await page.locator('lion-input-amount[datatestid="a3584329c24e284dda8d3771e72bca20"]  >> input');
    await expect(neverVisiblePercentage).not.toBeVisible();

    const conditionallyVisiblePercentage = await page.locator('lion-input-amount[datatestid="d73817df2fef4a70f74349d3c70f10a5"]  >> input');

    if (isVisible) {
      await expect(conditionallyVisiblePercentage).toBeVisible();
    } else {
      await expect(conditionallyVisiblePercentage).not.toBeVisible();
    }
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
