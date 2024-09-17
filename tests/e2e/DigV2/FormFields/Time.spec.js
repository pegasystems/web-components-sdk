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
  test('should login, create case and run the Time tests', async ({ page }) => {
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

    /** Selecting TimeOnly from the Selected Category dropdown */
    await page.selectOption('lion-select[datatestid="76729937a5eb6b0fd88c42581161facd"] select', 'TimeOnly');

    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Required');

    await page.locator('button:has-text("submit")').click();

    await expect(page.locator('lion-validation-feedback[type="error"]')).toBeVisible();

    /** Required tests */
    const requiredTime = page.locator('lion-input-timeonly[datatestid="2a98fa391e3ce4e2a077bb71271eb2da"] >> input');
    attributes = await common.getAttributes(requiredTime);
    await expect(attributes.includes('aria-required')).toBeTruthy();
    const date = new Date();
    // Converting hours from 24 to 12 format, including the special case of "12"
    const time = `${(date.getHours() % 12 || 12).toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}AM`;
    requiredTime.pressSequentially(time);

    await expect(page.locator('lion-validation-feedback[type="error"]')).toBeHidden();

    const notRequiredTime = page.locator('lion-input-timeonly[datatestid="921d625dba40a48cdcd006d6d17273fd"] >> input');
    attributes = await common.getAttributes(notRequiredTime);
    await expect(attributes.includes('aria-required')).toBeFalsy();

    /** Selecting Disable from the Sub Category dropdown */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Disable');

    // /** Disable tests */
    const alwaysDisabledTime = page.locator('lion-input-timeonly[datatestid="b5b2a2335304986a2aba011c0a2a464d"] >> input');
    attributes = await common.getAttributes(alwaysDisabledTime);
    await expect(attributes.includes('disabled')).toBeTruthy();

    const conditionallyDisabledDate = page.locator('lion-input-timeonly[datatestid="9f7b7d5d8793642e0650a03f5f9dd991"] >> input');
    attributes = await common.getAttributes(conditionallyDisabledDate);
    if (isDisabled) {
      await expect(attributes.includes('disabled')).toBeTruthy();
    } else {
      await expect(attributes.includes('disabled')).toBeFalsy();
    }

    const neverDisabledDate = page.locator('lion-input-timeonly[datatestid="aeb770a579929bf10a1b301600da68ca"] >> input');
    attributes = await common.getAttributes(neverDisabledDate);
    await expect(attributes.includes('disabled')).toBeFalsy();

    /** Selecting Update from the Sub Category dropdown */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Update');

    const readonlyTime = page.locator('lion-input[datatestid="084f8187169ed36f03937ecfd6e67087"]  >> input');
    attributes = await common.getAttributes(readonlyTime);
    await expect(attributes.includes('readonly')).toBeTruthy();

    const editableTime = page.locator('lion-input-timeonly[datatestid="9a43bbe34f0e3db5a53f8e89082c0770"]  >> input');
    attributes = await common.getAttributes(editableTime);
    await expect(attributes.includes('readonly')).toBeFalsy();

    /** Selecting Update from the Sub Category dropdown */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Visibility');

    const alwaysVisibleTime = await page.locator('lion-input-timeonly[datatestid="1b5786591e69307188bb7bb6ed1d6007"]  >> input');
    await expect(alwaysVisibleTime).toBeVisible();

    const neverVisibleTime = await page.locator('lion-input-timeonly[datatestid="971d3da425a39fac98652a85633db661"]  >> input');
    await expect(neverVisibleTime).not.toBeVisible();

    const conditionallyVisibleTime = await page.locator('lion-input-timeonly[datatestid="6e52133ee5d2aef2dab9a8e61511c030"]  >> input');

    if (isVisible) {
      await expect(conditionallyVisibleTime).toBeVisible();
    } else {
      await expect(conditionallyVisibleTime).not.toBeVisible();
    }
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
