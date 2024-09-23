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
  test('should login, create case and run the Picklist tests', async ({ page }) => {
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

    /** Selecting Picklist from the Selected Category dropdown */
    await page.selectOption('lion-select[datatestid="76729937a5eb6b0fd88c42581161facd"] select', 'PickList');

    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'DataPage');

    /** Dropdown tests */
    await page.selectOption('lion-select[datatestid="683ea3aece0dce7e065d31d43f1c269b"] select', 'Dropdown');

    await page.selectOption('lion-select[datatestid="94cb322b7468c7827d336398e525827e"] select', 'Massachusetts');

    /** AutoComplete tests */
    // await page.selectOption('lion-select[datatestid="683ea3aece0dce7e065d31d43f1c269b"] select', 'AutoComplete');

    // await page.selectOption('lion-combobox[datatestid="ed90c4ad051fd65a1d9f0930ec4b2276"] lion-options', 'Colorado');

    /** Radiobutton tests */
    await page.selectOption('lion-select[datatestid="683ea3aece0dce7e065d31d43f1c269b"] select', 'RadioButtons');

    const radiobutton = page.locator('lion-radio-group[datatestid="b33340542f8f3efd4e91279520a197cf"]');
    const radiobuttonInput = radiobutton.locator('lion-radio >> nth=0 >> input[type="radio"]');
    await radiobuttonInput.click();

    const radiobutton2 = page.locator('lion-radio-group[datatestid="9649dad0b2aee94bc3250d26162cb593"]');
    const radiobuttonInput2 = radiobutton2.locator('lion-radio >> nth=1 >> input[type="radio"]');
    await radiobuttonInput2.click();
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
