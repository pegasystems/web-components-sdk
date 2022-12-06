/* eslint-disable no-template-curly-in-string */
/* eslint-disable no-undef */

/** We're testing the visibility of tabs within the Case Summary area in the Case View here, more tests to be added in the future. */

const { test, expect } = require("@playwright/test");
const config = require("../../config");
const common = require("../../common");

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto("http://localhost:3501/portal");
});

test.describe("E2E test", () => {
  test("should login, create case and run different test cases for Data Reference", async ({ page }) => {
    await common.Login(config.config.apps.digv2.user.username, config.config.apps.digv2.user.password, page);

    /** Testing announcement banner presence */
    const announcementBanner = page.locator("#announcement-header");
    await expect(announcementBanner).toBeVisible({ timeout: 10000 });

    /** Testing worklist presence */
    const worklist = page.locator("#header-text");
    await expect(worklist).toBeVisible();

    const createServiceNav = page.locator("#create-nav");
    await createServiceNav.click();

    /** Creating a Complex Fields case-type */
    const complexFieldsCase = page.locator('button:has-text("Complex Fields")');
    await complexFieldsCase.click();

    /** Selecting Embedded Data from the Category dropdown */
    await page.selectOption('lion-select[datatestid="76729937a5eb6b0fd88c42581161facd"] select', "EmbeddedData");

    await page.locator('button:has-text("submit")').click();

    /** Option tests */

    /** SingleRecord options type test */
    await page.selectOption('lion-select[datatestid="c6be2b6191e6660291b6b0c92bd2f0df"] select', "SingleRecord");

    /** Mode subcategory tests */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', "Mode");

    /** Editable mode type tests */
    await page.selectOption('lion-select[datatestid="6f64b45d01d11d8efd1693dfcb63b735"] select', "Editable");

    await page.locator('lion-input[datatestid="d61ebdd8a0c0cd57c22455e9f0918c65"] input').type("Main St");
    await page.locator('lion-input[datatestid="57d056ed0984166336b7879c2af3657f"] input').type("Cambridge");
    await page.locator('lion-input[datatestid="46a2a41cc6e552044816a2d04634545d"] input').type("MA");
    await page.locator('lion-input[datatestid="25f75488c91cb6c3bab92672e479619f"] input').type("02142");

    await page.locator('button:has-text("Next")').click();

    const assignment = page.locator("assignment-component");

    /** Testing the values present on Confirm screen */
    await expect(assignment.locator('text-form[value="Cambridge"]')).toBeVisible();
    await expect(assignment.locator('text-form[value="Main St"]')).toBeVisible();
    await expect(assignment.locator('text-form[value="MA"]')).toBeVisible();
    await expect(assignment.locator('text-form[value="02142"]')).toBeVisible();

    await page.locator('button:has-text("Previous")').click();

    /** Readonly mode type tests */
    await page.selectOption('lion-select[datatestid="6f64b45d01d11d8efd1693dfcb63b735"] select', "Readonly");

    /** Testing the existence of 'readonly' attribute on the fields and the values which were entered by Editable mode test */
    const street = page.locator('lion-input[datatestid="d61ebdd8a0c0cd57c22455e9f0918c65"] input');
    let attributes = await common.getAttributes(street);
    expect(attributes.includes("readonly") && (await street.inputValue()) === "Main St").toBeTruthy();

    const city = page.locator('lion-input[datatestid="57d056ed0984166336b7879c2af3657f"] input');
    attributes = await common.getAttributes(city);
    expect(attributes.includes("readonly") && (await city.inputValue()) === "Cambridge").toBeTruthy();

    const state = page.locator('lion-input[datatestid="46a2a41cc6e552044816a2d04634545d"] input');
    attributes = await common.getAttributes(state);
    expect(attributes.includes("readonly") && (await state.inputValue()) === "MA").toBeTruthy();

    const postalCode = page.locator('lion-input[datatestid="25f75488c91cb6c3bab92672e479619f"] input');
    attributes = await common.getAttributes(postalCode);
    expect(attributes.includes("readonly") && (await postalCode.inputValue()) === "02142").toBeTruthy();

    await page.locator('button:has-text("Next")').click();

    await page.locator('button:has-text("previous")').click();
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
