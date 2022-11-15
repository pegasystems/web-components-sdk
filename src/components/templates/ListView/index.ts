import { html, customElement, property, nothing } from '@lion/core';
import { BridgeBase } from '../../../bridge/BridgeBase';
import { Utils } from '../../../helpers/utils';

// NOTE: you need to import ANY component you may render.
import '@vaadin/grid';
import '@vaadin/grid/vaadin-grid-sort-column.js';
import '../../designSystemExtension/ProgressIndicator';
import '@vaadin/grid/vaadin-grid-selection-column.js';
import { columnBodyRenderer } from '@vaadin/grid/lit.js';
import type { GridColumnBodyLitRenderer } from '@vaadin/grid/lit.js';

// import the component's styles as HTML with <style>
import { listViewStyles } from './list-view-styles';


// Declare that PCore will be defined when this code is run
declare var PCore: any;

const SELECTION_MODE = { SINGLE: 'single', MULTI: 'multi' };

// NOTE: this is just a boilerplate component definition intended
//  to be used as a starting point for any new components as they're built out
@customElement('list-view-component')
class ListView extends BridgeBase {
  @property( {attribute: false, type: String} ) searchIcon = "";
  @property( {attribute: false, type: Array} ) fields;
  @property( {attribute: false, type: Array} ) displayedColumns;
  @property( {attribute: false, type: Array} ) columnHeaders;
  @property( {attribute: false, type: Array} ) rowData;

  @property( {attribute: false, type: Array} ) vaadinGridColumns;
  @property( {attribute: false, type: Array} ) vaadinRowData;
  @property( {attribute: true,  type: String} ) payload: any = {};
  // During experimentation, change this to show a particular version
  //  values: "table" or "vaadin" (might add ag-grid later)
  gridChoice: string = "vaadin";
  bClickEventListenerAdded: Boolean = false;
  waitingForData: Boolean = true;
  selectionMode: string = '';
  selectedValue: any;
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
    this.displayedColumns = [];
    this.columnHeaders = [];
    this.rowData = [];

    this.vaadinGridColumns = [];
    this.vaadinRowData = [];
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.bLogging) { console.log(`${this.theComponentName}: connectedCallback`); }
    if (this.bDebug){ debugger; }

    // Add event listener for resize
    window.addEventListener('resize', this._handleResize);

    // setup this component's styling...
    this.theComponentStyleTemplate = listViewStyles;

    //NOTE: Need to bind the callback to 'this' so it has this element's context when it's called.
    this.registerAndSubscribeComponent(this.onStateChange.bind(this));

    if (this.bDebug){ debugger; }

    const theConfigProps = this.thePConn.getConfigProps();
    const componentConfig = this.thePConn.getRawMetadata().config;
    const refList = theConfigProps.referenceList;
    this.searchIcon = Utils.getImageSrc("search", PCore.getAssetLoader().getStaticServerUrl());
    this.getListData();   
  }

  getListData() {
    const theConfigProps = this.thePConn?.getConfigProps();
    if (theConfigProps) {
      this.selectionMode = theConfigProps.selectionMode;
      const componentConfig = this.thePConn.getRawMetadata().config;
      const refList = theConfigProps.referenceList;
      const workListData = PCore.getDataApiUtils().getData(refList, this.payload);
      workListData.then( (workListJSON: Object) => {

        if (this.bDebug){ debugger; }

        // don't update these fields until we return from promise
        this.fields = theConfigProps.presets[0].children[0].children;
        // this is an unresolved version of this.fields, need unresolved, so can get the property reference
        let columnFields = componentConfig.presets[0].children[0].children;

        const tableDataResults = workListJSON["data"].data;

        // displayedColumns is the array of property names associated with the columns.
        //  Derived from columnFields (unresolved configProps - above)
        //  Ex: ["pxRefObjectInsName", "pxTaskLabel", "pyLabel", "pyAssignmentStatus", "pxDeadlineTime", "pxUrgencyAssign"]
        this.displayedColumns = this.getDisplayColums(columnFields);

        // fields is the array of type and config info associated with the columns that are to be shown.
        //  Each entry in the array has the "label" to be displayed and the "name" which is the 
        //  property used to get the data for that column.
        //  Example entry in array: 
        //  {"type":"TextInput", "config": {"label":"Status of the assignment","name":"pyAssignmentStatus"}}
        this.fields = this.updateFields(this.fields, this.displayedColumns);

        // And, after computing this.fields, update columnHeaders
        this.computeColumnHeaders(this.fields);

        // updatedRefList is an array with an entry for each row of data to be shown in the ListView.
        //  (Partial) Example entry in array:
        //  {pxUrgencyAssign: 10, pxRefObjectInsName: "S-58001", pxFlowName: "NewService_Flow", pxAssignedOperatorID: "Rep.CableCo", pxUpdateDateTime: null, ...}
        // eslint-disable-next-line no-unused-vars
        let updatedRefList = this.updateData(tableDataResults, this.fields);

        // vaadin-list experiment
        if (this.gridChoice == "vaadin") {
          this.vaadinRowData = updatedRefList;
        }

        // After we get the updatedRefList, compute the rowData using the updatedRefList
        this.computeRowData(updatedRefList);

        // At this point, we have data ready to render, so can stop progress indicator
        this.waitingForData = false;

        // this.repeatList$ = new MatTableDataSource(updatedRefList);

        // this.repeatList$.paginator = this.paginator;

      });
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'payload') {
      if (oldValue !== newValue) {
        this.payload = newValue;
        this.getListData();
      }
    }
  }

  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();
    if (this.bLogging) { console.log(`${this.theComponentName}: disconnectedCallback`); }
    if (this.bDebug){ debugger; }

    // Remove event listener for resize
    window.removeEventListener('resize', this._handleResize);


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


  updateFields(arFields, arColumns) : Array<any> {
    let arReturn = arFields;
    for (let i in arReturn) {
      arReturn[i].config.name = arColumns[i];
    }

    return arReturn;
  }


  updateData( listData:Array<any>, fieldData:Array<any>): Array<any> {
    let returnList : Array<any> = new Array<any>();
    for ( let row in listData) {
       // copy
      let rowData = JSON.parse(JSON.stringify(listData[row]));


      for (let field in fieldData) {
        let config = fieldData[field].config
        let fieldName;
        let formattedDate;

        switch (fieldData[field].type) {
          case "Date" :
            fieldName = config.name;
            formattedDate = Utils.generateDate(rowData[fieldName], config.formatter);

            rowData[fieldName] = formattedDate;
            break;
          case "DateTime" :
            fieldName = config.name;
            formattedDate = Utils.generateDateTime(rowData[fieldName], config.formatter);

            rowData[fieldName] = formattedDate;
            break;
        }

      }

      returnList.push(rowData);
    }

    return returnList;
  }



  getDisplayColums(fields = []) {
    let arReturn = fields.map(( field: any, colIndex) => {
      let theField = field.config.value.substring(field.config.value.indexOf(" ")+1);
      if (theField.indexOf(".") == 0) {
        theField = theField.substring(1);
      }

      return theField;
    });
    return arReturn; 
  }


  computeColumnHeaders(fields = []): void {
    if (this.bDebug){ debugger; }

    // initialize columnHeaders
    this.columnHeaders = [];

    fields.map((field: any, colIndex) => {
      this.columnHeaders[colIndex] = field.config.label;
    });

    if (this.bLogging) {
      console.log( `${this.theComponentName} --> this.fields: ${JSON.stringify(this.fields)}` );
      console.log( `${this.theComponentName} --> this.columnHeaders: ${JSON.stringify(this.columnHeaders)}` );
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
      this.displayedColumns.map((propKey: string, rowValIndex) => {
        rowDisplayValues[rowValIndex] = row[propKey];

      });
      this.rowData[rowIndex] = rowDisplayValues;
    })

    if (this.bLogging) {
      console.log( `${this.theComponentName} --> this.rowData (1st 5 rows): ${JSON.stringify(this.rowData.slice(0,5))}`);
    }

  }


  computeGridColumns_Vaadin(): void {

    // initialize
    this.vaadinGridColumns = [];

    // Iterate over this.fields to extract the data needed for vaadin-grid-column: name and path
    const content: any = html`
      <vaadin-grid .items="${this.vaadinRowData}" id=${this.theComponentId}>
      ${this.selectionMode === SELECTION_MODE.SINGLE ? html`<vaadin-grid-column header="" flex-grow="0" auto-width ${columnBodyRenderer(this.radioRender, [])}></vaadin-grid-sort-column>` : nothing}
      ${this.selectionMode === SELECTION_MODE.MULTI ? html`<vaadin-grid-column header="" flex-grow="0" auto-width ${columnBodyRenderer(this.checkboxRender, [])}></vaadin-grid-sort-column>` : nothing}
      ${this.fields.map((field) => {
        return html`<vaadin-grid-sort-column header="${field.config.label}" path="${field.config.name}"></vaadin-grid-sort-column>`
      })}
    `;

    return content;
  }

  private radioRender: GridColumnBodyLitRenderer<any> = ({ pyGUID }) => {
    return html`<input  name='radio-buttons' type="radio" .value="${pyGUID}" @change="${this.onRadioChange}"/>`
  };

  private checkboxRender: GridColumnBodyLitRenderer<any> = ({ pyGUID }) => {
    return html`<input  name='checkbox' type="checkbox" .value="${pyGUID}" @change="${this.onCheckboxClick}"/>`
  };

  onRadioChange(event) {
    const value = event.target.value;
    this.thePConn?.getListActions?.()?.setSelectedRows([{'pyGUID': value}]);
    this.selectedValue = value;
  };

  onCheckboxClick(event) {
    const value = event?.target?.value;
    const checked = event?.target?.checked;
    this.thePConn?.getListActions()?.setSelectedRows([{'pyGUID': value, $selected: checked }]);
  };

  clickRowInGrid(inDetail: any) {
    const { pxRefObjectClass, pzInsKey } = inDetail.value;
    const theTarget = this.thePConn.getContainerName();
    const options = { "containerName": theTarget };

    // const theInsKey = inDetail.value["pzInsKey"];
    // window.alert(`clicked on <vaadin-grid>: inDetail.value: ${JSON.stringify(inDetail.value)}`);
    this.thePConn.getActionsApi().openAssignment(pzInsKey, pxRefObjectClass, options);

  }

  // Resize handler to force adjustment of height
  private _handleResize = () => { 
    // Update the proper vaadin-grid table height
    const theVaadinGrid: any = this.shadowRoot?.getElementById(this.theComponentId.toString());
    if (theVaadinGrid) {
      const theVaadinShadowTable: any = theVaadinGrid.shadowRoot.getElementById("table");
      if (theVaadinShadowTable) {
        // Fill the available height. Need to subtract the space that's taken for the header (which is offsetTop)
        theVaadinShadowTable.style['height'] = (window.innerHeight - this.offsetTop) + "px";
      }
    }
  }


  render(){
    if (this.bLogging) { console.log(`${this.theComponentName}: render with pConn: ${JSON.stringify(this.pConn)}`); }
    if (this.bDebug){ debugger; }

    // To prevent accumulation (and extra rendering) of previous renders, begin each the render
    //  of any component that's a child of BridgeBase with a call to this.prepareForRender();
    this.prepareForRender();

    let theContent: any = nothing;

    switch (this.gridChoice) {
      case "table":
        // eslint-disable-next-line no-case-declarations
        const theColumnHeaders = html`
          <thead>
          <tr>
            ${this.columnHeaders.map((field) => {
              return html`<th>${field}</th>`
            })}
          </tr>
          </thead>
        `;
  
        // eslint-disable-next-line no-case-declarations
        const theDataRows = html`<tbody>
            ${this.rowData.map((row) => html`<tr>
              ${row.map((rowValue) => html`<td>${rowValue}</td>`)}
            </tr>`)
            }
            </tbody>
          `;
  
        theContent = html`
          <table>
            ${theColumnHeaders}
            ${theDataRows}
          </table>`;
        break;

      case "vaadin":
        theContent = this.computeGridColumns_Vaadin();

        // VAADIN: Need to load data into vaadin grid after the grid element is available
        setTimeout((() => {
          // debugger;
          let theVaadinGrid: any = null;

          if ( this && this.shadowRoot && this.shadowRoot.getElementById(this.theComponentId.toString()) ) {
            theVaadinGrid = this.shadowRoot.getElementById(this.theComponentId.toString());
          }

          // Also set up a callback for the grid's "active-item-changed" to catch clicks
          if (theVaadinGrid && !this.bClickEventListenerAdded) {
            theVaadinGrid.addEventListener('active-item-changed', 
            (event) => {
              this.clickRowInGrid(event.detail);
            });
            this.bClickEventListenerAdded = true;
          }

          // And set the proper vaadin-grid table height
          this._handleResize();

        }).bind(this), 50);

        break;
    }

    this.renderTemplates.push( theContent );

    if (this.waitingForData) {
      this.renderTemplates.push( html`<progress-extension id="${this.theComponentId}"></progress-extension>`)
    }

    // this.addChildTemplates();

    return this.renderTemplates;

  }

// vaadin-grid code snippet

// <vaadin-grid>
//   <vaadin-grid-column path="name.first" header="First name"></vaadin-grid-column>
//   <vaadin-grid-column path="name.last" header="Last name"></vaadin-grid-column>
//   <vaadin-grid-column path="location.city"></vaadin-grid-column>
//   <vaadin-grid-column path="visitCount" text-align="end" width="120px" flex-grow="0"></vaadin-grid-column>
// </vaadin-grid>

// <script>
//   customElements.whenDefined('vaadin-grid').then(function() {
//     // Assign an array of user objects as the grid's items
//     document.querySelector('vaadin-grid').items = Vaadin.GridDemo.users;

//     /*
//      * Each object in the above "users" array follows the same structure:
//      * {
//      *   "name": {
//      *     "first": "Laura",
//      *     "last": "Arnaud",
//      *     ...
//      *   },
//      *   "location": {
//      *     "city": "Perpignan"
//      *     ...
//      *   }
//      *   ...
//      * }
//      */
//   });
//   </script>

// this.columnHeaders: ["ID","Task Label","Subject","Status of the assignment","Deadline Time","Urgency"]

// this.fields: [
//    {"type":"TextInput","config":{"label":"ID","name":"pxRefObjectInsName"}},
//    {"type":"TextInput","config":{"label":"Task Label","name":"pxTaskLabel"}},
//    {"type":"TextInput","config":{"label":"Subject","name":"pyLabel"}},
//    {"type":"TextInput","config":{"label":"Status of the assignment","name":"pyAssignmentStatus"}},
//    {"type":"DateTime","config":{"label":"Deadline Time","formatter":"DateTime-Since","name":"pxDeadlineTime"}},
//    {"type":"Decimal","config":{"label":"Urgency","name":"pxUrgencyAssign"}}
//  ]

//  typical entry in rows:
//  {"pxUrgencyAssign":10,"pxRefObjectInsName":"S-59004","pxFlowName":"NewService_Flow","pxAssignedOperatorID":"Rep.CableCo","pxUpdateDateTime":null,"pxTaskLabel":"Customer","pxRefObjectClass":"CableC-CableCon-Work-Service","pyAssignmentStatus":"New","pyInstructions":null,"pzInsKey":"ASSIGN-WORKLIST CABLEC-CABLECON-WORK S-59004!NEWSERVICE_FLOW","pxDeadlineTime":null,"pxUpdateOperator":null,"pxGoalTime":null,"pxCreateDateTime":"2021-03-09T21:26:16.640Z","pxRefObjectKey":"CABLEC-CABLECON-WORK S-59004","pxAssignedUserName":"Rep.CableCo","pyLabel":"Service","pyFlowType":"NewService_Flow"}

// typical entry in rowData:
//  ["S-59004","Customer","Service","New",null,10]


}

export default ListView;