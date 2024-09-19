const { test, expect } = require('@playwright/test');
const config = require('../../../config');
const common = require('../../../common');

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1720, height: 1080 });
  await page.goto('http://localhost:3501/portal');
});

/** Added tests for spanish(Latin America) locale (es-XL) */
test.describe('E2E test', () => {
  test('should login, create case and test the localized values', async ({ page }) => {
    await common.Login(config.config.apps.digv2.localizedUser.username, config.config.apps.digv2.localizedUser.password, page);

    /** Testing announcement banner text */
    const announcementBanner = page.locator('h2[id="announcement-header"]:has-text("Anuncios")');
    await expect(announcementBanner).toBeVisible();

    /** Testing worklist title */
    const worklist = page.locator('div[id="header-text"]:has-text("Mi lista de trabajo")');
    await expect(worklist).toBeVisible();

    /** Testing landing pages */
    expect(await page.locator('button:has-text("Hogar")')).toBeVisible(); // Home
    expect(await page.locator('button:has-text("Panel de control en línea")')).toBeVisible(); // Inline Dashboard

    const createServiceNav = page.locator('#create-nav');
    await createServiceNav.click();

    /** Creating a Complex Fields case-type */
    const complexFieldsCase = page.locator('button:has-text("Campos complejos")');
    await complexFieldsCase.click();

    /** Testing Case summary */
    expect(await page.locator('div[id="case-name"]:has-text("Campos complejos")')).toBeVisible(); // case type

    expect(await page.locator('lion-button[id="edit"]:has-text("Editar")')).toBeVisible(); // edit action
    expect(await page.locator('lion-button[id="action-button"]:has-text("Comportamiento")')).toBeVisible(); // actions menu

    const caseSummary = await page.locator('div[id="CaseSummary"]');
    expect(caseSummary.locator('span:has-text("Nuevo")')).toBeVisible(); // case Status

    /** Testing Case history */
    const caseHistory = await page.locator('div[id="CaseHistory"]');
    await expect(caseHistory.locator('th >> text="Fecha"')).toBeVisible();
    await expect(caseHistory.locator('th >> text="Descripción"')).toBeVisible();
    await expect(caseHistory.locator('th >> text="Interpretado por"')).toBeVisible();

    /** Testing Case view */
    const stages = await page.locator('div[id="Stages"]');
    await expect(stages.locator('div >> text="Crear"')).toBeVisible();

    await expect(page.locator('h2:has-text("Seleccionar prueba")')).toBeVisible();
    // await expect(assignmentHeader.locator('span:has-text("Tarea en")')).toBeVisible();

    /** Testing action buttons */
    const assignment = await page.locator('div[id="Assignment"]');
    await expect(assignment.locator('button:has-text("Cancelar")')).toBeVisible();
    await expect(assignment.locator('button:has-text("Entregar")')).toBeVisible();

    /** Selecting Embedded Data from the Category dropdown */
    await page.selectOption('lion-select[datatestid="76729937a5eb6b0fd88c42581161facd"] select', 'EmbeddedData');

    await page.locator('button:has-text("Entregar")').click();

    /** Testing Multi step */
    await expect(assignment.locator('div >> text="Datos incrustados"')).toBeVisible();

    /** ListOfRecord options type test */
    await page.selectOption('lion-select[datatestid="c6be2b6191e6660291b6b0c92bd2f0df"] select', 'ListOfRecords');

    /** Table subcategory tests */
    await page.selectOption('lion-select[datatestid="9463d5f18a8924b3200b56efaad63bda"] select', 'Table');

    /** Editable mode type tests */
    await page.selectOption('lion-select[datatestid="6f64b45d01d11d8efd1693dfcb63b735"] select', 'Editable');

    await page.selectOption('lion-select[datatestid="80c1db3a7b228760228004b1a532c71e"] select', 'Table rows');

    await expect(assignment.locator('h3:has-text("Direcciones de envío")')).toBeVisible();

    /** Testing table headers */
    await expect(assignment.locator('th >> text="Calle"')).toBeVisible();
    await expect(assignment.locator('th >> text="Ciudad"')).toBeVisible();
    await expect(assignment.locator('th >> text="Estado"')).toBeVisible();
    await expect(assignment.locator('th >> text="Código Postal"')).toBeVisible();
    await expect(assignment.locator('th >> text="Número de teléfono"')).toBeVisible();

    /** Testing file utility */
    const fileUtility = await page.locator('div[id="file-utility"]');
    await expect(fileUtility.locator('div >> text="Archivos adjuntos"')).toBeVisible();
    await fileUtility.locator('lion-button[id="attachments-menu"]').click();

    await expect(fileUtility.locator('a:has-text("Agregar archivos")')).toBeVisible();
    await expect(fileUtility.locator('a:has-text("Añadir enlaces")')).toBeVisible();

    /** Testing Add files Modal */
    const attachmentDialog = await page.locator('div[id="attachment-dialog"]');

    await fileUtility.locator('a:has-text("Agregar archivos")').click();
    await expect(attachmentDialog.locator('h3:has-text("Agregar archivos locales")')).toBeVisible();
    await expect(attachmentDialog.locator('button:has-text("Cancelar")')).toBeVisible();
    await expect(attachmentDialog.locator('button:has-text("Adjuntar archivos")')).toBeVisible();

    attachmentDialog.locator('button:has-text("Cancelar")').click();
    await fileUtility.locator('lion-button[id="attachments-menu"]').click();

    /** Testing Add links Modal */
    const addLinksDialog = await page.locator('div[id="addLink-dialog"]');

    await fileUtility.locator('a:has-text("Añadir enlaces")').click();
    await expect(addLinksDialog.locator('h3:has-text("Añadir enlaces")')).toBeVisible();
    await expect(addLinksDialog.locator('div >> text="Añadir enlace"')).toBeVisible();

    await expect(addLinksDialog.locator('button:has-text("Cancelar")')).toBeVisible();
    await expect(addLinksDialog.locator('button:has-text("Adjuntar enlaces")')).toBeVisible();
    await addLinksDialog.locator('button:has-text("Cancelar")').click();

    await page.locator('button[id="operator"]').click();
    await page.locator('button:has-text("Desconectarse")').click();
  }, 10000);
});
