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
  test('should login, create case and run the Email tests', async ({ page }) => {
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

    /** Selecting Email from the Selected Category dropdown */
    await page.selectOption('lion-select[datatestid="76729937a5eb6b0fd88c42581161facd"] select', 'Email');

    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Required');

    await page.locator('button:has-text("submit")').click();

    await expect(page.locator('lion-validation-feedback[type="error"]')).toBeVisible();

    /** Required tests */
    const requiredEmail = page.locator('lion-input-email[datatestid="96fa7548c363cdd5adb29c2c2749e436"] >> input');
    await requiredEmail.pressSequentially('John@doe.com');
    requiredEmail.blur();
    await expect(page.locator('lion-validation-feedback[type="error"]')).toBeHidden();

    attributes = await common.getAttributes(requiredEmail);
    await expect(attributes.includes('aria-required')).toBeTruthy();

    const notRequiredEmail = page.locator('lion-input-email[datatestid="ead104471c2e64511e7593a80b823e42"] >> input');
    attributes = await common.getAttributes(notRequiredEmail);
    await expect(attributes.includes('aria-required')).toBeFalsy();

    /** Selecting Disable from the Sub Category dropdown */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Disable');

    // /** Disable tests */
    const alwaysDisabledEmail = page.locator('lion-input-email[datatestid="b949bbfd05d3e96a0102055e448dd7ab"] >> input');
    attributes = await common.getAttributes(alwaysDisabledEmail);
    await expect(attributes.includes('disabled')).toBeTruthy();

    const conditionallyDisabledEmail = page.locator('lion-input-email[datatestid="23104b6fc0da1045beb3f037698201aa"] >> input');
    attributes = await common.getAttributes(conditionallyDisabledEmail);
    if (isDisabled) {
      await expect(attributes.includes('disabled')).toBeTruthy();
    } else {
      await expect(attributes.includes('disabled')).toBeFalsy();
    }

    const neverDisabledEmail = page.locator('lion-input-email[datatestid="15d6a12d383c87b8695f8f11523af8c6"] >> input');
    attributes = await common.getAttributes(neverDisabledEmail);
    await expect(attributes.includes('disabled')).toBeFalsy();

    /** Selecting Update from the Sub Category dropdown */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Update');

    const readonlyEmail = page.locator('lion-input[datatestid="88ee5a6a4cc37dab09907ea81c546a19"]  >> input');
    attributes = await common.getAttributes(readonlyEmail);
    await expect(attributes.includes('readonly')).toBeTruthy();

    const editableEmail = page.locator('lion-input-email[datatestid="c75f8a926bb5e08fd8342f7fe45dc344"]  >> input');
    await editableEmail.fill('Johndoe.com');
    await editableEmail.blur();
    // const validMsg = 'Please enter a valid EmailEditable in the format "name//@example.com".';
    await expect(page.locator('lion-validation-feedback[type="error"]')).toBeVisible();
    editableEmail.fill('John@doe.com');
    await editableEmail.blur();
    await expect(page.locator('lion-validation-feedback[type="error"]')).toBeHidden();

    attributes = await common.getAttributes(editableEmail);
    await expect(attributes.includes('readonly')).toBeFalsy();

    /** Selecting Update from the Sub Category dropdown */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Visibility');

    const alwaysVisibleEmail = await page.locator('lion-input-email[datatestid="c30b8043cb501907a3e7b186fb37a85b"]  >> input');
    await expect(alwaysVisibleEmail).toBeVisible();

    const neverVisibleEmail = await page.locator('lion-input-email[datatestid="5aa7a927ac4876abf1fcff6187ce5d76"]  >> input');
    await expect(neverVisibleEmail).not.toBeVisible();

    const conditionallyVisibleEmail = await page.locator('lion-input-email[datatestid="7f544a3551e7d7e51222dec315e7add5"]  >> input');

    if (isVisible) {
      await expect(conditionallyVisibleEmail).toBeVisible();
    } else {
      await expect(conditionallyVisibleEmail).not.toBeVisible();
    }
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
