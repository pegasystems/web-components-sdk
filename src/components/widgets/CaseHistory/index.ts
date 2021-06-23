import { html, customElement, property, nothing } from '@lion/core';
import { BridgeBase } from '../../../bridge/BridgeBase';
import { Utils } from '../../../helpers/utils';

// NOTE: you need to import ANY component you may render.
import '../../designSystemExtension/ProgressIndicator';

// import the component's styles as HTML with <style>


// Declare that PCore will be defined when this code is run
declare var PCore: any;

// NOTE: this is just a boilerplate component definition intended
//  to be used as a starting point for any new components as they're built out
@customElement('case-history-widget')
class CaseHistory extends BridgeBase {
  @property( {attribute: true, type: String} ) value = "";
  @property( { attribute: false, type: Boolean} ) waitingForData = true;
  @property( {attribute: false, type: Array} ) fields;
  @property( {attribute: false, type: Array} ) displayedColumns;
  @property( {attribute: false, type: Array} ) rowData;


  constructor() {
    //  Note: BridgeBase constructor has 2 optional args:
    //  1st: inDebug - sets this.bLogging: false if not provided
    //  2nd: inLogging - sets this.bLogging: false if not provided.
    //  To get started, we set Debug to false and Logging to true here. Set to your preferred value during development.
    super(false, false);
    if (this.bLogging) { console.log(`${this.theComponentName}: constructor`); }
    if (this.bDebug){ debugger; }

    this.pConn = {};
    this.fields = [];
    this.displayedColumns = [
      { label: "Date", type: "DateTime", fieldName: "pxTimeCreated" }, 
      { label: "Description", type: "TextInput", fieldName: "pyMessageKey" },
      { label: "User", type: "TextInput", fieldName: "pyPerformer" }
     ];

    this.rowData = [];
  
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.bLogging) { console.log(`${this.theComponentName}: connectedCallback`); }
    if (this.bDebug){ debugger; }

    //NOTE: Need to bind the callback to 'this' so it has this element's context when it's called.
    this.registerAndSubscribeComponent(this.onStateChange.bind(this));

    // const theConfigProps = this.thePConn.getConfigProps();
    // const componentConfig = this.thePConn.getRawMetadata().config;
    const caseID = this.thePConn.getValue(PCore.getConstants().CASE_INFO.CASE_INFO_ID);
    const dataViewName = "D_pyWorkHistory";
    const context = this.thePConn.getContextName();

    this.waitingForData = true;

    const historyData = PCore.getDataApiUtils().getData(
      dataViewName,  `{"dataViewParameters":[{"CaseInstanceKey":"${caseID}"}]}`,
      context
      );

    historyData.then( (historyJSON: Object) => {
    
      const tableDataResults = historyJSON["data"].data;

      // compute the rowData using the tableDataResults
      this.computeRowData(tableDataResults);
  
      // At this point, we have data ready to render, so can stop progress indicator
      this.waitingForData = false;

    });
    
  }


  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();
    if (this.bLogging) { console.log(`${this.theComponentName}: disconnectedCallback`); }
    if (this.bDebug){ debugger; }

  }
  
  /**
   * updateSelf
   */
  updateSelf() {
    if (this.bLogging) { console.log(`${this.theComponentName}: updateSelf`); }
    if (this.bDebug){ debugger; }

  }

  /**
   * The `onStateChange()` method will be called when the state is updated.
   *  Override this method in each class that extends BridgeBase.
   *  This implementation can be used for common code that should be done for
   *  all components that are derived from BridgeBase
   */
  onStateChange() {
    if (this.bLogging) { console.log(`${this.theComponentName}: onStateChange`); }
    if (this.bDebug){ debugger; }

    const bShouldUpdate = super.shouldComponentUpdate();

    if (bShouldUpdate) {
      this.updateSelf();
    }
  }


  computeRowData(rows): void {

    // Initialize rowData
    this.rowData = [];
    
    rows.map((row: any, rowIndex) => {
      // only show the 1st 5 rows to reduce console clutter
      if (this.bLogging && (rowIndex < 5)) { console.log(`-> row ${rowIndex} : ${JSON.stringify(row)}`); }
      // Now, for each property in the index of row properties (displayedColumns), add an object
      //  to a new array of values
      let rowDisplayValues: any = [];
      this.displayedColumns.map((column: Object, rowValIndex) => {
        const theType = column["type"];
        const theFieldName = column["fieldName"];
        const theValue = ((theType === "Date" || theType === "DateTime")) ? Utils.generateDateTime(row[theFieldName], "DateTime-Short") : row[theFieldName];
        rowDisplayValues[rowValIndex] = theValue;

      });
      this.rowData[rowIndex] = rowDisplayValues;
    })

    if (this.bLogging) {
      console.log( `${this.theComponentName} --> this.rowData (1st 5 rows): ${JSON.stringify(this.rowData.slice(0,5))}`);
    }

  }


  render(){
    if (this.bLogging) { console.log(`${this.theComponentName}: render with pConn: ${JSON.stringify(this.pConn)}`); }
    if (this.bDebug){ debugger; }

    // To prevent accumulation (and extra rendering) of previous renders, begin each the render
    //  of any component that's a child of BridgeBase with a call to this.prepareForRender();
    this.prepareForRender();

    let theContent = nothing;

    const theColumnHeaders = html`
      <thead class="thead-light">
        <tr>
          ${this.displayedColumns.map((field) => {
            return html`<th scope="col">${field.label}</th>`
          })}
        </tr>
      </thead>
    `;

    // eslint-disable-next-line no-case-declarations
    const theDataRows = html`
      <tbody>
        ${this.rowData.map((row) => html`<tr scope="row">
          ${row.map((rowValue) => html`<td>${rowValue}</td>`)}
        </tr>`)
        }
      </tbody>
    `;

    theContent = html`
      <div class="p-2 font-weight-light">
        <p class="h6">History</p>
        <table class="table table-bordered">
          ${theColumnHeaders}
          ${theDataRows}
        </table>
      </div>
    `;

    this.renderTemplates.push( theContent );

    if (this.waitingForData) {
      this.renderTemplates.push( html`<progress-extension id="${this.theComponentId}"></progress-extension>`)
    }

    return this.renderTemplates;

  }

}

export default CaseHistory;