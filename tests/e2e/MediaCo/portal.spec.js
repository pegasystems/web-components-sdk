const path = require('path');
const { test, expect } = require('@playwright/test');
const config = require('../../config');
const common = require('../../common');
const endpoints = require("../../../sdk-config.json");

let caseID;

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3501/portal');
});

test.describe('E2E test', () => {
  test('should login, create case and send for discount', async ({ page }) => {
    await common.Login(
      config.config.apps.mediaCo.rep.username,
      config.config.apps.mediaCo.rep.password,
      page
    );

    const announcementBanner = page.locator('#announcement-header');
    await expect(announcementBanner).toBeVisible({timeout: 10000 });

    const worklist = page.locator('#header-text');
    await expect(worklist).toBeVisible();

    const createServiceNav = page.locator("#create-nav");
    await createServiceNav.click();

    const newServiceCase = page.locator('button:has-text("New Service")');
    await newServiceCase.click();

    caseID = await page.locator('#caseId').textContent();

    // New Customer Page
    await page.fill('lion-input[datatestid="BC910F8BDF70F29374F496F05BE0330C"] input', 'John');
    await page.fill('lion-input[datatestid="D3691D297D95C48EF1A2B7D6523EF3F0"] input', '');
    await page.fill('lion-input[datatestid="77587239BF4C54EA493C7033E1DBF636"] input', 'Doe');

    // selecting value from lion-combobox form field
    await page.locator('lion-combobox[datatestid="56E6DDD1CB6CEC596B433440DFB21C17"] input').click();
    const lionOptions = page.locator('lion-options');
    await lionOptions.locator('lion-option:has-text("Jr")').click();
    await page.locator('body').click(); //clicking outside to dismiss combobox

    await page.fill('lion-input-email[datatestid="CE8AE9DA5B7CD6C3DF2929543A9AF92D"] input', 'john@doe.com');
    const futureDate = common.getNextDay();
    await page.type('lion-input-dateonly[datatestid="E0BA356AE552ACD4326D51E61F4279AC"] input', futureDate);
    await page.locator('button:has-text("Submit")').click();

    // Address Page
    await page.fill('lion-input[datatestid="D61EBDD8A0C0CD57C22455E9F0918C65"] input', 'Main St');
    await page.fill('lion-input[datatestid="57D056ED0984166336B7879C2AF3657F"] input', 'Cambridge');
    await page.selectOption('lion-select[datatestid="46A2A41CC6E552044816A2D04634545D"] select', "MA");
    await page.fill('lion-input[datatestid="572ED696F21038E6CC6C86BB272A3222"] input', '02142');
    await page.fill('lion-input[datatestid="1F8261D17452A959E013666C5DF45E07"] input', '6175551212', {timeout: 2000});
    await page.locator('button:has-text("Submit")').click();

    // Service Page
    await page.check('lion-checkbox[datatestid="0B3244CEB2CE9879260EB560BD7A811E"] input');
    await page.locator('lion-radio input[value="Premium"]')
    await page.check('lion-checkbox[datatestid="C05A1E5DECC321D9792E9A9E15184BE5"] input');
    await page.locator('lion-radio input[value="300 Mbps"]');
    await page.check('lion-checkbox[datatestid="7CF3F86883596E49D8D7298CC5B928A2"] input');
    await page.locator('lion-radio input[value="International Full"]');
    await page.locator('button:has-text("Submit")').click();

    // Other Notes Page
    await page.fill('lion-textarea[datatestid="F4C6F851B00D5518BF888815DE279ABA"] textarea', 'Thanks for the service!');
    await page.check('lion-checkbox[datatestid="C3B43E79AEC2D689F0CF97BD6AFB7DC4"] input');

    const currentCaseID = await page.locator('div[id="current-caseID"]').textContent();
    const filePath = path.join(__dirname, '../../../assets/img/cableinfo.png');
    await page.setInputFiles('#upload-input', filePath);

    await Promise.all([
      page.waitForResponse(`${endpoints.serverConfig.infinityRestServerUrl}/api/application/v2/attachments/upload`)
    ]);

    await page.locator('button:has-text("submit")').click();

    await Promise.all([
      page.waitForResponse(`${endpoints.serverConfig.infinityRestServerUrl}/api/application/v2/cases/${currentCaseID}/attachments`),
    ]);

    const attachmentCount = await page.locator('div[id="attachments-count"]').textContent();
    await expect(Number(attachmentCount)).toBeGreaterThan(0);

    await page
      .locator('text=Thank you! The next step in this case has been routed appropriately.')
      .click();
  }, 10000);

  test('should enter a discount value($) and send to tech', async ({ page }) => {
    await common.Login(
      config.config.apps.mediaCo.manager.username,
      config.config.apps.mediaCo.manager.password,
      page
    );

    const announcementBanner = page.locator('#announcement-header');
    await expect(announcementBanner).toBeVisible({timeout: 10000 });

    const worklist = page.locator('#header-text');
    await expect(worklist).toBeVisible();

    const caseButton = page.locator(`span:has-text('${caseID}')`);
    await caseButton.click();

    await page.fill('lion-input-amount[datatestid="D69ECA63310344EDB0D0F9881CF9B662"] input', '20');
    await page.locator('button:has-text("submit")').click();

    await page
      .locator('text=Thank you! The next step in this case has been routed appropriately.')
      .click();
  }, 10000);

  test('should modify(if required) the actual services/packages to be installed and resolve the case', async ({
    page
  }) => {
    await common.Login(
      config.config.apps.mediaCo.tech.username,
      config.config.apps.mediaCo.tech.password,
      page
    );

    const announcementBanner = page.locator('#announcement-header');
    await expect(announcementBanner).toBeVisible({timeout: 10000 });

    const worklist = page.locator('#header-text');
    await expect(worklist).toBeVisible();

    const caseButton = page.locator(`span:has-text('${caseID}')`);
    await caseButton.click();

    await page.check('lion-checkbox[datatestid="EEF2AA5E42FD9F0FB0A44EA0B2D52921"] input');
    await page.check('lion-checkbox[datatestid="C43FA5D99B9290C0885E058F641CAB8D"] input');

    await page.locator('button:has-text("submit")').click();

    await page.locator('text=RESOLVED-COMPLETED').click();
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});