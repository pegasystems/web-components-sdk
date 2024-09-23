const { test, expect } = require('@playwright/test');
const config = require('../../../config');
const common = require('../../../common');

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1720, height: 1080 });
  await page.goto(config.config.portalUrl, { waitUntil: 'networkidle' });
});

test.describe('E2E test', () => {
  test('should login, create case and run different test cases for Case Reference', async ({ page }) => {
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
    let complexFieldsCase = page.locator('button:has-text("Query")');
    await complexFieldsCase.click();

    let modal = page.locator('div[id="dialog"]');

    /** Value to be typed in the Name input */
    const name = 'John Doe';

    await modal.locator('lion-input input').type(name);
    await modal.locator('button:has-text("submit")').click();

    // /** Storing case-id of the newly created Query case-type(s), will be used later */
    const caseID = [];
    caseID.push(await page.locator('div[id="caseId"]').textContent());

    /** Creating another Query case-type which will be used for ListOfRecords mode */
    complexFieldsCase = page.locator('button:has-text("Query")');
    await complexFieldsCase.click();

    modal = page.locator('div[id="dialog"]');

    await modal.locator('lion-input input').type(name);
    await modal.locator('button:has-text("submit")').click();

    /** Wait until modal closes */
    await expect(modal).not.toBeVisible();

    caseID.push(await page.locator('div[id="caseId"]').textContent());

    /** Creating a Complex Fields case-type */
    complexFieldsCase = page.locator('button:has-text("Complex Fields")');
    await complexFieldsCase.click();

    /** Selecting CaseReference from the Category dropdown */
    await page.selectOption('lion-select[datatestid="76729937a5eb6b0fd88c42581161facd"] select', 'CaseReference');

    await page.locator('button:has-text("submit")').click();

    /** Field sub category tests */

    await page.selectOption('lion-select[datatestid="c2adefb64c594c6b634b3be9a40f6c83"] select', 'Field');

    /** Dropdown-Local field type tests */
    await page.selectOption('lion-select[datatestid="3e9562266329f358c8fad0ce1094def9"] select', 'Dropdown-Local');

    await page.selectOption('lion-select[datatestid="83b6f3f7c774ee2157bfd81b548b07bf"] select', 'Coffee');

    await page.locator('button:has-text("Next")').click();

    await expect(page.locator('text-form[value="Coffee"]')).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    /** Text field type tests */
    await page.selectOption('lion-select[datatestid="3e9562266329f358c8fad0ce1094def9"] select', 'Text');

    await page.locator('select >> nth=-1').selectOption({ index: 1 });

    await page.locator('button:has-text("Next")').click();

    await page.locator('button:has-text("Previous")').click();

    /** Dropdown-DP field type tests */
    await page.selectOption('lion-select[datatestid="3e9562266329f358c8fad0ce1094def9"] select', 'Dropdown-DP');

    await page.selectOption('lion-select[datatestid="311f2f128456b3bf37c7568da9ac1898"] select', 'Dropdown');

    await page.locator('button:has-text("Next")').click();

    await expect(page.locator('text-form[value="Dropdown"]')).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    /** Mode tests */
    await page.selectOption('lion-select[datatestid="c2adefb64c594c6b634b3be9a40f6c83"] select', 'Mode');

    /** SingleRecord mode type tests */
    await page.selectOption('lion-select[datatestid="3e9562266329f358c8fad0ce1094def9"] select', 'SingleRecord');

    const selectedRow = await page.locator(`vaadin-grid-cell-content:has-text("${caseID[0]}")`);
    let value = await selectedRow.getAttribute('slot');
    let tr = await page.locator('tr', { has: page.locator(`slot[name=${value}]`) });
    let text = tr.locator('td >> nth=0');
    let slot = text.locator('slot');
    let nameValue = await slot.getAttribute('name');
    let selectedProduct = page.locator(`vaadin-grid-cell-content[slot=${nameValue}]`);
    let selectedProductRow = selectedProduct.locator('input[type="radio"]');
    await selectedProductRow.click();

    await page.locator('button:has-text("Next")').click();

    selectedProduct = page.locator(`div[id="semantic-link-grid"] >> div >> text=${caseID[0]}`);
    await expect(selectedProduct).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    /** ListOfRecords mode type tests */
    await page.selectOption('lion-select[datatestid="3e9562266329f358c8fad0ce1094def9"] select', 'ListOfRecords');

    const selectedRow1 = await page.locator(`vaadin-grid-cell-content:has-text("${caseID[0]}")`);
    value = await selectedRow1.getAttribute('slot');
    tr = await page.locator('tr', { has: page.locator(`slot[name=${value}]`) });
    text = tr.locator('td >> nth=0');
    slot = text.locator('slot');
    nameValue = await slot.getAttribute('name');
    selectedProduct = page.locator(`vaadin-grid-cell-content[slot=${nameValue}]`);
    selectedProductRow = selectedProduct.locator('input[type="checkbox"]');
    await selectedProductRow.click();

    const selectedRow2 = await page.locator(`vaadin-grid-cell-content:has-text("${caseID[1]}")`);
    value = await selectedRow2.getAttribute('slot');
    tr = await page.locator('tr', { has: page.locator(`slot[name=${value}]`) });
    text = tr.locator('td >> nth=0');
    slot = text.locator('slot');
    nameValue = await slot.getAttribute('name');
    selectedProduct = page.locator(`vaadin-grid-cell-content[slot=${nameValue}]`);
    selectedProductRow = selectedProduct.locator('input[type="checkbox"]');
    await selectedProductRow.click();

    await page.locator('button:has-text("Next")').click();

    await expect(page.locator(`td >> text="${caseID[0]}"`)).toBeVisible();
    await expect(page.locator(`td >> text="${caseID[1]}"`)).toBeVisible();

    /** Submitting the case */
    await page.locator('button:has-text("submit")').click();
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
