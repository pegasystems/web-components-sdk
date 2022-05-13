import { html, customElement, property } from '@lion/core';
import { loadViewByName } from '../../../../constellation/bootstrap-shell';
import { BridgeBase } from '../../../bridge/BridgeBase';
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

function Filters({ filters, transientItemID, localeReference }) {
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

    console.warn(`PromotedFilters Filters function need to return equiv to a React component`);
    // return createElement(PComponent, c11nEnv);
    return null;
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
  @property( {attribute: true, type: Object} ) listViewProps: Object = {};
  @property( {attribute: true, type: String} ) pageClass = "";

  // Vars from Cosmos React DX Component implementation
  
  // Moved from external to component to make sure PCore is defined
  localizedVal = PCore.getLocaleUtils().getLocaleValue;

  initTable = null;


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

    const filtersProperties = {};
    this.filters.forEach((filter) => {
      filtersProperties[
        PCore.getAnnotationUtils().getPropertyName(filter.config.value)
      ] = "";
    });

    // Need to figure out how to make many of these work without being React
    //  userEffect, useMemo, etc.

    // const transientItemID = useMemo(() => {
    //   const filtersWithClassID = {
    //     ...filtersProperties,
    //     classID: pageClass
    //   };
    //   return getPConnect().getContainerManager().addTransientItem({
    //     id: viewName,
    //     data: filtersWithClassID
    //   });
    // }, []);
  
    // const getFilterData = useCallback(
    //   (e) => {
    //     e.preventDefault(); // to prevent un-intended forms submission.
  
    //     const changes = PCore.getFormUtils().getChanges(transientItemID);
    //     const formValues = {};
    //     Object.keys(changes).forEach((key) => {
    //       // getChanges is returning context_data and messages as well.
    //       if (key !== "context_data") {
    //         formValues[key] = changes[key];
    //       }
    //     });
  
    //     if (
    //       PCore.getFormUtils().isFormValid(transientItemID) &&
    //       isValidInput(formValues)
    //     ) {
    //       setInitTable(true);
  
    //       PCore.getPubSubUtils().publish(
    //         PCore.getEvents().getTransientEvent().UPDATE_PROMOTED_FILTERS,
    //         {
    //           payload: formValues,
    //           viewName
    //         }
    //       );
    //     }
    //   },
    //   [transientItemID]
    // );
  
    // const clearFilterData = useCallback(() => {
    //   PCore.getContainerUtils().clearTransientData(transientItemID);
    //   setInitTable(false);
    //   getPConnect()?.getListActions?.()?.setSelectedRows([]); // Clear the selection (if any made by user)
    // }, [transientItemID]);
  
    // Re-add back below state variable to enable / disable search button.
    // const [enableSubmitBtn, setEnableSubmitBtn] = useState(() =>
    //   isValidInput(PCore.getFormUtils().getChanges(transientItemID))
    // );
    const changeFilterCallback = () => {
      //   setEnableSubmitBtn(
      // isValidInput(PCore.getFormUtils().getChanges(transientItemID)) &&
      //       PCore.getFormUtils().isFormValid(transientItemID)
      //   );
    };
  
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

  


  getPromotedFiltersHtml() : any {
    const theHtml = html `
      <div><strong></string>${this.theComponentName}</strong>: component in progress
        <br /><br />
        theComponentProps: same pConn as calling component
        <br /><br />
        this.viewName: ${this.viewName}<br /><br />
        this.pageClass: ${this.pageClass}<br /><br />
        this.filters: ${JSON.stringify(this.filters)}<br /><br />
        this.listViewProps: ${JSON.stringify(this.listViewProps)}<br /><br />
        <br /><br />
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

    const sContent = html`${this.getPromotedFiltersHtml()}`;

    this.renderTemplates.push( sContent );
    // and now add any children to renderTemplates
    this.addChildTemplates();

    return this.renderTemplates;

  }

}

export default PromotedFilters;