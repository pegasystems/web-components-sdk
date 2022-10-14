import { html, customElement, property, nothing } from '@lion/core';
import { BridgeBase } from '../../../bridge/BridgeBase';
// NOTE: you need to import ANY component you may render.
import '../SimpleTableSelect';
import '../../forms/Dropdown';


// import the component's styles as HTML with <style>
// import { dataReferenceStyles } from './data-reference-styles';


// Declare that PCore will be defined when this code is run
declare var PCore: any;

const SELECTION_MODE = {SINGLE: "single", MULTI: "multi"};

@customElement('data-reference-component')
class DataReference extends BridgeBase {
  @property( {attribute: false, type: String} ) label = undefined;
  @property( {attribute: false, type: String} ) showLabel = undefined;
  @property( {attribute: false, type: String} ) displayMode = "";
  @property( {attribute: false, type: Boolean} ) allowAndPersistChangesInReviewMode = false;
  @property( {attribute: false, type: String} ) referenceType = "";
  @property( {attribute: false, type: String} ) selectionMode = "";
  @property( {attribute: false, type: String} ) displayAs = "";
  @property( {attribute: false, type: String} ) ruleClass = "";
  @property( {attribute: false, type: Object} ) parameters = undefined;
  @property( {attribute: false, type: Boolean} ) hideLabel = false;

  // Vars from Cosmos React DX Component implementation
  childrenToRender: Array<any> = [];
  dropDownDataSource: String = "";
  isDisplayModeEnabled: Boolean = false;
  propsToUse: any = {};
  rawViewMetadata: any = {};
  viewName: String = "";
  firstChildMeta: any = {};
  refList: any;
  canBeChangedInReviewMode: Boolean = false;
  propName: String = ""


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
    // this.theComponentStyleTemplate = dataReferenceStyles;

    //NOTE: Need to bind the callback to 'this' so it has this element's context when it's called.
    this.registerAndSubscribeComponent(this.onStateChange.bind(this));

    // Update properties based on configProps
    const theConfigProps = this.thePConn.getConfigProps();

    this.label = theConfigProps.label;
    this.showLabel = theConfigProps.showLabel;
    this.displayMode = theConfigProps.displayMode;
    this.allowAndPersistChangesInReviewMode = theConfigProps.allowAndPersistChangesInReviewMode;
    this.referenceType = theConfigProps.referenceType;
    this.selectionMode = theConfigProps.selectionMode;
    this.displayAs = theConfigProps.displayAs;
    this.ruleClass = theConfigProps.ruleClass;
    this.parameters = theConfigProps.parameters;
    this.hideLabel = theConfigProps.hideLabel;

    this.childrenToRender = this.children;
    this.isDisplayModeEnabled = ["LABELS_LEFT", "STACKED_LARGE_VAL"].includes(
      this.displayMode
    );

    this.propsToUse = { "label": this.label, "showLabel": this.showLabel, ...this.thePConn.getInheritedProps()};
    if (this.propsToUse["showLabel"] === false) {
      this.propsToUse["label"] = "";
    }

    this.rawViewMetadata = this.thePConn.getRawMetadata()
    this.viewName = this.rawViewMetadata["name"];
    this.firstChildMeta = this.rawViewMetadata["children"][0];
    this.refList = this.rawViewMetadata["config"]["referenceList"];
    this.canBeChangedInReviewMode = this.allowAndPersistChangesInReviewMode && (this.displayAs === "autocomplete" || this.displayAs === "dropdown");

    // Do the rest of the setup from the Cosmos React DX Component
    this.setupDataRefUI();

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

  setupDataRefUI(): any {
    if (this.firstChildMeta.type !== "Region") {
      const firstChildPConnect = this.thePConn.getChildren()[0].getPConnect;
      /* remove refresh When condition from those old view so that it will not be used for runtime */
      if (this.firstChildMeta?.config?.readOnly) {
        delete this.firstChildMeta.config.readOnly;
      }
      if (this.firstChildMeta?.type === "Dropdown") {
        this.firstChildMeta.config.datasource.source = this.rawViewMetadata.config
          ?.parameters
          ? this.dropDownDataSource
          : "@DATASOURCE ".concat(this.refList).concat(".pxResults");
      } else if (this.firstChildMeta?.type === "AutoComplete") {
        this.firstChildMeta.config.datasource = this.refList;

        /* Insert the parameters to the component only if present */
        if (this.rawViewMetadata.config?.parameters) {
          this.firstChildMeta.config.parameters = this.parameters;
        }
      }
      // set displayMode conditionally
      if (!this.canBeChangedInReviewMode) {
        this.firstChildMeta.config.displayMode = this.displayMode;
      }

      this.propName = PCore.getAnnotationUtils().getPropertyName(
        this.firstChildMeta.config.value
      );


      // In Cosmos React DX Component, the implementation of handleSelection was here!

      const theRecreatedFirstChild = this.recreatedFirstChild(firstChildPConnect);

      // Only include the views region for rendering when it has content
      const viewsRegion = this.rawViewMetadata.children[1];
      if (viewsRegion?.name === "Views" && viewsRegion.children.length) {
        this.childrenToRender = [theRecreatedFirstChild, ...this.children.slice(1)];
      } else {
        this.childrenToRender = [theRecreatedFirstChild];
      }
    }


  }


  handleSelection = (event) => {
    const caseKey = this.thePConn.getCaseInfo().getKey();

    console.error(`${this.theComponentName} handleSelection not fully implemented. caseKey: ${caseKey}`);

  // For now, skipping details in handleSelection event handler...

  //   const refreshOptions = { autoDetectRefresh: true };
  //   if (
  //     canBeChangedInReviewMode &&
  //     pConn.getValue("__currentPageTabViewName")
  //   ) {
  //     getPConnect()
  //       .getActionsApi()
  //       .refreshCaseView(caseKey, pConn.getValue("__currentPageTabViewName"), null, refreshOptions);
  //     PCore.getDeferLoadManager().refreshActiveComponents(
  //       pConn.getContextName()
  //     );
  //   } else {
  //     const pgRef = pConn.getPageReference().replace("caseInfo.content", "");
  //     getPConnect().getActionsApi().refreshCaseView(caseKey, viewName, pgRef, refreshOptions);
  //   }

  //   // AutoComplete sets value on event.id whereas Dropdown sets it on event.target.value
  //   const propValue = event?.id || event?.target.value;
  //   if (propValue && canBeChangedInReviewMode && isDisplayModeEnabled) {
  //     PCore.getDataApiUtils()
  //       .getCaseEditLock(caseKey)
  //       .then((caseResponse) => {
  //         const pageTokens = pConn
  //           .getPageReference()
  //           .replace("caseInfo.content", "")
  //           .split(".");
  //         let curr = {};
  //         const commitData = curr;

  //         pageTokens.forEach((el) => {
  //           if (el !== "") {
  //             curr[el] = {};
  //             curr = curr[el];
  //           }
  //         });

  //         // expecting format like {Customer: {pyID:"C-100"}}
  //         const propArr = propName.split(".");
  //         propArr.forEach((element, idx) => {
  //           if (idx + 1 === propArr.length) {
  //             curr[element] = propValue;
  //           } else {
  //             curr[element] = {};
  //             curr = curr[element];
  //           }
  //         });

  //         PCore.getDataApiUtils()
  //           .updateCaseEditFieldsData(
  //             caseKey,
  //             { [caseKey]: commitData },
  //             caseResponse.headers.etag,
  //             pConn.getContextName()
  //           )
  //           .then((response) => {
  //             PCore.getContainerUtils().updateChildContainersEtag(
  //               pConn.getContextName(),
  //               response.headers.etag
  //             );
  //           });
  //       });
  //   }

  };


  // // Re-create first child with overridden props
  // // Memoized child in order to stop unmount and remount of the child component when data reference
  // // rerenders without any actual change
  recreatedFirstChild(inChildPConn): any /* = useMemo(() => */ {
    const { type, config } = this.firstChildMeta;
    if (!this.canBeChangedInReviewMode && this.isDisplayModeEnabled && this.selectionMode === SELECTION_MODE.SINGLE) {
      console.error(`${this.theComponentName} recreatedFirstChild returning null  - related to canBeChangedInReviewMode`);
      return null;

      // return (
        // <SingleReferenceReadonly
        //   config={config}
        //   getPConnect={firstChildPConnect}
        //   label={propsToUse.label}
        //   type={type}
        //   displayAs={displayAs}
        //   displayMode={displayMode}
        //   ruleClass={ruleClass}
        //   referenceType={referenceType}
        //   hideLabel={hideLabel}
        //   dataRelationshipContext={
        //     rawViewMetadata.config.contextClass && rawViewMetadata.config.name
        //       ? rawViewMetadata.config.name
        //       : null
        //   }
        // />
      // );
    }

    if (this.isDisplayModeEnabled && this.selectionMode === SELECTION_MODE.MULTI) {
      console.error(`${this.theComponentName} recreatedFirstChild returning null - related to isDisplayModeEnabled`);
      return null;
      // return (
        // <MultiReferenceReadonly
        //   config={config}
        //   getPConnect={firstChildPConnect}
        //   displayAs={displayAs}
        //   label={propsToUse.label}
        //   hideLabel={hideLabel}
        // />
      // );
    }

    // In the case of a datasource with parameters you cannot load the dropdown before the parameters
    if (
      type === "Dropdown" &&
      this.rawViewMetadata.config?.parameters &&
      this.dropDownDataSource === null
    ) {
      console.error(`${this.theComponentName} recreatedFirstChild returning  - related to Dropdown`);
      return null;
    }

    return (
     inChildPConn().createComponent({
      type,
      config: {
        ...config,
        required: this.propsToUse.required,
        visibility: this.propsToUse.visibility,
        disabled: this.propsToUse.disabled,
        label: this.propsToUse.label,
        viewName: this.thePConn.getCurrentView(),
        parameters: this.rawViewMetadata.config.parameters,
        readOnly: false,
        localeReference: this.rawViewMetadata.config.localeReference,
        ...(this.selectionMode === SELECTION_MODE.SINGLE ? {referenceType: this.referenceType} : ""),
        dataRelationshipContext:
          this.rawViewMetadata.config.contextClass && this.rawViewMetadata.config.name
            ? this.rawViewMetadata.config.name
            : null,
        hideLabel: this.hideLabel,
        onRecordChange: this.handleSelection
      }
    })
    );

  } 


  getDataReferenceHtml() : any {
    const dataRefHtml = html `
      <div>
        ${ this.processChildrenToRender() }
      </div>
    `;
    
    return dataRefHtml;

  }

  processChildrenToRender() : any {
    let childrenToRenderAsComponents: Array<any> = [];

    this.childrenToRender.map((child, i) => {
      childrenToRenderAsComponents.push(this.convertChildToComponent(child));
    });

    return childrenToRenderAsComponents;

  }


  convertChildToComponent(inChild) : any {
    let convertedComponent: any = nothing;
    const childPConn = inChild.getPConnect();
    const childType = childPConn.getComponentName();
    if (true) { console.log(`----> ${this.theComponentName} convertChildToComponent converting: ${childType}`); }

    switch (childType) {
      case "SimpleTableSelect":
        convertedComponent = html`<simple-table-select .pConn=${childPConn}></simple-table-select>`;
        break;
    
      case "Dropdown":
        convertedComponent = html`<dropdown-form .pConn=${childPConn}></dropdown-form>`;
        break;

      case "AutoComplete":
        convertedComponent = html`<autocomplete-form .pConn=${childPConn}></autocomplete-form>`;
        break;

      default:
        console.error(`----> ${this.theComponentName} convertChildToComponent unknown childType: ${childType}` );
        convertedComponent = html`${this.theComponentName} convertChildToComponent unknown childType: ${childType}`;
        break;
    }

    return convertedComponent;

  }

  render(){
    if (this.bLogging) { console.log(`${this.theComponentName}: render with pConn: ${JSON.stringify(this.pConn)}`); }
    if (this.bDebug){ debugger; }

    // To prevent accumulation (and extra rendering) of previous renders, begin each the render
    //  of any component that's a child of BridgeBase with a call to this.prepareForRender();
    this.prepareForRender();
    const sContent = html`${this.getDataReferenceHtml()}`;

    this.renderTemplates.push( sContent );
    // and now add any children to renderTemplates
    // Component logic renders 'childrenToRender' instead of children.
    // this.addChildTemplates();

    return this.renderTemplates;

  }

}

export default DataReference;