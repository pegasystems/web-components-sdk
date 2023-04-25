import { html, customElement, property, nothing } from '@lion/core';
import { BridgeBase } from '../../../bridge/BridgeBase';
// NOTE: you need to import ANY component you may render.
import '../PromotedFilters';
import '../SimpleTable';
// Declare that PCore will be defined when this code is run
declare var PCore: any;

// helper function copied from SimpleTableSelect DX Component
const isSelfReferencedProperty = (param, referenceProp) => {
  const [, parentPropName] = param.split(".");
  return parentPropName === referenceProp;
};

@customElement('simple-table-select')
class SimpleTableSelect extends BridgeBase {
  @property({ attribute: false, type: String }) label = "";
  @property({ attribute: false, type: String }) renderMode = "";
  @property({ attribute: false, type: Boolean }) showLabel = true;
  @property({ attribute: false, type: String }) viewName = "";
  @property({ attribute: false, type: Object }) parameters = {};
  @property({ attribute: false, type: String }) dataRelationshipContext = "";

  // Set this to the component we want to render. It may get updated
  //  whenever the component updates
  theComponentToRender: any = nothing;

  // Vars from Cosmos React DX Component implementation
  propsToUse: any = {};

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

    //NOTE: Need to bind the callback to 'this' so it has this element's context when it's called.
    this.registerAndSubscribeComponent(this.onStateChange.bind(this));

  }


  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();
    if (this.bLogging) { console.log(`${this.theComponentName}: disconnectedCallback`); }
    if (this.bDebug) { debugger; }
  }

  updateSelf() {
    if (this.bLogging) { console.log(`${this.theComponentName}: updateSelf`); }
    if (this.bDebug) { debugger; }

    // Update properties based on configProps
    const theConfigProps = this.thePConn.getConfigProps();

    this.label = theConfigProps.label;
    this.renderMode = theConfigProps.renderMode;
    this.showLabel = theConfigProps.showLabel;
    this.viewName = theConfigProps.viewName;
    this.parameters = theConfigProps.parameters;
    this.dataRelationshipContext = theConfigProps.dataRelationshipContext;

    // Beginning of code from DX Component: SimpleTableSelect

    const propsToUse = {
      label: this.label,
      showLabel: this.showLabel,
      ...this.thePConn.getInheritedProps()
    };

    if (propsToUse.showLabel === false) {
      propsToUse.label = "";
    }

    const { MULTI } = PCore.getConstants().LIST_SELECTION_MODE;
    const { selectionMode, selectionList } = theConfigProps;
    const isMultiSelectMode = selectionMode === MULTI;

    if (isMultiSelectMode && this.renderMode === "ReadOnly") {
      this.theComponentToRender = html`<div><simple-table-component .pConn=${this.thePConn}></simple-table-component></div>`;
      return;
    }

    const pageReference = this.thePConn.getPageReference();
    let referenceProp = isMultiSelectMode
      ? selectionList.substring(1)
      : pageReference.substring(pageReference.lastIndexOf(".") + 1);
    // Replace here to use the context name instead
    let contextPageReference = null;
    if (this.dataRelationshipContext !== null && selectionMode === "single") {
      referenceProp = this.dataRelationshipContext;
      contextPageReference = pageReference.concat(".").concat(referenceProp);
    }

    // Note that this syntax looks odd but it's really just a complex destructuring
    //  of whichever call is made: getFieldMetadata or getCurrentPageFieldMetadata
    //  Of special note: only the fieldParameters and pageClass variables are created.
    //  The destructuring syntax pulls fieldParameters from the 
    //    datasource --> parameters --> fieldParameters if it exists.
    const {
      datasource: { parameters: fieldParameters = {} } = {},
      pageClass
    } = isMultiSelectMode
        ? this.thePConn.getFieldMetadata(`@P .${referenceProp}`)
        : this.thePConn.getCurrentPageFieldMetadata(contextPageReference);

    const compositeKeys: Array<any> = [];
    Object.values(fieldParameters).forEach((param: any) => {
      if (isSelfReferencedProperty(param, referenceProp)) {
        const substringOffset = param.lastIndexOf(".") + 1;
        const theSubstring = substringOffset ? param.substring(substringOffset) : null;
        theSubstring ? compositeKeys.push(theSubstring) : null;
      }
    });

    // setting default row height for select table
    const defaultRowHeight = "2";

    const additionalTableConfig = {
      rowDensity: false,
      enableFreezeColumns: false,
      autoSizeColumns: false,
      resetColumnWidths: false,
      defaultFieldDef: {
        showMenu: false,
        noContextMenu: true,
        grouping: false
      },
      itemKey: "$key",
      defaultRowHeight
    };

    const listViewProps = {
      ...theConfigProps,           // DX component has ...props,
      title: propsToUse.label,
      personalization: false,
      grouping: false,
      expandGroups: false,
      reorderFields: false,
      showHeaderIcons: false,
      editing: false,
      globalSearch: true,
      toggleFieldVisibility: false,
      basicMode: true,
      additionalTableConfig,
      compositeKeys,
      viewName: this.viewName,
      parameters: this.parameters
    };

    const filters = this.thePConn.getRawMetadata().config.promotedFilters ?? [];

    const isSearchable = filters.length > 0;

    if (isSearchable) {
      this.theComponentToRender = html`<promoted-filters-component 
        .pConn=${this.thePConn}
        .viewName=${this.viewName}
        .filters=${filters}
        .listViewProps=${listViewProps}
        .pageClass=${pageClass}
        .parameters=${this.parameters}
        ></promoted-filters-component>`;
      return;

    }

    this.theComponentToRender = html`<div><list-view-component .pConn=${this.thePConn}></list-view-component></div>`;
    

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

  getSimpleTableSelectHtml(): any {
    const theHtml = html`
        ${this.theComponentToRender}
    `;

    return theHtml;

  }

  render() {
    if (this.bLogging) { console.log(`${this.theComponentName}: render with pConn: ${JSON.stringify(this.pConn)}`); }
    if (this.bDebug) { debugger; }

    // To prevent accumulation (and extra rendering) of previous renders, begin each the render
    //  of any component that's a child of BridgeBase with a call to this.prepareForRender();
    this.prepareForRender();

    const sContent = html`${this.getSimpleTableSelectHtml()}`;

    this.renderTemplates.push(sContent);
    // and now add any children to renderTemplates
    this.addChildTemplates();

    return this.renderTemplates;

  }

}

export default SimpleTableSelect;