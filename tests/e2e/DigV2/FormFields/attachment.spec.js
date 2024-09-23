const { test, expect } = require('@playwright/test');
const path = require('path');
const config = require('../../../config');
const common = require('../../../common');

// These values represent the data values used for the conditions and are initialised in pyDefault DT
const isDisabled = true;

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1720, height: 1080 });
  await page.goto(config.config.portalUrl, { waitUntil: 'networkidle' });
});

test.describe('E2E test', () => {
  let attributes;
  test('should login, create case and run the Attachment tests', async ({ page }) => {
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

    /** Selecting Attachment from the Selected Category dropdown */
    await page.selectOption('lion-select[datatestid="76729937a5eb6b0fd88c42581161facd"] select', 'Attachment');

    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Required');

    const cableChatFilePath = path.join(__dirname, '../../../../assets/img/cablechat.png');
    // to do after multi attachment support and file size check
    // const cableInfoFilePath = path.join(__dirname, '../../../assets/img/cableinfo.png');
    // const zeroBytesFilePath = path.join(__dirname, '../../../assets/img/zerobytes');

    await page.setInputFiles('attachment-component:has-text("AttachmentRequired") >> input[type="file"]', cableChatFilePath);

    // no validation message shown
    // await page.locator('button:has-text("submit")').click();

    // await expect(page.locator('lion-validation-feedback[type="error"]')).toBeVisible();

    /** Selecting Disable from the Sub Category dropdown */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Disable');

    // /** Disable tests */
    const alwaysDisabledAttachment = page.locator('attachment-component:has-text("AttachmentDisabledAlways") >> lion-button');
    attributes = await common.getAttributes(alwaysDisabledAttachment);
    await expect(attributes.includes('disabled')).toBeTruthy();

    const conditionallyDisabledAttachment = page.locator('attachment-component:has-text("AttachmentDisabledCondition") >> lion-button');
    attributes = await common.getAttributes(conditionallyDisabledAttachment);
    if (isDisabled) {
      await expect(attributes.includes('disabled')).toBeTruthy();
    } else {
      await expect(attributes.includes('disabled')).toBeFalsy();
    }

    const neverDisabledAttachment = page.locator('attachment-component:has-text("AttachmentDisabledNever") >> lion-button');
    attributes = await common.getAttributes(neverDisabledAttachment);
    await expect(attributes.includes('disabled')).toBeFalsy();

    /** Testing Single mode attachments */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Single');

    const singleAttachment = page.locator('attachment-component:has-text("Attachment") >> nth=0');
    await expect(singleAttachment.locator('div[class="psdk-modal-file-selector"] >> lion-button:has-text("Upload file")')).toBeVisible();
    await page.setInputFiles('attachment-component:has-text("Attachment") >> nth=0 >> input[type="file"]', cableChatFilePath);
    await expect(singleAttachment.locator('div >> text="cablechat.png"')).toBeVisible();
    await expect(singleAttachment.locator('span:has-text("Upload file")')).toBeHidden();

    await singleAttachment.locator('lion-button').click();

    await expect(singleAttachment.locator('lion-button:has-text("Upload file")')).toBeVisible();
  }, 10000);
});

test.afterEach(async ({ page }) => {
  await page.close();
});
