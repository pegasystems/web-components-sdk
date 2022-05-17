import { html, customElement, property } from '@lion/core';
import { LionButton } from '@lion/button';
import { loadViewByName } from '../../../../constellation/bootstrap-shell';
import { BridgeBase } from '../../../bridge/BridgeBase';
import ListView from '../ListView';
// NOTE: you need to import ANY component you may render.

// Declare that PCore will be defined when this code is run
declare var PCore: any;


// Adapted from Cosmos React DX Component: src/components/Templates/SimpleTableSelect/PromotedFilters.js

// Start: Helpers/External to component vars/functions from Cosmos React implementation
const PComponent = null;    // Need to determine equivalent: PConnectHOC();
const localeCategory = "SimpleTable";

const SUPPORTED_TYPES_IN_PROMOTED_FILTERS = [
  "TextInput",
  "Percentage",
  "Email",
  "Integer",
  "Decimal",
  "Checkbox",
  "DateTime",
  "Date",
  "Time",
  "Text",
  "TextArea",
  "Currency",
  "URL",
  "RichText"
];

// Breaking down in separate pieces of (1) the filters to render and 
//  (2) the component to render the filters.
//  React DX Components bundled these into a single function call
function Filters( /* { */ filters, transientItemID, localeReference /* } */ ) {
  return filters.map((filter) => {
    const filterClone = { ...filter };
    // convert any field which is not supported to TextInput and delete the placeholder as it may contain placeholder specific to original type.
    if (!SUPPORTED_TYPES_IN_PROMOTED_FILTERS.includes(filterClone.type)) {
      filterClone.type = "TextInput";
      delete filterClone.config.placeholder;
    }
    filterClone.config.contextName = transientItemID;
    filterClone.config.readOnly = false;
    filterClone.config.context = transientItemID;
    filterClone.config.localeReference = localeReference;
    const c11nEnv = PCore.createPConnect({
      meta: filterClone,
      options: {
        hasForm: true,
        contextName: transientItemID
      }
    });

    console.warn(`PromotedFilters Filters function is returning an array of PConnect config objects instead of React components`);
    return /* createElement(PComponent,*/ c11nEnv /* ) */;
  });
}

function isValidInput(input) {
  return Object.values(input).findIndex((v) => v) >= 0;
}

const gridContainer = {
  cols: "repeat(3, minmax(0, 1fr))",
  colGap: 2,
  rowGap: 2,
  alignItems: "start"
};

// End: Helpers/External to component vars/functions from Cosmos React implementation


@customElement('promoted-filters-component')
class PromotedFilters extends BridgeBase {
  // Additional properties passed in
  @property( {attribute: true, type: String} ) viewName = "";
  @property( {attribute: true, type: Array } ) filters: Array<any> = [];
  @property( {attribute: true, type: Object} ) listViewProps: any = {};
  @property( {attribute: true, type: String} ) pageClass = "";

  // Vars from Cosmos React DX Component implementation
  
  // Moved from external to component to make sure PCore is defined
  localizedVal = PCore.getLocaleUtils().getLocaleValue;

  initTable: Boolean = false;   // initTable is a boolean in React DX Component
  filtersProperties = {};



  constructor() {
    //  Note: BridgeBase constructor has 2 optional args:
    //  1st: inDebug - sets this.bLogging: false if not provided
    //  2nd: inLogging - sets this.bLogging: false if not provided.
    //  To get started, we set Debug to false and Logging to true here. Set to your preferred value during development.
    super(false, false);
    if (this.bLogging) { console.log(`${this.theComponentName}: constructor`); }
    if (this.bDebug){ debugger; }

    this.pConn = {};
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.bLogging) { console.log(`${this.theComponentName}: connectedCallback`); }
    if (this.bDebug){ debugger; }

    // setup this component's styling...
    // this.theComponentStyleTemplate = simpleTableSelectStyles;

    //NOTE: Need to bind the callback to 'this' so it has this element's context when it's called.
    this.registerAndSubscribeComponent(this.onStateChange.bind(this));
    
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

    // Update properties based on configProps
    const theConfigProps = this.thePConn.getConfigProps();

    // Start: functions from Cosmos React DX Component implementation

    this.filters.forEach((filter) => {
      this.filtersProperties[
        PCore.getAnnotationUtils().getPropertyName(filter.config.value)
      ] = "";
    });

    // Need to figure out how to make many of these work without being React
    //  userEffect, useMemo, etc.  
    
    // useEffect(() => {
    //   const subscribeIdConst = "FILTERS_CHANGE_SUBSCRIPTION";
    //   const filterPropsWithDot = Object.keys(filtersProperties).map(
    //     (filterName) => `.${filterName}`
    //   );
  
    //   // TODO: Passing page reference (2nd argument) as empty string until casecade manager fixes the issue with Transient state
    //   PCore.getCascadeManager().registerFields(
    //     transientItemID,
    //     "",
    //     filterPropsWithDot,
    //     changeFilterCallback,
    //     subscribeIdConst
    //   );
  
    //   return () => {
    //     PCore.getCascadeManager().unRegisterFields(
    //       transientItemID,
    //       "",
    //       filterPropsWithDot,
    //       subscribeIdConst
    //     );
    //   };
    // }, [getPConnect, transientItemID, filters]);
  
    // End: functions from Cosmos React DX Component implementation

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

  // In React DX Components - was a useMemo. Won't try to cache results here.
  transientItemID() /* = useMemo(() => */ {

    const filtersWithClassID = {
      ...this.filtersProperties,
      classID: this.pageClass
    };
    // return getPConnect().getContainerManager().addTransientItem({
    //   id: viewName,
    //   data: filtersWithClassID
    // });
    return this.thePConn.getContainerManager().addTransientItem({
      id: this.viewName,
      data: filtersWithClassID
    });
  }/*, []); */


  // In React DX Components - was a useCallback. Won't try to cache results here.
  clearFilterData() /* = useCallback( () => */ {
    const theTransientItem = this.transientItemID();

    PCore.getContainerUtils().clearTransientData(theTransientItem);
    this.initTable = false;
    // getPConnect()?.getListActions?.()?.setSelectedRows([]); // Clear the selection (if any made by user)
    this.thePConn?.getListActions?.()?.setSelectedRows([]); // Clear the selection (if any made by user)
  } // , [transientItemID]);


  // In React DX Components - was a useCallback. Won't try to cache results here.
  getFilterData(e: any) { /* = useCallback( (e) => { */
      e.preventDefault(); // to prevent un-intended forms submission.

      const theTransientItem = this.transientItemID();
      const changes = PCore.getFormUtils().getChanges(theTransientItem);
      const formValues = {};
      Object.keys(changes).forEach((key) => {
        // getChanges is returning context_data and messages as well.
        if (key !== "context_data") {
          formValues[key] = changes[key];
        }
      });

      if (
        PCore.getFormUtils().isFormValid(theTransientItem) &&
        isValidInput(formValues)
      ) {
        this.initTable = true;

        PCore.getPubSubUtils().publish(
          PCore.getEvents().getTransientEvent().UPDATE_PROMOTED_FILTERS,
          {
            payload: formValues,
            viewName: this.viewName
          }
        );
      }
    }/* ,
    [transientItemID]
  ); */


  // BEGIN NOTE: changeFilterCallback is all commented out in Cosmos React so no need to change this

  // Re-add back below state variable to enable / disable search button.
  // const [enableSubmitBtn, setEnableSubmitBtn] = useState(() =>
  //   isValidInput(PCore.getFormUtils().getChanges(transientItemID))
  // );
  changeFilterCallback = () => {
    //   setEnableSubmitBtn(
    // isValidInput(PCore.getFormUtils().getChanges(transientItemID)) &&
    //       PCore.getFormUtils().isFormValid(transientItemID)
    //   );
  };

  // END NOTE: changeFilterCallback is all commented out in Cosmos React so no need to change this
  

  // Breaking up the rendered UI into the multiple pieces that the
  //  React DX Component renders as part of a large fragment

  getPromotedFiltersLabel(): any {
    const theHtml = html`
      <div><strong></string>${this.theComponentName}</strong>: component in progress
        <br /><br />
        theComponentProps: same pConn as calling component
        <br /><br />
        this.viewName: ${this.viewName}<br /><br />
        this.pageClass: ${this.pageClass}<br /><br />
        this.filters: ${JSON.stringify(this.filters)}<br /><br />
        this.listViewProps: ${JSON.stringify(this.listViewProps)}<br /><br />
        <br /><br />
        From DX Component render:
        <!--  DX Component = Fragment -->
        <br /><br />
        <label>${this.listViewProps?.title}</label>
      </div>      
    `;

    return theHtml;
  }

  getPromotedFiltersGrid(): any {
    const theHtml = html`
      <div> <!-- /* DX Component = Grid  */ -->
        <div>
          Grid with Filters here!<br /><br />
          ${Filters(this.filters, this.transientItemID(), this.listViewProps.localeReference).map((filter) => {
            const theCompName = filter.getPConnect().getComponentName();
            debugger;
            return html`<div>${theCompName}</div>`;
          })}
        </div>
      </div>
    `;

    return theHtml;
  }

  getPromotedFiltersActions(): any {
    const theHtml = html`
      <div>  <!-- /* DX Component = Form */ -->
        <div> <!-- /* DX Component = actions={[...]} */ -->
          <lion-button 
            key="1"
            type="button"
            @click=${this.clearFilterData}
            data-testid="clear"
            variant="primary">
            ${this.localizedVal("Clear", localeCategory)}
          </lion-button>
          <lion-button 
            key="2"
            type="button"
            @click=${this.getFilterData}
            data-testid="search"
            variant="primary">
            ${this.localizedVal("Search", localeCategory)}
          </lion-button>

        </div> <!-- end of actions  -->

      </div> <!-- end of Form -->
    `
    return theHtml;
  }


  getPromotedFiltersListView() : any {
    const theHtml = html`
        <br /><br />
        <div>
          ListView component here (with results)
        </div>

      </div>
    `;

    return theHtml;
  }


  render(){
    if (this.bLogging) { console.log(`${this.theComponentName}: render with pConn: ${JSON.stringify(this.pConn)}`); }
    if (this.bDebug){ debugger; }

    // From beginning of DX Components implementation. Seems to want to render nothing
    //  if there aren't any filters
    if (!this.filters.length) {
      // Leave this debugger statement in to see if/when this is ever called.
      debugger;
      return null;
    }
  

    // To prevent accumulation (and extra rendering) of previous renders, begin each the render
    //  of any component that's a child of BridgeBase with a call to this.prepareForRender();
    this.prepareForRender();

    // For now, render the different pieces
    this.renderTemplates.push( html`${this.getPromotedFiltersLabel()}` );
    this.renderTemplates.push( html`${this.getPromotedFiltersGrid()}` );
    this.renderTemplates.push( html`${this.getPromotedFiltersActions()}` );
    this.renderTemplates.push( html`${this.getPromotedFiltersListView()}` );

    // and now add any children to renderTemplates
    this.addChildTemplates();

    return this.renderTemplates;

  }

}

export default PromotedFilters;