const { test, expect } = require('@playwright/test');
const config = require('../../../config');
const common = require('../../../common');


test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1720, height: 1080 });
  await page.goto(config.config.portalUrl, { waitUntil: 'networkidle' });
});

test.describe('E2E test', () => {
  test('should login, create case and come back to Home landing page and run tests', async ({ page }) => {
    await common.Login(config.config.apps.digv2.user.username, config.config.apps.digv2.user.password, page);

    /** Testing announcement banner presence */
    const announcementBanner = page.locator('#announcement-header');
    await expect(announcementBanner).toBeVisible();

    /** Testing worklist presence */
    const worklist = page.locator('#header-text');
    await expect(worklist).toBeVisible();

    const createServiceNav = page.locator('#create-nav');
    await createServiceNav.click();

    /** Creating a View Templates case-type */
    const viewTemplatesCase = page.locator('button:has-text("View Templates")');
    await viewTemplatesCase.click();

    /** Click on the `Home` landing page */
    const homeLandingPage = page.locator('button > span:has-text("Home")');
    await homeLandingPage.click();

    /** Test whether Home has loaded as expected */
    await expect(announcementBanner).toBeVisible();

    await expect(worklist).toBeVisible();
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
