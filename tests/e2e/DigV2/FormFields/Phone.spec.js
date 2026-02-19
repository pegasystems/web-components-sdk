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
  test('should login, create case and run the Phone tests', async ({ page }) => {
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

    /** Selecting Phone from the Selected Category dropdown */
    await page.selectOption('lion-select[datatestid="76729937a5eb6b0fd88c42581161facd"] select', 'Phone');

    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Required');

    await page.locator('button:has-text("submit")').click();

    await expect(page.locator('lion-validation-feedback[type="error"]')).toBeVisible();

    /** Required tests */
    //const requiredPhone = page.locator('lion-input-tel-dropdown[datatestid="af983eaa1b85b015a7654702abd0b249"] >> input');
    //requiredPhone.click();
    await page.fill('lion-input-tel-dropdown[datatestid="af983eaa1b85b015a7654702abd0b249"] input', '6175551212');
    
    // await requiredPhone.pressSequentially('6175551212');
    //requiredPhone.blur();
    await expect(page.locator('lion-validation-feedback[type="error"]')).toBeHidden();

    attributes = await common.getAttributes(requiredPhone);
    await expect(attributes.includes('aria-required')).toBeTruthy();

    const notRequiredPhone = page.locator('lion-input[datatestid="8e20f3ae84ebed6107f2672dd430500f"] >> input');
    attributes = await common.getAttributes(notRequiredPhone);
    await expect(attributes.includes('aria-required')).toBeFalsy();

    /** Selecting Disable from the Sub Category dropdown */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Disable');

    // /** Disable tests */
    const alwaysDisabledPhone = page.locator('lion-input[datatestid="d415da67e9764d6e7cdf3d993cb54f51"] >> input');
    attributes = await common.getAttributes(alwaysDisabledPhone);
    await expect(attributes.includes('disabled')).toBeTruthy();

    const conditionallyDisabledPhone = page.locator('lion-input[datatestid="b6cee3728235ed1f6cef7b11ac850ea9"] >> input');
    attributes = await common.getAttributes(conditionallyDisabledPhone);
    if (isDisabled) {
      await expect(attributes.includes('disabled')).toBeTruthy();
    } else {
      await expect(attributes.includes('disabled')).toBeFalsy();
    }

    const neverDisabledPhone = page.locator('lion-input[datatestid="b23e38f877c8a40f18507b39893a8d61"] >> input');
    attributes = await common.getAttributes(neverDisabledPhone);
    await expect(attributes.includes('disabled')).toBeFalsy();

    /** Selecting Update from the Sub Category dropdown */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Update');

    const readonlyPhone = page.locator('lion-input[datatestid="2c511e68e41cb70907b27a00de6b18b9"]  >> input');
    attributes = await common.getAttributes(readonlyPhone);
    await expect(attributes.includes('readonly')).toBeTruthy();

    const editablePhone = page.locator('lion-input[datatestid="591e127300787ad31c414b7159469b9e"]  >> input');
    await editablePhone.fill('6175551212');

    attributes = await common.getAttributes(editablePhone);
    await expect(attributes.includes('readonly')).toBeFalsy();

    /** Selecting Update from the Sub Category dropdown */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Visibility');

    const alwaysVisiblePhone = await page.locator('lion-input[datatestid="6637b718c18a1fd292d28b6abaa68d50"]  >> input');
    await expect(alwaysVisiblePhone).toBeVisible();

    const neverVisiblePhone = await page.locator('lion-input[datatestid="f425267235530e772d7daa0a0881c822"]  >> input');
    await expect(neverVisiblePhone).not.toBeVisible();

    const conditionallyVisiblePhone = await page.locator('lion-input[datatestid="ad9995a1b5001e6d153d363465371528"]  >> input');

    if (isVisible) {
      await expect(conditionallyVisiblePhone).toBeVisible();
    } else {
      await expect(conditionallyVisiblePhone).not.toBeVisible();
    }
  }, 4000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
