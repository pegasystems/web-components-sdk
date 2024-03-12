import { html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { BridgeBase } from '../../../bridge/BridgeBase';
import { promotedFiltersStyles } from './promoted-filters-styles';

// NOTE: you need to import ANY component you may render.
import '../ListView';
import '@lion/input/define';

// Declare that PCore will be defined when this code is run
declare var PCore: any;


// Adapted from Cosmos React DX Component: src/components/Templates/SimpleTableSelect/PromotedFilters.js

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
function Filters( /* { */ filters, transientItemID, localeReference /* } */) {
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

    return c11nEnv;
  });
}

function isValidInput(input) {
  return Object.values(input).findIndex((v) => v) >= 0;
}

// End: Helpers/External to component vars/functions from Cosmos React implementation


@customElement('promoted-filters-component')
class PromotedFilters extends BridgeBase {
  // Additional properties passed in
  @property({ attribute: true, type: String }) viewName = "";
  @property({ attribute: true, type: Array }) filters: Array<any> = [];
  @property({ attribute: true, type: Object }) listViewProps: any = {};
  @property({ attribute: true, type: String }) pageClass = "";
  @property({ attribute: true, type: Object }) parameters: any = {} 
  @property({ attribute: false }) value = "default value";
  // Vars from Cosmos React DX Component implementation

  // Moved from external to component to make sure PCore is defined
  localizedVal = PCore.getLocaleUtils().getLocaleValue;

  subscribeIdConst: String = "FILTERS_CHANGE_SUBSCRIPTION";


  initTable: Boolean = false;   // initTable is a boolean in React DX Component
  filtersProperties = {};

  transientItemID: any = null;
  payload: any;


  constructor() {
    //  Note: BridgeBase constructor has 2 optional args:
    //  1st: inDebug - sets this.bLogging: false if not provided
    //  2nd: inLogging - sets this.bLogging: false if not provided.
    //  To get started, we set Debug to false and Logging to true here. Set to your preferred value during development.
    super(false, false);
    if (this.bLogging) { console.log(`${this.theComponentName}: constructor`); }
    if (this.bDebug) { debugger; }

    this.pConn = {};
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.bLogging) { console.log(`${this.theComponentName}: connectedCallback`); }
    if (this.bDebug) { debugger; }

    // setup this component's styling...
    this.theComponentStyleTemplate = promotedFiltersStyles;

    //NOTE: Need to bind the callback to 'this' so it has this element's context when it's called.
    this.registerAndSubscribeComponent(this.onStateChange.bind(this));

    // Filters are passed in as a prop so this should only need to be set the first time
    this.filters.forEach((filter) => {
      this.filtersProperties[PCore.getAnnotationUtils().getPropertyName(filter.config.value)] = "";
    });

    // Set initial value of transientItemID
    this.setTransientItemID();
  }


  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();
    if (this.bLogging) { console.log(`${this.theComponentName}: disconnectedCallback`); }
    if (this.bDebug) { debugger; }

    // This is from the React DX Component useEffect return() indicating it should
    //  be called when the component is being unmounted/disconnected
    const filterPropsWithDot = Object.keys(this.filtersProperties).map(
      (filterName) => `.${filterName}`
    );

    PCore.getCascadeManager().unRegisterFields(
      this.transientItemID,
      "",
      filterPropsWithDot,
      this.subscribeIdConst
    );


  }

  updateSelf() {
    if (this.bLogging) { console.log(`${this.theComponentName}: updateSelf`); }
    if (this.bDebug) { debugger; }

    this.requestUpdate();
  }

  /**
   * The `onStateChange()` method will be called when the state is updated.
   *  Override this method in each class that extends BridgeBase.
   *  This implementation can be used for common code that should be done for
   *  all components that are derived from BridgeBase
   */
  onStateChange() {
    if (this.bLogging) { console.log(`${this.theComponentName}: onStateChange`); }
    if (this.bDebug) { debugger; }

    const bShouldUpdate = super.shouldComponentUpdate();

    if (bShouldUpdate) {
      this.updateSelf();
    }
  }

  // In React DX Components - was a useMemo with an empty dependencies array.
  //  So, we'll compute this once on creation by calling this setter and won't update it.
  setTransientItemID() {

    const filtersWithClassID = {
      ...this.filtersProperties,
      classID: this.pageClass
    };

    const theTransientItemID = this.thePConn.getContainerManager().addTransientItem({
      id: this.viewName,
      data: filtersWithClassID
    });

    this.transientItemID = theTransientItemID;
  }

  clearFilterData() {
    const theTransientItem = this.transientItemID;
    PCore.getContainerUtils().clearTransientData(theTransientItem);
    this.initTable = false;
    this.thePConn?.getListActions?.()?.setSelectedRows([]); // Clear the selection (if any made by user)
    this.requestUpdate();
  }

  getFilterData(e: any) { 

    e.preventDefault(); // to prevent un-intended forms submission.

    const theTransientItem = this.transientItemID;
    const changes = PCore.getFormUtils().getChanges(theTransientItem);
    const formValues = {};
    Object.keys(changes).forEach((key) => {
      // getChanges is returning context_data and messages as well.
      if (key !== "context_data") {
        formValues[key] = changes[key];
      }
    });
    const promotedFilters = this.formatPromotedFilters(formValues);
    if (PCore.getFormUtils().isFormValid(theTransientItem) && isValidInput(formValues)) {
      this.initTable = true;
      const Query: any = {
        dataViewParameters: this.parameters
      };
      if (Object.keys(promotedFilters).length > 0) {
        Query.query = { filter: { filterConditions: promotedFilters } };
      }
      this.payload = JSON.stringify(Query);
      this.requestUpdate();
    }
  }

  formatPromotedFilters(promotedFilters) {
    return Object.entries(promotedFilters).reduce((acc, [field, value]) => {
      if (value) {
        acc[field] = {
          lhs: {
            field
          },
          comparator: "EQ",
          rhs: {
            value
          }
        };
      }
      return acc;
    }, {});
  }

  getPromotedFiltersLabel(): any {
    const theHtml = html`
      <div>
        <label>${this.listViewProps?.title}</label>
      </div>      
    `;

    return theHtml;
  }

  getPromotedFiltersGrid(): any {
    const theHtml = html`
      <div>
        <div class="psdk-grid-filter">
          ${Filters(this.filters, this.transientItemID, this.listViewProps.localeReference).map((filter) => {
            // return the lit-html component associated with each filter so they can be rendered
            return BridgeBase.getComponentFromConfigObj(filter);
          })}
        </div>
      </div>
    `;

    return theHtml;
  }

  getPromotedFiltersActions(): any {
    const theHtml = html`
      <div>
        <div class='action-button'>
          <button class="btn btn-secondary" @click=${this.clearFilterData} data-testid="clear">${this.localizedVal("Clear", localeCategory)}</button>
          <button class="btn btn-primary" @click=${this.getFilterData} data-testid="search">${this.localizedVal("Search", localeCategory)}</button>
        </div> 
      </div>
    `
    return theHtml;
  }

  getPromotedFiltersListView(): any {
    const theHtml = html`
        <div>
            <list-view-component .pConn=${this.thePConn} payload=${this.payload}></list-view-component>
        </div>
      </div>
    `;
    return theHtml;
  }

  render() {
    if (this.bLogging) { console.log(`${this.theComponentName}: render with pConn: ${JSON.stringify(this.pConn)}`); }
    if (this.bDebug) { debugger; }

    if (!this.filters.length) {
      // Leave this debugger statement in to see if/when this is ever called.
      debugger;
      return null;
    }

    // To prevent accumulation (and extra rendering) of previous renders, begin each the render
    //  of any component that's a child of BridgeBase with a call to this.prepareForRender();
    this.prepareForRender();
    this.renderTemplates.push(html`${this.getPromotedFiltersLabel()}`);
    this.renderTemplates.push(html`${this.getPromotedFiltersGrid()}`);
    this.renderTemplates.push(html`${this.getPromotedFiltersActions()}`);
    if (this.initTable) {
      this.renderTemplates.push(html`${this.getPromotedFiltersListView()}`);
    }

    return this.renderTemplates;
  }

}

export default PromotedFilters;
