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
  test('should login, create case and run the TextArea tests', async ({ page }) => {
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

    /** Selecting TextArea from the Selected Category dropdown */
    await page.selectOption('lion-select[datatestid="76729937a5eb6b0fd88c42581161facd"] select', 'TextArea');

    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Required');

    await page.locator('button:has-text("submit")').click();

    await expect(page.locator('lion-validation-feedback[type="error"]')).toBeVisible();

    /** Required tests */
    const requiredTextArea = page.locator('lion-textarea[datatestid="b82763ad8469c6be8d3303a773fc3337"] >> textarea');

    attributes = await common.getAttributes(requiredTextArea);
    await expect(attributes.includes('aria-required')).toBeTruthy();

    const notRequiredTextArea = page.locator('lion-textarea[datatestid="c8e8140c523f01908b73d415ff81e5e9"] >> textarea');
    attributes = await common.getAttributes(notRequiredTextArea);
    await expect(attributes.includes('aria-required')).toBeFalsy();

    /** Selecting Disable from the Sub Category dropdown */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Disable');

    // /** Disable tests */
    const alwaysDisabledTextArea = page.locator('lion-textarea[datatestid="0a9da72f88e89b62d5477181f60e326d"] >> textarea');
    attributes = await common.getAttributes(alwaysDisabledTextArea);
    await expect(attributes.includes('disabled')).toBeTruthy();

    const conditionallyDisabledTextArea = page.locator('lion-textarea[datatestid="ab462bc2f67456422bd65ef803e5f1f7"] >> textarea');
    attributes = await common.getAttributes(conditionallyDisabledTextArea);
    if (isDisabled) {
      await expect(attributes.includes('disabled')).toBeTruthy();
    } else {
      await expect(attributes.includes('disabled')).toBeFalsy();
    }

    const neverDisabledTextArea = page.locator('lion-textarea[datatestid="3c91efe71a84d1331627d97d2871b6cc"] >> textarea');
    attributes = await common.getAttributes(neverDisabledTextArea);
    await expect(attributes.includes('disabled')).toBeFalsy();

    /** Selecting Update from the Sub Category dropdown */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Update');

    const readonlyTextArea = page.locator('lion-input[datatestid="77a1ab038e906456b8e8c94c1671518c"]  >> input');
    attributes = await common.getAttributes(readonlyTextArea);
    await expect(attributes.includes('readonly')).toBeTruthy();

    const editableTextArea = page.locator('lion-textarea[datatestid="66e97bb54e9e0ad5860ed79bb7b8e8d4"]  >> textarea');
    editableTextArea.fill('This is a TextArea');
    // validation message to be checked -- ToDo

    attributes = await common.getAttributes(editableTextArea);
    await expect(attributes.includes('readonly')).toBeFalsy();

    /** Selecting Update from the Sub Category dropdown */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Visibility');

    const alwaysVisibleTextArea = await page.locator('lion-textarea[datatestid="b1173be73e47e82896554ec60a590d6d"]  >> textarea');
    await expect(alwaysVisibleTextArea).toBeVisible();

    const neverVisibleTextArea = await page.locator('lion-textarea[datatestid="6de0e0e23e9aab0f4fef3d9d4f52c4d8"]  >> textarea');
    await expect(neverVisibleTextArea).not.toBeVisible();

    const conditionallyVisibleTextArea = await page.locator('lion-textarea[datatestid="4a41d6f28d7a25290f93127d3b5b0c64"]  >> textarea');

    if (isVisible) {
      await expect(conditionallyVisibleTextArea).toBeVisible();
    } else {
      await expect(conditionallyVisibleTextArea).not.toBeVisible();
    }
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
