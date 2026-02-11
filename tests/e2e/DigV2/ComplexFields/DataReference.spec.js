const { test, expect } = require('@playwright/test');
const config = require('../../../config');
const common = require('../../../common');

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1720, height: 1080 });
  await page.goto(config.config.portalUrl, { waitUntil: 'networkidle' });
});

test.describe('E2E test', () => {
  test('should login, create case and run different test cases for Data Reference', async ({ page }) => {
    await common.Login(config.config.apps.digv2.user.username, config.config.apps.digv2.user.password, page);

    /** Testing announcement banner presence */
    const announcementBanner = page.locator('#announcement-header');
    await expect(announcementBanner).toBeVisible({ timeout: 10000 });

    /** Testing worklist presence */
    const worklist = page.locator('#header-text');
    await expect(worklist).toBeVisible();

    const createServiceNav = page.locator('#create-nav');
    await createServiceNav.click();

    /** Creating a Complex Fields case-type */
    const complexFieldsCase = page.locator('button:has-text("Complex Fields")');
    await complexFieldsCase.click();

    /** Selecting DataReference from the Category dropdown */
    await page.selectOption('lion-select[datatestid="76729937a5eb6b0fd88c42581161facd"] select', 'DataReference');

    await page.locator('button:has-text("submit")').click();

    /** Display subcategory tests */

    /** Autocomplete display type test */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Display');

    await page.selectOption('lion-select[datatestid="6f64b45d01d11d8efd1693dfcb63b735"] select', 'Autocomplete');

    let selectedProduct = page.locator('lion-combobox');
    await selectedProduct.click();
    await page.locator('lion-option:has-text("Basic Product")').click();

    await page.locator('button:has-text("Next")').click();

    let assignment = page.locator('div[id="Assignment"]');

    /** Testing the values present on Confirm screen */
    await expect(assignment.locator('text-form[value="Basic Product"]')).toBeVisible();
    await expect(assignment.locator('currency-form >> lion-input-amount')).toBeVisible();
    await expect(await assignment.locator('currency-form >> lion-input-amount >> input').inputValue()).toBe('75.00');
    await expect(assignment.locator('text-form[value="9f2584c2-5cb4-4abe-a261-d68050ee0f66"]')).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    /** Dropdown display type tests */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Display');

    await page.selectOption('lion-select[datatestid="6f64b45d01d11d8efd1693dfcb63b735"] select', 'Dropdown');

    await page.locator('button:has-text("Next")').click();

    assignment = page.locator('div[id="Assignment"]');

    /** Testing the values present on Confirm screen */
    await expect(assignment.locator('text-form[value="Basic Product"]')).toBeVisible();
    await expect(assignment.locator('currency-form >> lion-input-amount')).toBeVisible();
    await expect(await assignment.locator('currency-form >> lion-input-amount >> input').inputValue()).toBe('75.00');
    await expect(assignment.locator('text-form[value="9f2584c2-5cb4-4abe-a261-d68050ee0f66"]')).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    /** Table display type tests */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Display');

    await page.selectOption('lion-select[datatestid="6f64b45d01d11d8efd1693dfcb63b735"] select', 'Table');

    selectedProduct = page.locator('vaadin-grid-cell-content[slot="vaadin-grid-cell-content-3"]');
    let selectedProductRow = selectedProduct.locator('input[type="radio"]');
    await selectedProductRow.click();

    await page.locator('button:has-text("Next")').click();

    assignment = page.locator('div[id="Assignment"]');

    /** Testing the values present on Confirm screen */
    await expect(assignment.locator('text-form[value="Luxury Product"]')).toBeVisible();
    await expect(assignment.locator('currency-form >> lion-input-amount')).toBeVisible();
    await expect(await assignment.locator('currency-form >> lion-input-amount >> input').inputValue()).toBe('200.00');
    await expect(assignment.locator('text-form[value="d63e2d8a-bd39-47b6-8dab-dce78a8bf91d"]')).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    /** Options subcategory tests */

    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Options');

    await page.selectOption('lion-select[datatestid="6f64b45d01d11d8efd1693dfcb63b735"] select', 'SingleRecord');

    selectedProduct = await page.locator('lion-combobox');
    selectedProduct.locator('div >> input').clear();
    await selectedProduct.click();
    await page.locator('lion-option:has-text("Basic Product")').click();

    await page.locator('button:has-text("Next")').click();

    assignment = page.locator('div[id="Assignment"]');

    /** Testing the values present on Confirm screen */
    await expect(assignment.locator('text-form[value="Basic Product"]')).toBeVisible();
    await expect(assignment.locator('currency-form >> lion-input-amount')).toBeVisible();
    await expect(await assignment.locator('currency-form >> lion-input-amount >> input').inputValue()).toBe('75.00');
    await expect(assignment.locator('text-form[value="9f2584c2-5cb4-4abe-a261-d68050ee0f66"]')).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    /** ListOfRecords options type test */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Options');

    await page.selectOption('lion-select[datatestid="6f64b45d01d11d8efd1693dfcb63b735"] select', 'ListOfRecords');

    selectedProduct = page.locator('vaadin-grid-cell-content[slot="vaadin-grid-cell-content-3"]');
    selectedProductRow = selectedProduct.locator('input[type="checkbox"]');
    await selectedProductRow.click();

    selectedProduct = page.locator('vaadin-grid-cell-content[slot="vaadin-grid-cell-content-7"]');
    selectedProductRow = selectedProduct.locator('input[type="checkbox"]');
    await selectedProductRow.click();

    await page.locator('button:has-text("Next")').click();

    assignment = page.locator('div[id="Assignment"]');

    /** Testing the values present on Confirm screen */
    await expect(assignment.locator('tr:has-text("Luxury Product")')).toBeVisible();
    await expect(assignment.locator('tr:has-text("Green Item")')).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    /** Mode subcategory tests */

    /** SingleSelect mode type test */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Mode');

    await page.selectOption('lion-select[datatestid="6f64b45d01d11d8efd1693dfcb63b735"] select', 'SingleSelect');

    selectedProduct = page.locator('lion-combobox');
    await selectedProduct.click();
    await page.locator('lion-option:has-text("Basic Product")').click();

    await page.locator('button:has-text("Next")').click();

    assignment = page.locator('div[id="Assignment"]');

    /** Testing the values present on Confirm screen */
    await expect(assignment.locator('text-form[value="Basic Product"]')).toBeVisible();
    await expect(assignment.locator('currency-form >> lion-input-amount')).toBeVisible();
    await expect(await assignment.locator('currency-form >> lion-input-amount >> input').inputValue()).toBe('75.00');
    await expect(assignment.locator('text-form[value="9f2584c2-5cb4-4abe-a261-d68050ee0f66"]')).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    /** MultiSelect mode type test */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Mode');

    await page.selectOption('lion-select[datatestid="6f64b45d01d11d8efd1693dfcb63b735"] select', 'MultiSelect');

    /** Checkbox group mode type test */
    await page.selectOption('lion-select[datatestid="4aa668349e0970901aa6b11528f95223"] select', 'Checkbox group');

    await page.check('lion-checkbox[datatestid="2ba95ff1-bce8-4e61-980e-151e1b0c00b4"] input');
    await page.check('lion-checkbox[datatestid="5817eb8c-b1c7-449b-b323-705ca25734b4"] input');

    await page.locator('button:has-text("Next")').click();

    await expect(assignment.locator('td:has-text("Washing Machine")')).toBeVisible();
    await expect(assignment.locator('td:has-text("Mobile")')).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    /** Readonly mode type test */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Mode');

    await page.selectOption('lion-select[datatestid="6f64b45d01d11d8efd1693dfcb63b735"] select', 'Readonly');

    selectedProduct = page.locator('div[id="semantic-link-grid"] >> div >> text="Basic Product"');
    await expect(selectedProduct).toBeVisible();

    await page.locator('button:has-text("Next")').click();

    assignment = page.locator('div[id="Assignment"]');

    /** Testing the values present on Confirm screen */
    await expect(assignment.locator('text-form[value="Basic Product"]')).toBeVisible();
    await expect(assignment.locator('currency-form >> lion-input-amount')).toBeVisible();
    await expect(await assignment.locator('currency-form >> lion-input-amount >> input').inputValue()).toBe('75.00');
    await expect(assignment.locator('text-form[value="9f2584c2-5cb4-4abe-a261-d68050ee0f66"]')).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    /** Sorting test */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Options');

    await page.selectOption('lion-select[datatestid="6f64b45d01d11d8efd1693dfcb63b735"] select', 'ListOfRecords');

    await page.locator('vaadin-grid-cell-content[slot="vaadin-grid-cell-content-23"] >> vaadin-grid-sorter').click();
    const tableCell = page.locator('vaadin-grid-cell-content[slot="vaadin-grid-cell-content-8"]');
    await expect(await tableCell.textContent()).toBe('---');

    // await productNameHeader.click();
    await page.locator('vaadin-grid-cell-content[slot="vaadin-grid-cell-content-23"] >> vaadin-grid-sorter').click();

    await expect(await tableCell.textContent()).toBe('Luxury Product');

    await page.locator('button:has-text("Next")').click();

    /** Submitting the case */
    await page.locator('button:has-text("submit")').click();
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
