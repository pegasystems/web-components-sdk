/* eslint-disable no-nested-ternary */
import { LitElement, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { BridgeBase } from "../../../bridge/BridgeBase/index";
// NOTE: you need to import ANY component you may render.
import "../PromotedFilters";
import { Utils } from "../../../helpers/utils";
import { buildFieldsForTable } from "./helpers";
import { FieldGroupUtils } from "../../../helpers/field-group-utils";

// import the component's styles as HTML with <style>
import { simpleTableManualStyles } from "./simple-table-manual-styles";

// Declare that PCore will be defined when this code is run
declare var PCore: any;

@customElement("simple-table-manual")
class SimpleTableManual extends BridgeBase {
  @property({ attribute: false, type: Boolean }) visible = true;
  @property({ attribute: false, type: String }) label = "";
  @property({ attribute: false, type: Boolean }) readOnlyMode = false;
  @property({ attribute: false, type: Boolean }) editableMode = false;
  @property({ attribute: false, type: Array }) rowData = [];
  @property({ attribute: false, type: Array }) elementsData = [];
  @property({ attribute: false, type: Array }) referenceList = [];
  @property({ attribute: false, type: Object }) configProps: any = {};
  menuIconOverride = "";
  contextClass: any;
  rawFields: Array<any> = [];
  pageReference = "";
  requestedReadOnlyMode = false;
  showAddRowButton = false;
  fieldDefs: Array<any> = [];
  displayedColumns: Array<any> = [];
  processedFields: Array<any> = [];
  prevRefLength: number | undefined;

  constructor() {
    //  Note: BridgeBase constructor has 2 optional args:
    //  1st: inDebug - sets this.bLogging: false if not provided
    //  2nd: inLogging - sets this.bLogging: false if not provided.
    //  To get started, we set Debug to false and Logging to true here. Set to your preferred value during development.
    super(false, false);
    if (this.bLogging) {
      console.log(`${this.theComponentName}: constructor`);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.bLogging) {
      console.log(`${this.theComponentName}: connectedCallback`);
    }

    // setup this component's styling...
    this.theComponentStyleTemplate = simpleTableManualStyles;

    //NOTE: Need to bind the callback to 'this' so it has this element's context when it's called.
    this.registerAndSubscribeComponent(this.onStateChange.bind(this));

    this.menuIconOverride = Utils.getImageSrc(
      "trash",
      Utils.getSDKStaticContentUrl(),
    );
  }

  /**
   * The `onStateChange()` method will be called when the state is updated.
   *  Override this method in each class that extends BridgeBase.
   *  This implementation can be used for common code that should be done for
   *  all components that are derived from BridgeBase
   */
  onStateChange() {
    if (this.bLogging) {
      console.log(`${this.theComponentName}: onStateChange`);
    }

    const bShouldUpdate = super.shouldComponentUpdate();

    if (bShouldUpdate) {
      this.updateSelf();
    }
  }

  /**
   * updateSelf
   */
  updateSelf() {
    if (this.bLogging) {
      console.log(`${this.theComponentName}: updateSelf`);
    }

    this.configProps = this.thePConn.getConfigProps();
    if (this.configProps["visibility"] != null) {
      this.visible = Utils.getBooleanValue(this.configProps["visibility"]);
    }

    // NOTE: getConfigProps() has each child.config with datasource and value undefined
    //  but getRawMetadata() has each child.config with datasource and value showing their unresolved values (ex: "@P thePropName")
    //  We need to use the prop name as the "glue" to tie the Angular Material table dataSource, displayColumns and data together.
    //  So, in the code below, we'll use the unresolved config.value (but replacing the space with an underscore to keep things happy)
    const rawMetadata = this.thePConn.getRawMetadata();

    // Adapted from Nebula
    const {
      referenceList = [], // if referenceList not in configProps$, default to empy list
      renderMode,
      children, // destructure children into an array var: "resolvedFields"
      presets,
      allowTableEdit,
      label: labelProp,
      propertyLabel,
    } = this.configProps;

    this.label = labelProp || propertyLabel;

    const hideAddRow = allowTableEdit === false ? true : false;
    const hideDeleteRow = allowTableEdit === false ? true : false;

    let { contextClass } = this.configProps;
    this.referenceList = referenceList;
    if (!contextClass) {
      let listName = this.thePConn.getComponentConfig().referenceList;
      listName = PCore.getAnnotationUtils().getPropertyName(listName);
      contextClass = this.thePConn.getFieldMetadata(listName)?.pageClass;
    }
    this.contextClass = contextClass;

    const resolvedFields =
      children?.[0]?.children || presets?.[0].children?.[0].children;
    // get raw config as @P and other annotations are processed and don't appear in the resolved config.
    //  Destructure "raw" children into array var: "rawFields"
    //  NOTE: when config.listType == "associated", the property can be found in either
    //    config.value (ex: "@P .DeclarantChoice") or
    //    config.datasource (ex: "@ASSOCIATED .DeclarantChoice")
    //  Neither of these appear in the resolved (this.configProps)
    const rawConfig = rawMetadata?.config;
    const rawFields =
      rawConfig?.children?.[0]?.children ||
      rawConfig?.presets?.[0].children?.[0]?.children;
    this.rawFields = rawFields;
    // At this point, fields has resolvedFields and rawFields we can use

    // start of from Nebula
    // get context name and referenceList which will be used to prepare config of PConnect
    // const { contextName, referenceListStr, pageReferenceForRows } = getContext(this.thePConn);

    const resolvedList = FieldGroupUtils.getReferenceList(this.thePConn);
    this.pageReference = `${this.thePConn.getPageReference()}${resolvedList}`;
    this.thePConn.setReferenceList(resolvedList);

    // This gives up the "properties" we need to map to row/column values later
    // const processedData = populateRowKey(referenceList);

    this.requestedReadOnlyMode = renderMode === "ReadOnly";
    this.readOnlyMode = renderMode === "ReadOnly";
    this.editableMode = renderMode === "Editable";
    this.showAddRowButton = !this.readOnlyMode && !hideAddRow;
    const showDeleteButton = !this.readOnlyMode && !hideDeleteRow;

    // Nebula has other handling for isReadOnlyMode but has Cosmos-specific code
    //  so ignoring that for now...
    // fieldDefs will be an array where each entry will have a "name" which will be the
    //  "resolved" property name (that we can use as the colId) though it's not really
    //  resolved. The buildFieldsForTable helper just removes the "@P " (which is what
    //  Nebula does). It will also have the "label", and "meta" contains the original,
    //  unchanged config info. For now, much of the info here is carried over from
    //  Nebula and we may not end up using it all.
    this.fieldDefs = buildFieldsForTable(
      rawFields,
      resolvedFields,
      showDeleteButton,
    );

    // end of from Nebula

    // Here, we use the "name" field in fieldDefs since that has the assoicated property
    //  (if one exists for the field). If no "name", use "cellRenderer" (typically get DELETE_ICON)
    //  for our columns.
    this.displayedColumns = this.fieldDefs?.map((field: any) => {
      return field.name ? field.name : field.cellRenderer;
    });

    // And now we can process the resolvedFields to add in the "name"
    //  from from the fieldDefs. This "name" is the value that
    //  we'll share to connect things together in the table.

    this.processedFields = [];

    this.processedFields = resolvedFields.map((field, i) => {
      field.config["name"] = this.displayedColumns[i]; // .config["value"].replace(/ ./g,"_");   // replace space dot with underscore
      return field;
    });

    if (this.prevRefLength !== this.referenceList?.length) {
      if (this.editableMode) {
        this.buildElementsForTable();
      } else {
        this.generateRowsData();
      }
    }

    this.prevRefLength = this.referenceList?.length;

    // These are the data structures referred to in the html file.
    //  These are the relationships that make the table work
    //  displayedColumns: key/value pairs where key is order of column and
    //    value is the property shown in that column. Ex: 1: "FirstName"
    //  processedFields: key/value pairs where each key is order of column
    //    and each value is an object of more detailed information about that
    //    column.
    //  rowData: array of each row's key/value pairs. Inside each row,
    //    each key is an entry in displayedColumns: ex: "FirstName": "Charles"
    //    Ex: { 1: {config: {label: "First Name", readOnly: true: name: "FirstName"}}, type: "TextInput" }
    //    The "type" indicates the type of component that should be used for editing (when editing is enabled)
    //
    //  Note that the "property" shown in the column ("FirstName" in the above examples) is what
    //  ties the 3 data structures together.
  }

  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();
    if (this.bLogging) {
      console.log(`${this.theComponentName}: disconnectedCallback`);
    }
  }

  // return the value that should be shown as the contents for the given row data
  //  of the given row field
  getRowValue(inRowData: Object, inColKey: string): any {
    // See what data (if any) we have to display
    const refKeys: Array<string> = inColKey.split(".");
    let valBuilder = inRowData;
    for (var key of refKeys) {
      valBuilder = valBuilder[key];
    }
    return valBuilder;
  }

  generateRowsData() {
    const { dataPageName, referenceList } = this.configProps;
    const context = this.thePConn.getContextName();
    // if dataPageName property value exists then make a datapage fetch call and get the list of data.
    if (dataPageName) {
      PCore.getDataApiUtils()
        .getData(dataPageName, null, context)
        .then((response) => {
          const data = this.formatRowsData(response.data.data);
          this.rowData = data;
        });
    } else {
      // The referenceList prop has the JSON data for each row to be displayed
      //  in the table. So, iterate over referenceList to create the dataRows that
      //  we're using as the table's dataSource
      const data = this.formatRowsData(referenceList);
      this.rowData = data;
    }
  }

  formatRowsData(data) {
    return data?.map((item) => {
      return this.displayedColumns.reduce((dataForRow: any, colKey) => {
        dataForRow[colKey] = this.getRowValue(item, colKey);
        return dataForRow;
      }, {});
    });
  }

  buildElementsForTable() {
    const context = this.thePConn.getContextName();
    const eleData: any = [];
    this.referenceList.forEach((element, index) => {
      const data: any = [];
      this.rawFields?.forEach((item) => {
        // removing label field from config to hide title in the table cell
        item = { ...item, config: { ...item.config, label: "" } };
        const referenceListData = FieldGroupUtils.getReferenceList(
          this.thePConn,
        );
        const isDatapage = referenceListData.startsWith("D_");
        const pageReferenceValue = isDatapage
          ? `${referenceListData}[${index}]`
          : `${this.thePConn.getPageReference()}${referenceListData.substring(referenceListData.lastIndexOf("."))}[${index}]`;
        const config = {
          meta: item,
          options: {
            context,
            pageReference: pageReferenceValue,
            referenceList: referenceListData,
            hasForm: true,
          },
        };
        const view = PCore.createPConnect(config);
        data.push(view);
      });
      eleData.push(data);
    });
    this.elementsData = eleData;
  }

  getReadOnlyTable() {
    const theColumnHeaders = html`
      <thead class="thead-light">
        <tr>
          ${this.displayedColumns.map((label) => {
            return html`<th scope="col">${label}</th>`;
          })}
        </tr>
      </thead>
    `;

    const theDataRows = html`<tbody>
      ${this.rowData.map(
        (row) =>
          html`<tr scope="row">
            ${this.displayedColumns.map((colKey) => {
              return html`<td>
                ${typeof row[colKey] === "boolean" && !row[colKey]
                  ? "False"
                  : typeof row[colKey] === "boolean" && row[colKey]
                    ? "True"
                    : row[colKey]}
              </td>`;
            })}
          </tr>`,
      )}
    </tbody>`;

    return html`<table class="table table-bordered">
      ${theColumnHeaders} ${theDataRows}
    </table>`;
  }

  getEditableTable() {
    const theColumnHeaders = html`
      <thead class="thead-light">
        <tr>
          ${this.displayedColumns.map((label) => {
            return html`<th scope="col">${label}</th>`;
          })}
        </tr>
      </thead>
    `;

    const theDataRows = html`<tbody>
      ${this.elementsData.map(
        (row: any, index: number) =>
          html`<tr scope="row">
            ${row.map(
              (config) => html`
                <td>${BridgeBase.getComponentFromConfigObj(config)}</td>
              `,
            )}
            <td>
              <button
                type="button"
                id="delete-button"
                class="psdk-utility-button"
                @click=${() => this.deleteRecord(index)}
              >
                <img
                  class="psdk-utility-card-action-svg-icon"
                  src=${this.menuIconOverride}
                />
              </button>
            </td>
          </tr>`,
      )}
    </tbody>`;

    return html`<table class="table table-bordered">
      ${theColumnHeaders} ${theDataRows}
    </table>`;
  }

  addRecord() {
    if (PCore.getPCoreVersion()?.includes("8.7")) {
      this.thePConn
        .getListActions()
        .insert(
          { classID: this.contextClass },
          this.referenceList.length,
          this.pageReference,
        );
    } else {
      this.thePConn
        .getListActions()
        .insert({ classID: this.contextClass }, this.referenceList.length);
    }
  }

  deleteRecord(index) {
    if (PCore.getPCoreVersion()?.includes("8.7")) {
      this.thePConn.getListActions().deleteEntry(index, this.pageReference);
    } else {
      this.thePConn.getListActions().deleteEntry(index);
    }
  }

  results() {
    const len = this.editableMode
      ? this.elementsData?.length
      : this.rowData?.length;

    return len
      ? html` <span class="results-count">
          ${len} result${len > 1 ? "s" : ""}
        </span>`
      : null;
  }

  render() {
    if (!this.visible) return null;

    // To prevent accumulation (and extra rendering) of previous renders, begin each the render
    //  of any component that's a child of BridgeBase with a call to this.prepareForRender();
    this.prepareForRender();

    const theOuterTemplate = html`
      <div class="simple-table-wrapper">
        ${this.label
          ? html`<h3 class="label">${this.label} ${this.results()}</h3>`
          : null}
        ${this.readOnlyMode ? this.getReadOnlyTable() : null}
        ${this.editableMode ? this.getEditableTable() : null}
        ${this.editableMode && this.referenceList?.length === 0
          ? html`<div class="psdk-no-records" id="no-records">
              No Records Found.
            </div>`
          : null}
        ${this.readOnlyMode && this.rowData?.length === 0
          ? html`<div class="psdk-no-records" id="no-records">
              No Records Found.
            </div>`
          : null}
      </div>
      ${this.showAddRowButton
        ? html`<button
            style="font-size: 16px;"
            class="btn btn-link"
            @click=${this.addRecord}
          >
            + Add
          </button>`
        : null}
    `;

    this.renderTemplates.push(theOuterTemplate);

    return this.renderTemplates;
  }
}

export default SimpleTableManual;
