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
  test('should login, create case and run the Date tests', async ({ page }) => {
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

    /** Selecting Date from the Selected Category dropdown */
    await page.selectOption('lion-select[datatestid="76729937a5eb6b0fd88c42581161facd"] select', 'Date');

    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Required');

    await page.locator('button:has-text("submit")').click();

    await expect(page.locator('lion-validation-feedback[type="error"]')).toBeVisible();

    /** Required tests */
    const requiredDate = page.locator('lion-input-dateonly[datatestid="4aeccb2d830e2836aebba27424c057e1"] >> input');
    attributes = await common.getAttributes(requiredDate);
    await expect(attributes.includes('aria-required')).toBeTruthy();
    await requiredDate.click();
    const futureDate = common.getFutureDate();
    await requiredDate.type(futureDate);

    await expect(page.locator('lion-validation-feedback[type="error"]')).toBeHidden();

    const notRequiredDate = page.locator('lion-input-dateonly[datatestid="3f56f9d617e6174716d7730f8d69cce5"] >> input');
    attributes = await common.getAttributes(notRequiredDate);
    await expect(attributes.includes('aria-required')).toBeFalsy();

    /** Selecting Disable from the Sub Category dropdown */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Disable');

    // /** Disable tests */
    const alwaysDisabledDate = page.locator('lion-input-dateonly[datatestid="058f04d806163a3ea0ad42d63a44bff8"] >> input');
    attributes = await common.getAttributes(alwaysDisabledDate);
    await expect(attributes.includes('disabled')).toBeTruthy();

    const conditionallyDisabledDate = page.locator('lion-input-dateonly[datatestid="1064f84bc0ba8525d5f141869fb73a3d"] >> input');
    attributes = await common.getAttributes(conditionallyDisabledDate);
    if (isDisabled) {
      await expect(attributes.includes('disabled')).toBeTruthy();
    } else {
      await expect(attributes.includes('disabled')).toBeFalsy();
    }

    const neverDisabledDate = page.locator('lion-input-dateonly[datatestid="3cf7f70f60efb4035b562b6d5994badd"] >> input');
    attributes = await common.getAttributes(neverDisabledDate);
    await expect(attributes.includes('disabled')).toBeFalsy();

    /** Selecting Update from the Sub Category dropdown */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Update');

    // const readonlyDate = page.locator(
    //   'lion-input-dateonly[datatestid="2fff66b4f045e02eab5826ba25608807"]  >> input'
    // );
    // attributes = await common.getAttributes(readonlyDate);
    // await expect(attributes.includes('readonly')).toBeTruthy();

    const editableDate = page.locator('lion-input-dateonly[datatestid="80f5dcc587f457378158bb305ec858a8"]  >> input');
    attributes = await common.getAttributes(editableDate);
    await expect(attributes.includes('readonly')).toBeFalsy();

    /** Selecting Update from the Sub Category dropdown */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Visibility');

    const alwaysVisibleDate = await page.locator('lion-input-dateonly[datatestid="8d1ca7132d5ebd69ccc69b850cf0e114"]  >> input');
    await expect(alwaysVisibleDate).toBeVisible();

    const neverVisibleDate = await page.locator('lion-input-dateonly[datatestid="2d575befd938b2cf573f6cdee8d2c194"]  >> input');
    await expect(neverVisibleDate).not.toBeVisible();

    const conditionallyVisibleDate = await page.locator('lion-input-dateonly[datatestid="2a50b142f72fe68effc573bb904c8364"]  >> input');

    if (isVisible) {
      await expect(conditionallyVisibleDate).toBeVisible();
    } else {
      await expect(conditionallyVisibleDate).not.toBeVisible();
    }
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
