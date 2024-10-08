/* eslint-disable no-undef */

/** We're testing the visibility of tabs within the Case Summary area in the Case View here, more tests to be added in the future. */

const { test, expect } = require('@playwright/test');
const config = require('../../../config');
const common = require('../../../common');

// These values represent the visibility(as authored in the app) of the tabs
const detailsTabVisible = false;
const caseHistoryTabVisible = true;

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1720, height: 1080 });
  await page.goto(config.config.portalUrl, { waitUntil: 'networkidle' });
});

test.describe('E2E test', () => {
  test('should login, create case and run different test cases for Case View', async ({ page }) => {
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

    /** Wait until newly created case loads */
    await expect(page.locator('div[id="case-view"]')).toBeVisible();

    /** Getting the handle of tabs from the DOM */
    const detailsTab = page.locator('button >> span:has-text("Details")');
    const caseHistoryTab = page.locator('button >> span:has-text("Case History")');

    /** Visibility of both(basically more than one) tabs should be set to true in order for them to be displayed otherwise
     *  they won't be displayed and that is what we're testing here. */
    if (detailsTabVisible && caseHistoryTabVisible) {
      await expect(detailsTab).toBeVisible();
      await expect(caseHistoryTab).toBeVisible();
    } else {
      await expect(detailsTab).toBeHidden();
      await expect(caseHistoryTab).toBeHidden();
    }

    /** Submitting the case */
    await page.locator('button:has-text("submit")').click();
  }, 10000);
  test('should login, create case and run test cases for Cancel action on the Assignment', async ({ page }) => {
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

    /** Wait until newly created case loads */
    await expect(page.locator('lion-select[datatestid="76729937a5eb6b0fd88c42581161facd"]')).toBeVisible();

    await page.locator('button:has-text("Cancel")').click();

    await page.locator('button:has-text("Go")').click();

    await expect(page.locator('lion-select[datatestid="76729937a5eb6b0fd88c42581161facd"]')).toBeVisible();

    /** Submitting the case */
    await page.locator('button:has-text("submit")').click();
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
