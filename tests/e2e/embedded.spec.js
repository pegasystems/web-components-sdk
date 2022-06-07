/* eslint-disable no-undef */

const { test } = require('@playwright/test');
const common = require('../common');

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('http://localhost:3501/embedded');
});

test.describe('E2E test', () => {
  test('should launch, select a service plan and fill details', async ({ page }) => {
    const silverPlan = page.locator('button:has-text("shop now") >> nth=1');
    await silverPlan.click();

    await page.fill('lion-input[datatestid="BC910F8BDF70F29374F496F05BE0330C"] input', 'John');
    await page.fill('lion-input[datatestid="D3691D297D95C48EF1A2B7D6523EF3F0"] input', '');
    await page.fill('lion-input[datatestid="77587239BF4C54EA493C7033E1DBF636"] input', 'Doe');

    // selecting value from lion-combobox form field
    await page.locator('lion-combobox[datatestid="56E6DDD1CB6CEC596B433440DFB21C17"] input').click();
    const lionOptions = page.locator('lion-options');
    await lionOptions.locator('lion-option:has-text("Jr")').click();
    await page.locator('body').click(); //clicking outside to dismiss combobox

    await page.fill('lion-input-email[datatestid="CE8AE9DA5B7CD6C3DF2929543A9AF92D"] input', 'john@doe.com');

    await page.locator('button:has-text("next")').click();


    await page.fill('lion-input[datatestid="D61EBDD8A0C0CD57C22455E9F0918C65"] input', 'Main St');

    await page.locator('button:has-text("previous")').click();

    await page.locator('h2:has-text("Customer Info")').click();

    await page.locator('button:has-text("next")').click();

    await page.locator('h2:has-text("Customer Address")').click();

    await page.fill('lion-input[datatestid="57D056ED0984166336B7879C2AF3657F"] input', 'Cambridge');
    await page.selectOption('lion-select[datatestid="46A2A41CC6E552044816A2D04634545D"] select', "MA");
    await page.fill('lion-input[datatestid="572ED696F21038E6CC6C86BB272A3222"] input', '02142');
    await page.fill('lion-input[datatestid="1F8261D17452A959E013666C5DF45E07"] input', '6175551212');

    await page.locator('button:has-text("next")').click();

    await page.locator('h2:has-text("Service Date")').click();

    const futureDate = common.getNextDay();
    await page.type('lion-input-dateonly[datatestid="1321FA74451B96BC02663B0EF96CCBB9"] input', futureDate);

    await page.locator('button:has-text("next")').click();

    await page.locator('button:has-text("submit")').click();

    await page.locator('text=Thanks for selecting a package with us.').click();
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});