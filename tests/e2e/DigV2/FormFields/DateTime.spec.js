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
  test('should login, create case and run the DateTime tests', async ({ page }) => {
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

    /** Selecting DateTime from the Selected Category dropdown */
    await page.selectOption('lion-select[datatestid="76729937a5eb6b0fd88c42581161facd"] select', 'DateTime');

    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Required');

    await page.locator('button:has-text("submit")').click();

    await expect(page.locator('lion-validation-feedback[type="error"]')).toBeVisible();

    /** Required tests */
    const requiredDateTime = page.locator('lion-input-datetime[datatestid="8c40204d0a4eee26d94339eee34ac0dd"] >> input');
    const date = new Date();
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    const time = `${(date.getHours() % 12).toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}AM`;
    await requiredDateTime.click();
    await requiredDateTime.pressSequentially(formattedDate);
    page.keyboard.press('Tab');
    await requiredDateTime.pressSequentially(time);

    attributes = await common.getAttributes(requiredDateTime);
    await expect(attributes.includes('aria-required')).toBeTruthy();

    await expect(page.locator('lion-validation-feedback[type="error"]')).toBeHidden();

    const notRequiredDateTime = page.locator('lion-input-datetime[datatestid="4af9f6fe0973eef74015a25fc36784c0"] >> input');
    attributes = await common.getAttributes(notRequiredDateTime);
    await expect(attributes.includes('aria-required')).toBeFalsy();

    /** Selecting Disable from the Sub Category dropdown */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Disable');

    // /** Disable tests */
    const alwaysDisabledDateTime = page.locator('lion-input-datetime[datatestid="94d0498d6fd5a5aa2db1145100810fc3"] >> input');
    attributes = await common.getAttributes(alwaysDisabledDateTime);
    await expect(attributes.includes('disabled')).toBeTruthy();

    const conditionallyDisabledDateTime = page.locator('lion-input-datetime[datatestid="98882344d484a1122bdb831ace88b0d3"] >> input');
    attributes = await common.getAttributes(conditionallyDisabledDateTime);
    if (isDisabled) {
      await expect(attributes.includes('disabled')).toBeTruthy();
    } else {
      await expect(attributes.includes('disabled')).toBeFalsy();
    }

    const neverDisabledDateTime = page.locator('lion-input-datetime[datatestid="33d5b006df6170d453d52c438271f0eb"] >> input');
    attributes = await common.getAttributes(neverDisabledDateTime);
    await expect(attributes.includes('disabled')).toBeFalsy();

    /** Selecting Update from the Sub Category dropdown */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Update');

    const readonlyDateTime = page.locator('lion-input[datatestid="13858d32e1a9e9065cbef90a4fc4467e"]  >> input');
    attributes = await common.getAttributes(readonlyDateTime);
    await expect(attributes.includes('readonly')).toBeTruthy();

    const editableDateTime = page.locator('lion-input-datetime[datatestid="4e5110fbcaf65441b3e4c763907b5eb8"]  >> input');
    await editableDateTime.click();
    await editableDateTime.pressSequentially(formattedDate);
    page.keyboard.press('Tab');
    await editableDateTime.pressSequentially(time);
    attributes = await common.getAttributes(editableDateTime);
    await expect(attributes.includes('readonly')).toBeFalsy();

    /** Selecting Update from the Sub Category dropdown */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Visibility');

    const alwaysVisibleDate = await page.locator('lion-input-datetime[datatestid="f7bace3922d6b19942bcb05f4bbe34ff"]  >> input');
    await expect(alwaysVisibleDate).toBeVisible();

    const neverVisibleDateTime = await page.locator('lion-input-datetime[datatestid="33d5b006df6170d453d52c438271f0eb"]  >> input');
    await expect(neverVisibleDateTime).not.toBeVisible();

    const conditionallyVisibleDateTime = await page.locator('lion-input-datetime[datatestid="d7168c76ee76f4242fee3afbd4c9f745"]  >> input');

    if (isVisible) {
      await expect(conditionallyVisibleDateTime).toBeVisible();
    } else {
      await expect(conditionallyVisibleDateTime).not.toBeVisible();
    }
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
