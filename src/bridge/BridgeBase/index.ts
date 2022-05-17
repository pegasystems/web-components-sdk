// Lion doc - https://lion-web.netlify.app/docs/systems/core/overview/ - says
//  best practice to ensure compatible versions is to import LitElement from @lion/core
import { LitElement, property, html, nothing } from '@lion/core';
import * as isEqual from 'fast-deep-equal';
import { bootstrapStyles } from './bootstrap-styles';


// Declare that PCore will be defined when this code is run
declare var PCore: any;

export class BridgeBase extends LitElement {
  // bootstrapStyles is a (very slightly modified) version of a minified Bootstrap CSS file
  static styles = [ bootstrapStyles ];

  @property( {attribute: false, type: Boolean} ) bDebug = false;   // can override at the component level to turn on debugger statements
  @property( {attribute: false, type: Boolean} ) bLogging = false;   // can override at the component level to turn on logging statements

  @property( {attribute: false} ) theStore: any = null;
  @property( {attribute: false} ) theComponentProps: Object;   // props after state change compared against theComponentProps to see if there are changes
  @property( {attribute: false, type: String} ) theComponentName = "";  // will take on name component that extends BridgeBase
  @property( {attribute: false, type: String} ) baseComponentName = "BridgeBase"; // Name of this particular component
  
  @property( {attribute: false} ) theComponentId: number = Date.now();    // in case we need a unique ID for this component
  @property( {attribute: false, type: Function} ) storeUnsubscribe: Function;
  @property( {attribute: false, type: String} ) validateMessage;
  @property( {attribute: false, type: Object}) theComponentStyleTemplate = nothing;   // Any styling lit-html template that should be added to renderTemplates

  @property( {attribute: false, type: Object} ) thePConn;   // Normalize incoming pConn to a PConnect object
  @property( {attribute: false, type: Object} ) children;
  @property( {attribute: false, type: Object} ) renderTemplates;  // Array of lit-html templates to be rendered

  @property( {attribute: false, type: Object} ) additionalProps;  // optionally added by derived component as Object or Function

  @property( {attribute: false, type: Object} ) actions;    // populated with actions object for this component (PConnect.getActions())
 
  // Common PConnect object (coming in as a LitElement property attribute - .pConn) for all components derived from BridgeBase
  @property( {attribute: true, type: Object /* , hasChanged: BridgeBase.hasPropsChanged */ } ) pConn;   // will either be a PConnect object or have a getPConnect() function


  localCallback: Function = () => {};

  //  Note: BridgeBase constructor has 2 optional args:
  //  1st: inDebug - sets this.bLogging: false if not provided
  //  2nd: inLogging - sets this.bLogging: false if not provided.
  constructor(inDebug = false, inLogging = false) {      
      super();

      if (inDebug) { this.bDebug = true; }  // If you change the assignment of this.bDebug for your local development preference, please don't commit that change
      if (inLogging) { this.bLogging = true; }        // If you change the assignment of this.bLogging for your local development preference, please don't commit that change

      // turn off logging
      this.bLogging = false;
      
      this.storeUnsubscribe = () => {};  // initialize to no-op; update during registerAndSubscribeComponent

      this.theComponentName = this.constructor.name;

      if (this.bLogging) { console.log( `${this.baseComponentName}: constructor for ${this.theComponentName}  [${this.theComponentId}]`); }

      // theStore obtained from PCore
      this.theStore = PCore.getStore();
      this.theComponentProps = {};
      this.renderTemplates = [];

      // Always best to use deep object compare when it's available
      if (isEqual !== undefined) {
        if (this.bLogging) { console.log(`${this.theComponentName}: [${this.theComponentId}] using deep object compare`); }
      } else {
        if (this.bLogging) { console.log(`${this.theComponentName}: [${this.theComponentId}] using JSON.stringify compare`); }
      }
  }

  /**
   *
   * Note: this implementation of createRenderRoot causes that it will render 
   * the template withOUT shadow DOM. If you un-comment this, note that 
   * shadow DOM features like encapsulated CSS and slots are unavailable.
   * Reference: https://lit-element.polymer-project.org/guide/templates
   */
  // createRenderRoot() {
  //     return this;
  // }


  // Example of how to wire up a custom "hasChanged" function for a specific property.
  //  Wired up with a hasChanged: <className>.<customFunctionName> entry in @property
  //  Note: Need to be a Class static function
  // static hasPropsChanged(newVal: any, oldVal: any) {
  //   // debugger;
  //   let bRet: boolean = isEqual(newVal, oldVal);
  //   console.log(`BridgeBase: hasPropsChanged: ${bRet}`) 

  //   return bRet;
  // }


  // Add in Redux store access to component lifecycle methods. Inspired by pwa-helpers "connect"
  //  mixin but we can't use that since our Redux Store isn't initialized until after this file is
  //  loaded and the connect mixin gets run at load time.
  connectedCallback() {
    super.connectedCallback();
    if (this.bDebug){ debugger; }

    // perform common component setup for all components derived from BridgeBase
    this.normalizePConnect();

    if (this.bLogging) { this.logChildren(); }

  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.bDebug){ debugger; }
    if (this.bLogging) { console.log(`${this.baseComponentName}: disconnectedCallback for ${this.theComponentName} [${this.theComponentId}]`); }
    
    // unsubscribe from the store if component has subscribed
    if (this.storeUnsubscribe) {
      if (this.bLogging) { console.log(`${this.baseComponentName}: storeUnsubscribe for ${this.theComponentName} [${this.theComponentId}]`);}
      this.storeUnsubscribe();
    }

  }


 /**
  * Web Component Lifecycle function, called when a property has changed.
  * 
  * Because ".pConn" is complex and the data returned needs to update thePConn and children.
  * After update, need to force the component to render to utilizie the change.
  * 
  * @param changedProperties 
  */
updated(changedProperties) {
  for (let key of changedProperties.keys()) {

    // check if pConn property has changed, if so, normalize and render
    if (key == "pConn") {
      if (this.pConn) {
        this.normalizePConnect();
        this.localCallback();
        this.requestUpdate();
        
      }

    }
  }
}


  /**
   * Every component derived from BridgeBase will have "pConn" provided in the component declaration put in the DOM.
   * Ex: <root-container .pConn=${this.pConn}></root-container>`;
   * Sometimes this is simply a JS object with a getPConnect() function (which returns a PConnect object).
   * Other times, the PConnect object itself is passed in.
   * 
   * This method is called in the BridgeBase connectedCallback to normalize things so every derived object can just
   * access this.thePConn to get the PConnect object.
   * 
   * This method also performs other component setup that's shared amongst all components derived from BridgeBase.
   * For example, it sets this.children to store the children of the given PConnect.
   */
  normalizePConnect() {
    // Assume that every element has pConn.getPConnect passed in
    //  either (a) as pConn with a getPConnect or (b) as the PConnect object itself
    //  We normalize this into this.thePConn so we don't have to do that check.
    //  If the incoming pConn doesn't meet the criteria, we set this.thePConn to null
    //    and later on in this function, we don't try to get its children (since there aren't any)
    //  in every component derived from BridgeBase
    if ((this.pConn.getPConnect !== undefined) && ((typeof this.pConn.getPConnect) === 'function') ) {
      this.thePConn = this.pConn.getPConnect();
    } else if ( this.pConn.getChildren && ((typeof this.pConn.getChildren) === 'function')) {
      this.thePConn = this.pConn;
    } else {
      // NOT a PConn - 
      console.error( `--> ${this.theComponentName} is NOT a PConnect object! Expected for Boilerplate example`);
      this.thePConn = null;
    }

    // Initialize this.children (if available)
    if (this.thePConn) {
      this.children = this.thePConn.getChildren();
    } else {
      // when it's not a PConnect, set children to empty array
      this.children = [];
    }

  }


  /**
   * The `onStateChange()` method will be called when the state is updated.
   *  Override this method in each class that extends BridgeBase.
   *  This implementation can be used for common code that should be done for
   *  all components that are derived from BridgeBase
   */
  onStateChange() {
    if (this.bLogging) { console.log(`${this.baseComponentName}: onStateChange`); }
  }

  /**
   * @returns A handle to the application's store
   */
  getStore() {
    if (this.theStore === null) {
        this.theStore = PCore.getStore();
    }
  return this.theStore;
  }

  /**
   * @param bLogMsg If true, will write the stringified state to the console for debugging/inspection
   * @returns A handle to the __state__ of application's store
   */
  getState(bLogMsg: boolean = false) {
      const theState: Object = this.getStore().getState();
      if (bLogMsg) {
        if (this.bLogging) { console.log( `${this.theComponentName} Store state: ${JSON.stringify(theState)}`); }
      }
      return theState;
  }

  /**
   * Registers the component with the bridge. Registration performs the following:
   *  1. Initialize this component's theComponentProps to {}
   * 
   *  2. assign's component's actions (via processActions)
   * 
   *  3. subscribes the component to the Store and assigns the unsubscribe function
   *      
   * @param inCallback The component's callback function (typically called onStateChange) that will
   * be called when the store changes.

   */
  registerAndSubscribeComponent (inCallback: Function) {
    if (this.bDebug) { debugger; }

    // initialize this component's theComponentProps to {} to establish the baseline
    //  that changes can be compared to.
    this.theComponentProps = {};

    // call processActions to populate metadata with actions as in PConnectHOR initialize
    this.processActions();

    this.localCallback = inCallback;

    if (this.thePConn) {
      this.actions = this.thePConn.getActions();
    } else {
      console.error(`${this.baseComponentName}: bad call to getActions: thePConn: ${this.thePConn} from component: ${this.theComponentName}. Expected for Boilerplate example`);
    }

    // subscribe to the store and save returned unsubscribe callback in this.storeUnsubscribe
    this.storeUnsubscribe = this.subscribeToStore(inCallback);

  }

  /**
   * Subscribe this component to the store
   * @param inCallback The component's callback function (typically called onStateChange) that will
   * be called when the store changes.

   * @returns The **unsubscribe** function that should be called when the component needs 
   * to unsubscribe from the store. (Typically during ngOnDestroy)
   */
  subscribeToStore(inCallback: Function) {
    if (this.bLogging) { console.log( `${this.theComponentName}: subscribeToStore`); }
    let fnUnsubscribe = this.getStore().subscribe(inCallback);

    return fnUnsubscribe;
  }

  /**
   * Returns **true** if the component's entry in ___componentPropsArr___ is
   * the same as the properties that are current associated with the component (___inComp___) passed in.
   * As a side effect, the component's entry in ___componentPropsArr___ is updated.
   * **Note**: It is assumed that the incoming component has the following:
   * (a) a bridgeComponentID _string_ property used as lookup key in ___componentPropsArr___
   * and (b) a ___pConn$___ property used to access functions called in ___getComponentProps___
   * 
   * @param inComp The component asking if it should update itself
   * @returns Return **true**: means the component props are different and the component should update itself (re-render).
   * Return **false**: means the component props are the same and the component doesn't need to update (re-render).
   * If the ***inComp*** input is bad, false is also returned.
   */
  shouldComponentUpdate() : boolean {
    let bRet:boolean = false;

    // getComponentProps returns the complete set of (resolved) properties associated with this component in Redux
    const currentComponentProps: any = this.getComponentProps();

    const priorProps = this.theComponentProps;
    const priorPropsAsStr: string = JSON.stringify(priorProps);

    let currentProps: any = currentComponentProps
    let currentPropsAsStr: string = JSON.stringify(currentProps);

    // compare to current to prior props. If different, update stored props and return true
    // fast-deep-equal version
    if (isEqual !== undefined) {
      bRet = !isEqual(priorProps, currentProps);
    } else{
      // stringify compare version
      if ( priorPropsAsStr != currentPropsAsStr ) {
        bRet = true;
      }
    }

    // and update the component's validation message (if undefined, it should be set to "")
    // eslint-disable-next-line no-undef
    this.validateMessage = (currentComponentProps.validatemessage === undefined) ? "" : currentComponentProps.validatemessage;

    // if have an error message, force update of component
    if (this.validateMessage != "") {
      bRet = true;
    }

    // If props have changed, update theComponentProps with the new value so
    //  we can compare against that next time...
    if (bRet === true) {
      this.theComponentProps = currentComponentProps;
    }

    //if (this.bLogging) { console.log(`${this.theComponentName}: shouldComponentUpdate: ${bRet}`); }
    if (bRet && this.bLogging) {
      console.log(`${this.theComponentName}: shouldComponentUpdate about to return ${bRet}`);
      console.log(` --> priorProps:   ${priorPropsAsStr}`);
      console.log(` --> currentProps: ${currentPropsAsStr}`);
    }

    return bRet;
  }

  /**
   * Gets the Component's properties that are used (a) to populate this.theComponentProps
   *  and (b) to determine whether the component should update itself (re-render).
   * This is the full set of properties that are tracked in Redux for this component.
   * 
   */
  getComponentProps(): Object {
    let compProps: any = {};
    let addProps = {};

    if (this.additionalProps !== undefined) {

      if (typeof this.additionalProps === "object") {
        addProps = this.thePConn.resolveConfigProps(this.additionalProps);
      } else if (typeof this.additionalProps === "function") {
        const propsToAdd = this.additionalProps(this.getState(), this.thePConn);
        addProps = this.thePConn.resolveConfigProps( propsToAdd );
      }
    }

    
    if ((undefined === this.thePConn) || (null === this.thePConn)) {
      console.error(`${this.baseComponentName}: bad call to getComponentProps: thePConn: ${this.thePConn} from component: ${this.theComponentName}. Expected for Boilerplate example`);
      return compProps;
    } else {
      compProps = this.thePConn.getConfigProps(); // inComp.pConn$.getConfigProps();
    }
    
    // The following comment is from the React version of this code. Meant as a reminder to check this occasionally  
    // populate additional props which are component specific and not present in configurations
    // This block can be removed once all these props will be added as part of configs
    this.thePConn.populateAdditionalProps(compProps);    

    if (compProps && (undefined !== compProps.validatemessage) && compProps.validatemessage != "") {
      if (this.bLogging) { console.log( `   validatemessage for ${this.theComponentName} ${this.theComponentId}: ${compProps.validatemessage}`); }
    }

    compProps = this.thePConn.resolveConfigProps(compProps);

    return {
      ...compProps,
      ...addProps
    }

  }

  /**
   * Returns the value of requested property for the component if it exists.
   * Otherwise, return undefined.
   * @param inProp The property being requested.
   */
  getComponentProp(inProp = "" ) {
    let propVal;

    // Look up property in the component's entry in componentPropArray (which should have the most recent value)
    // propVal = this.theComponentProps[inProp];
    propVal = this.getComponentProps()[inProp];

    if (this.bLogging) {
      console.log(`--> ${this.theComponentName} getComponentProp(${inProp}): ${JSON.stringify(propVal)}`);
    }

    return propVal;
  }


  /**
   * 
   * @returns The current complete set of resolved properties that are associated with
   * this component.
   * This is the full set of properties that are tracked in Redux for this component.
   */
  getCurrentCompleteProps() {
    return this.theComponentProps;
  }


  /**
   * Can be called when the component has encountered a change event.
   * Note that the Constellation JS Engine requires that changeHandler as its 1st param
   * as the component
   * @param inComp The component calling the event
   * @param event The event
   */
  changeHandler(inComp, event) {
    if (this.bLogging) { console.log(`${this.baseComponentName}.changeHandler`); }

    const pConnect = inComp;
    if (undefined === pConnect ) {
      console.error(`${this.baseComponentName}: bad call to changeHandler: inComp.pConn$: ${pConnect}`);
      return;
    }

    pConnect.getActionsApi().changeHandler(pConnect, event);
  }


  /**
   * Can be called when the component has encountered an event (such as blur)
   * Note that the Constellation JS Engine requires that eventHandler as its 1st param
   * as the component
   * @param inComp The component calling the event
   * @param event The event
   */
  eventHandler(inComp, event) {
    if (this.bLogging) { console.log(`${this.baseComponentName}.eventHandler`); }

    const pConnect = inComp;
    if (undefined === pConnect ) {
      console.error(`${this.baseComponentName}: bad call to eventHandler: inComp.pConn$: ${pConnect}`);
      return;
    }

    pConnect.getActionsApi().eventHandler(pConnect, event);
  }


  // processActions - carried over from PConnectHOC initialize
  /**
    *  processActions exposes all actions in the metadata.
    *  Attaches common handler (eventHandler) for all actions.
  */
  processActions() {
    if (this.bDebug) { debugger; }
    if ((undefined === this.thePConn) || (null === this.thePConn)) {
      console.error(`${this.baseComponentName}: bad call to processActions: thePConn: ${this.thePConn} from component: ${this.theComponentName}. Expected for Boilerplate example`);
      return;
    }
    
    if (this.thePConn.isEditable()) {
      this.thePConn.setAction("onChange", this.changeHandler.bind(this));
      this.thePConn.setAction("onBlur", this.eventHandler.bind(this));
    }
  }  


  /** 
   * Since we are often using the technique of iterating over this.renderTemplates to render
   *  a component derived from BridgeBase, we need to prepare the component for a "fresh"
   *  render at the beginning of each render. This will perform common tasks such as re-initializing
   *  this.renderTemplates to an empty array (and optionally adding any common templates to be rendered)
   *  If a child component render fails to call this, this.renderTemplates accumulates templates that
   *  ends up making the component render multiple times since the previous render templates would
   *  remain in the array
   * 
   * Added an optional inDisplayOnlyFA argument that's **only** if you uncomment the line
   *  that renders an extra div showing which component is rendered where. This was added to
   *  assist in debugging the /embedded use case when some components are set to only show
   *  the FlowAction and not the rest of the UI around it.
  */
  // eslint-disable-next-line no-unused-vars
  prepareForRender(inDisplayOnlyFA: boolean = false) {
    if (this.bDebug) { debugger; }
    if (this.bLogging) { console.log(`${this.theComponentName}: prepare for render`); }

    this.renderTemplates = [];

    // For temporary debugging... push the current component's name onto this, renderTemplates...
    //  UNCOMMENT TO SEE WHERE COMPONENTS ARE
    // this.renderTemplates.push( html`<div style='width: fit-content; border: dotted 0.5px #DDDDDD;'>${this.theComponentName} ${inDisplayOnlyFA ? `displayOnlyFA: ${inDisplayOnlyFA}` : ""}</div>` );

    // Add in any style template that's been provided in this.theComponentStyleTemplate
    this.renderTemplates.push( this.theComponentStyleTemplate );
  }


  /**
   * iterates over this.children to add appropriate templates to this.renderTemplates
   */
  addChildTemplates() {

    // iterate over the children, pushing appropriate templates onto the renderTemplates array
    if (this.children === null) {
      if (this.bLogging) {
        // Typically, this is expected for some use cases (PreviewViewContainer, Region, etc.) but this
        //  message can be useful during debugging if your component is expecting to have children.
        console.log(`--> ${this.theComponentName}: addChildTemplates: when this.children === null !!!`);
      }

      return;
    }
    
    for (var child of this.children) {
      const childPConn = child.getPConnect();
      const childType = childPConn.getComponentName();
      if (this.bLogging) { console.log( `----> ${this.theComponentName} addChildTemplates adding: ${childType}`); }

      switch (childType) {
        case "AppAnnouncement":
          this.renderTemplates.push( html`<app-announcement .pConn=${child}></app-announcement>` );
          break;

        case "AppShell":
          this.renderTemplates.push( html`<div class='appshell-main'><app-shell .pConn=${child}></app-shell></div>` );
          break;

        case "Attachment":
          this.renderTemplates.push( html`<attachment-component .pConn=${child}></attachment-component>` );
          break;

        case "AutoComplete":
          this.renderTemplates.push( html`<autocomplete-form .pConn=${child}></autocomplete-form>` );
          break;
                
        case "CaseHistory":
          this.renderTemplates.push( html`<case-history-widget .pConn=${child}></case-history-widget>` );
          break;

        case "CaseOperator":
          this.renderTemplates.push( html`<case-operator-widget .pConn=${child}></case-operator-widget>` );
          break;
  
        case "CaseSummary":
          this.renderTemplates.push( html`<case-summary-template .pConn=${child}></case-summary-template>` );
          break;
  
        case "CaseView":
          this.renderTemplates.push( html`<div class='psdk-case-view'><case-view .pConn=${child}></case-view></div>` );
          break;

        case "Checkbox":
          this.renderTemplates.push( html`<check-box-form .pConn=${child}></check-box-form>` );
          break;

        case "Currency":
          this.renderTemplates.push(html`<currency-form .pConn=${child}></currency-form>`);
          break;
  
        case "Date":
          this.renderTemplates.push(html`<date-form .pConn=${child}></date-form>`);
          break;
          
        case "DateTime":
          this.renderTemplates.push(html`<datetime-form .pConn=${child}></datetime-form>`);
          break;             

        case "Decimal":
          this.renderTemplates.push(html`<decimal-form .pConn=${child}></decimal-form>`);
          break;                   

        case "DefaultForm":
          this.renderTemplates.push( html`<default-form-component .pConn=${child}></default-form-component>` );
          break;

        case "DeferLoad":
          this.renderTemplates.push( html`<defer-load-component .pConn=${child}></defer-load-component>` );
          break;

        case "Dropdown":
          this.renderTemplates.push( html`<dropdown-form .pConn=${child}></dropdown-form>` );
          break;

        case "Email":
          this.renderTemplates.push( html`<email-form .pConn=${child}></email-form>` );
          break;

        case "FileUtility":
          this.renderTemplates.push( html`<file-utility-component .pConn=${child}></file-utility-component>` );
          break;
  
        case "FlowContainer":
          this.renderTemplates.push( html`<flow-container .pConn=${child}></flow-container>` );
          break;

        case "FormattedText":
          this.renderTemplates.push( html`<formatted-text-form .pConn=${child}></formatted-text-form>` );
          break;

        case "Integer":
          this.renderTemplates.push( html`<integer-form .pConn=${child}></integer-form>` );
          break;

        case "ListPage":
          this.renderTemplates.push( html`<list-page-component .pConn=${child}></list-page-component>` );
          break;

        case "ListView":
          this.renderTemplates.push( html`<list-view-component .pConn=${child}></list-view-component>` );
          break;
                        
        case "OneColumn":
          this.renderTemplates.push( html`<one-column .pConn=${child}></one-column>` );
          break;
      
        case "Percentage":
          this.renderTemplates.push( html`<percentage-form .pConn=${child}></percentage-form>` );
          break;

        case "Phone":
          this.renderTemplates.push( html`<phone-form .pConn=${child}></phone-form>` );
          break;
  
        case "Pulse":
          this.renderTemplates.push( html`<pulse-component .pConn=${child}></pulse-component>` );
          break;

        case "RadioButtons":
          this.renderTemplates.push( html`<radio-buttons-form .pConn=${child}></radio-buttons-form>` );
          break;
            
        case "Reference":
        case "reference":
          this.renderTemplates.push( html`<reference-component .pConn=${child}></reference-component>` );
          break;
              
        case "Region":
          this.renderTemplates.push( html`<region-component .pConn=${child}></region-component>` );
          break;

        case "SimpleTableSelect":
          this.renderTemplates.push( html`<simple-table-select .pConn=${child}></simple-table-select>`);
          break;

        case "Text":
          this.renderTemplates.push( html`<text-form .pConn=${child}></text-form>` );
          break;

        case "TextArea":
          this.renderTemplates.push( html`<text-area-form .pConn=${child}></text-area-form>` );
          break;

        case "TextContent":
          this.renderTemplates.push( html`<text-content-form .pConn=${child}></text-content-form>` );
          break;

        case "TextInput":
          this.renderTemplates.push( html`<text-input-form .pConn=${child}></text-input-form>` );
          break;

        case "Time":
          this.renderTemplates.push(html`<time-form .pConn=${child}></time-form>`);
          break;  

        case "ToDo":    // Special case of looking for either capitalization
        case "Todo":
          this.renderTemplates.push( html`<todo-component .pConn=${child}></todo-component>` );
          break;

        case "TwoColumn":
          this.renderTemplates.push( html`<two-column .pConn=${child}></two-column>` );
          break;
  
        case "TwoColumnPage":
          this.renderTemplates.push( html`<two-column-page .pConn=${child}></two-column-page>` );
          break;

        case "URL":
          this.renderTemplates.push( html`<url-form .pConn=${child}></url-form>` );
          break;

        case "UserReference":
          this.renderTemplates.push( html`<user-reference-form .pConn=${child}></user-reference-form>` );
          break;
  
        case "View":
          this.renderTemplates.push( html`<view-component .pConn=${child}></view-component>` );
          break;

        case "ViewContainer":
          this.renderTemplates.push( html`<view-container .pConn=${child}></view-container>` );
          break;
    
        case "WideNarrowPage":
          this.renderTemplates.push( html`<wide-narrow-page .pConn=${child}></wide-narrow-page>` );
          break;
  
          default:
          this.renderTemplates.push( html`<p>${this.theComponentName}: wants to render [${childType}]</p>` );
          break;
      }
    }

  }

  /**
   * iterates over this.children and returns an array of templates where each entry in the array
   * represents a child of this compononent
   */
  getChildTemplateArray(displayOnlyFA: boolean = false) {
    let theChildTemplates: Array<Object> = [];

    // iterate over the children, pushing appropriate templates onto the renderTemplates array
    if (this.children === null) {
      if (this.bLogging) {
        // Typically, this is expected for some use cases (DefaultForm, etc.) but this
        //  message can be useful during debugging if your component is expecting to have children.
        console.log(`--> ${this.theComponentName}: getChildTemplateArray: when this.children === null !!!`);
      }

      return theChildTemplates;
    }
    
    for (var child of this.children) {
      const childPConn = child.getPConnect();
      const childType = childPConn.getComponentName();
      if (this.bLogging) { console.log( `----> ${this.theComponentName} getChildTemplateArray adding: ${childType}`); }

      if (displayOnlyFA) {
        switch (childType) {
          case "CaseView":
            theChildTemplates.push( html`<div class='psdk-case-view'><case-view .pConn=${child} ?dislayOnlyFA=${displayOnlyFA}></case-view></div>` );
            break;
          case "FlowContainer":
            theChildTemplates.push( html`<flow-container .pConn=${child}></flow-container>` );
            break;
          case "Region":
            theChildTemplates.push( html`<region-component .pConn=${child}></region-component>` );
            break;
          case "ViewContainer":
            theChildTemplates.push( html`<view-container .pConn=${child} ?dislayOnlyFA=${displayOnlyFA}></view-container>` );
            break;
          case "View":
            theChildTemplates.push( html`<view-component .pConn=${child} ?dislayOnlyFA=${displayOnlyFA}></view-component>` );
            break;

          default:
            theChildTemplates.push( html`<p>${this.theComponentName}: displayFAOnly - wants to render [${childType}]</p>` );
            break;
  
        }
      }
      else {
        switch (childType) {
          case "AppAnnouncement":
            theChildTemplates.push( html`<app-announcement .pConn=${child}></app-announcement>` );
            break;
  
          case "AppShell":
            theChildTemplates.push( html`<div class='appshell-main'><app-shell .pConn=${child}></app-shell></div>` );
            break;
            
          case "Attachment":
            theChildTemplates.push( html`<attachment-component .pConn=${child}></attachment-component>` );
            break;
  
          case "AutoComplete":
            theChildTemplates.push( html`<autocomplete-form .pConn=${child}></autocomplete-form>` );
            break;

          case "CaseHistory":
            theChildTemplates.push( html`<case-history-widget .pConn=${child}></case-history-widget>` );
            break;

          case "CaseOperator":
            theChildTemplates.push( html`<case-operator-widget .pConn=${child}></case-operator-widget>` );
            break;
    
          case "CaseSummary":
            theChildTemplates.push( html`<case-summary-template .pConn=${child}></case-summary-template>` );
            break;
    
          case "CaseView":
            theChildTemplates.push( html`<div class='psdk-case-view'><case-view .pConn=${child}></case-view></div>` );
            break;
  
          case "Checkbox":
            theChildTemplates.push( html`<check-box-form .pConn=${child}></check-box-form>` );
            break;
  
          case "Currency":
            theChildTemplates.push(html`<currency-form .pConn=${child}></currency-form>`);
            break;
  
          case "Date":
            theChildTemplates.push(html`<date-form .pConn=${child}></date-form>`);
            break;
  
          case "DateTime":
            theChildTemplates.push(html`<datetime-form .pConn=${child}></datetime-form>`);
            break;            
  
          case "Decimal":
            theChildTemplates.push(html`<decimal-form .pConn=${child}></decimal-form>`);
            break;  

          case "DefaultForm":
              theChildTemplates.push( html`<default-form-compoent .pConn=${child}></default-form-compoent>` );
              break; 

          case "DeferLoad":
            theChildTemplates.push( html`<defer-load-component .pConn=${child}></defer-load-component>` );
            break;
  
          case "Dropdown":
            theChildTemplates.push( html`<dropdown-form .pConn=${child}></dropdown-form>` );
            break;
  
          case "Email":
            theChildTemplates.push( html`<email-form .pConn=${child}></email-form>` );
            break;
  
          case "FlowContainer":
            theChildTemplates.push( html`<flow-container .pConn=${child}></flow-container>` );
            break;
  
          case "FormattedText":
            theChildTemplates.push( html`<formatted-text-form .pConn=${child}></formatted-text-form>` );
            break;

          case "Integer":
            theChildTemplates.push( html`<integer-form .pConn=${child}></integer-form>` );
            break;

          case "ListPage":
            theChildTemplates.push( html`<list-page-component .pConn=${child}></list-page-component>` );
            break;
    
          case "ListView":
            theChildTemplates.push( html`<list-view-component .pConn=${child}></list-view-component>` );
            break;
  
          case "OneColumn":
            theChildTemplates.push( html`<one-column .pConn=${child}></one-column>` );
            break;

          case "Percentage":
            theChildTemplates.push( html`<percentage-form .pConn=${child}></percentage-form>` );
            break;
            
          case "Phone":
            theChildTemplates.push( html`<phone-form .pConn=${child}></phone-form>` );
            break;
          
          case "Pulse":
            theChildTemplates.push( html`<pulse-component .pConn=${child}></pulse-component>` );
            break;
  
          case "RadioButtons":
            theChildTemplates.push( html`<radio-buttons-form .pConn=${child}></radio-buttons-form>` );
            break;
            
          case "Reference":
          case "reference":
            theChildTemplates.push( html`<reference-component .pConn=${child}></reference-component>` );
            break;
              
          case "Region":
            theChildTemplates.push( html`<region-component .pConn=${child}></region-component>` );
            break;
  
          case "SimpleTableSelect":
            theChildTemplates.push( html`<simple-table-select .pConn=${child}></simple-table-select>`);
            break;

          case "Stages":
            theChildTemplates.push( html`<stages-component .pConn=${child}></stages-component>` );
            break;
  
          case "Text":
            theChildTemplates.push( html`<text-form .pConn=${child}></text-form>` );
            break;
  
          case "TextArea":
            theChildTemplates.push( html`<text-area-form .pConn=${child}></text-area-form>` );
            break;

          case "TextContent":
            theChildTemplates.push( html`<text-content-form .pConn=${child}></text-content-form>` );
            break;
        
          case "TextInput":
            theChildTemplates.push( html`<text-input-form .pConn=${child}></text-input-form>` );
            break;

          case "Time":
            theChildTemplates.push(html`<time-form .pConn=${child}></time-form>`);
            break;    
    
          case "ToDo":    // Special case of looking for either capitalization
          case "Todo":
            theChildTemplates.push( html`<todo-component .pConn=${child}></todo-component>` );
            break;
  
          case "TwoColumn":
            theChildTemplates.push( html`<two-column .pConn=${child}></two-column>` );
            break;
      
          case "TwoColumnPage":
            theChildTemplates.push( html`<two-column-page .pConn=${child}></two-column-page>` );
            break;
    
          case "URL":
            theChildTemplates.push( html`<url-form .pConn=${child}></url-form>` );
            break;
    
          case "UserReference":
            theChildTemplates.push( html`<user-reference-form .pConn=${child}></user-reference-form>` );
            break;

          case "View":
            theChildTemplates.push( html`<view-component .pConn=${child}></view-component>` );
            break;
  
          case "ViewContainer":
            theChildTemplates.push( html`<view-container .pConn=${child}></view-container>` );
            break;
      
          case "WideNarrowPage":
            this.renderTemplates.push( html`<wide-narrow-page .pConn=${child}></wide-narrow-page>` );
            break;
      
          default:
            theChildTemplates.push( html`<p>${this.theComponentName}: wants to render [${childType}]</p>` );
            break;
        }

      }

    
    }

    return theChildTemplates;
  }

  /**
   * Returns the appropriate template literal for the requested (Pega template component.
   * It uses this component's thePConnect as .pConn
   * @param inTemplate the Requested template
   */
  getTemplateForTemplate(inTemplate: String, inPConnToUse: any, displayOnlyFA: boolean = false) {
    if (this.bDebug){ debugger; }
    if (this.bLogging) { console.log( `----> ${this.theComponentName} getTemplateForTemplate adding: ${inTemplate}`); }

    let theTemplateForTemplate = nothing;
    switch (inTemplate) {
      case "CaseSummary":
        theTemplateForTemplate = html`<case-summary-template .pConn=${inPConnToUse}></case-summary-template>` ;
        break;

      case "CaseView":
        theTemplateForTemplate = html`<case-view .pConn=${inPConnToUse} ?displayOnlyFA="${displayOnlyFA}"></case-view>` ;
        break;

      case "DataReference":
        theTemplateForTemplate = html`<data-reference-component .pConn=${inPConnToUse}></data-reference-component>`;
        break;

      case "DefaultForm":
        theTemplateForTemplate = html`<default-form-component .pConn=${inPConnToUse}></default-form-component>`;
        break;        

      case "Details":
        theTemplateForTemplate = html`<details-component .pConn=${inPConnToUse}></details-component>`;
        break;

      case "DetailsTwoColumn":
        theTemplateForTemplate = html`<details-two-column-component .pConn=${inPConnToUse}></details-two-column-component>`;
        break;
        
      case "ListPage":
        theTemplateForTemplate = html`<list-page-component .pConn=${inPConnToUse}></list-page-component>` ;
        break;

      case "ListView":
        theTemplateForTemplate = html`<list-view-component .pConn=${inPConnToUse}></list-view-component>`;
        break;

      case "OneColumn":
        theTemplateForTemplate = html`<one-column .pConn=${inPConnToUse}></one-column>`;
        break;

      case "OneColumnTab":
        theTemplateForTemplate = html`<one-column-tab-component .pConn=${inPConnToUse}></one-column-tab-component>`;
        break;
  
      case "TwoColumn":
        theTemplateForTemplate = html`<two-column .pConn=${inPConnToUse}></two-column>`;
        break;

      case "TwoColumnPage":
        theTemplateForTemplate = html`<two-column-page .pConn=${inPConnToUse}></two-column-page>`;
        break;

      case "WideNarrowPage":
        this.renderTemplates.push( html`<wide-narrow-page .pConn=${inPConnToUse}></wide-narrow-page>` );
        break;
          
      default:
        theTemplateForTemplate = html`<boilerplate-component value="${this.baseComponentName}: getTemplateForTemplate doesn't know how to handle ${inTemplate}"></boilerplate-component>`;
        break;

    }

    return theTemplateForTemplate;
  }

  /**
   * Returns the lit-html component associated with the PConnect that's passed in.
   * @param inConfigObj the Constellation component configuration object (typically 
   * returned from createComponent) for which you want to get back the associated 
   * lit-html component. The inConfigObj object is an object with the getPConnect() method
   */
  static getComponentFromConfigObj(inConfigObj: any) {

    try {
      const thePConn = inConfigObj.getPConnect();
      const theComponentName = thePConn.getComponentName();
      let theComp: any = null;
      let theErr = ``;

      switch(theComponentName) {
        case "AppAnnouncement":
          theComp = html`<app-announcement .pConn=${thePConn}></app-announcement>`;
          break;

        case "AppShell":
          theComp = html`<div class='appshell-main'><app-shell .pConn=${thePConn}></app-shell></div>`;
          break;

        case "Attachment":
          theComp = html`<attachment-component .pConn=${thePConn}></attachment-component>`;
          break;

        case "AutoComplete":
          theComp = html`<autocomplete-form .pConn=${thePConn}></autocomplete-form>`;
          break;
                
        case "CaseHistory":
          theComp = html`<case-history-widget .pConn=${thePConn}></case-history-widget>`;
          break;

        case "CaseOperator":
          theComp = html`<case-operator-widget .pConn=${thePConn}></case-operator-widget>`;
          break;
  
        case "CaseSummary":
          theComp = html`<case-summary-template .pConn=${thePConn}></case-summary-template>`;
          break;
  
        case "CaseView":
          theComp = html`<div class='psdk-case-view'><case-view .pConn=${thePConn}></case-view></div>`;
          break;

        case "Checkbox":
          theComp = html`<check-box-form .pConn=${thePConn}></check-box-form>`;
          break;

        case "Currency":
          theComp = html`<currency-form .pConn=${thePConn}></currency-form>`;
          break;
  
        case "Date":
          theComp = html`<date-form .pConn=${thePConn}></date-form>`;
          break;
          
        case "DateTime":
          theComp = html`<datetime-form .pConn=${thePConn}></datetime-form>`;
          break;             

        case "Decimal":
          theComp = html`<decimal-form .pConn=${thePConn}></decimal-form>`;
          break;                   

        case "DefaultForm":
          theComp = html`<default-form-component .pConn=${thePConn}></default-form-component>`;
          break;

        case "DeferLoad":
          theComp = html`<defer-load-component .pConn=${thePConn}></defer-load-component>`;
          break;

        case "Dropdown":
          theComp = html`<dropdown-form .pConn=${thePConn}></dropdown-form>`;
          break;

        case "Email":
          theComp = html`<email-form .pConn=${thePConn}></email-form>`;
          break;

        case "FileUtility":
          theComp = html`<file-utility-component .pConn=${thePConn}></file-utility-component>`;
          break;
  
        case "FlowContainer":
          theComp = html`<flow-container .pConn=${thePConn}></flow-container>`;
          break;

        case "FormattedText":
          theComp = html`<formatted-text-form .pConn=${thePConn}></formatted-text-form>`;
          break;

        case "Integer":
          theComp = html`<integer-form .pConn=${thePConn}></integer-form>`;
          break;

        case "ListPage":
          theComp = html`<list-page-component .pConn=${thePConn}></list-page-component>`;
          break;

        case "ListView":
          theComp = html`<list-view-component .pConn=${thePConn}></list-view-component>`;
          break;
                        
        case "OneColumn":
          theComp = html`<one-column .pConn=${thePConn}></one-column>`;
          break;
      
        case "Percentage":
          theComp = html`<percentage-form .pConn=${thePConn}></percentage-form>`;
          break;

        case "Phone":
          theComp = html`<phone-form .pConn=${thePConn}></phone-form>`;
          break;
  
        case "Pulse":
          theComp = html`<pulse-component .pConn=${thePConn}></pulse-component>`;
          break;

        case "RadioButtons":
          theComp = html`<radio-buttons-form .pConn=${thePConn}></radio-buttons-form>`;
          break;
            
        case "Reference":
        case "reference":
          theComp = html`<reference-component .pConn=${thePConn}></reference-component>`;
          break;
              
        case "Region":
          theComp = html`<region-component .pConn=${thePConn}></region-component>`;
          break;

        case "SimpleTableSelect":
          theComp = html`<simple-table-select .pConn=${thePConn}></simple-table-select>`;
          break;

        case "Text":
          theComp = html`<text-form .pConn=${thePConn}></text-form>`;
          break;

        case "TextArea":
          theComp = html`<text-area-form .pConn=${thePConn}></text-area-form>`;
          break;

        case "TextContent":
          theComp = html`<text-content-form .pConn=${thePConn}></text-content-form>`;
          break;

        case "TextInput":
          theComp = html`<text-input-form .pConn=${thePConn}></text-input-form>`;
          break;

        case "Time":
          theComp = html`<time-form .pConn=${thePConn}></time-form>`;
          break;  

        case "ToDo":    // Special case of looking for either capitalization
        case "Todo":
          theComp = html`<todo-component .pConn=${thePConn}></todo-component>`;
          break;

        case "TwoColumn":
          theComp = html`<two-column .pConn=${thePConn}></two-column>`;
          break;
  
        case "TwoColumnPage":
          theComp = html`<two-column-page .pConn=${thePConn}></two-column-page>`;
          break;

        case "URL":
          theComp = html`<url-form .pConn=${thePConn}></url-form>`;
          break;

        case "UserReference":
          theComp = html`<user-reference-form .pConn=${thePConn}></user-reference-form>`;
          break;
  
        case "View":
          theComp = html`<view-component .pConn=${thePConn}></view-component>`;
          break;

        case "ViewContainer":
          theComp = html`<view-container .pConn=${thePConn}></view-container>`;
          break;
    
        case "WideNarrowPage":
          theComp = html`<wide-narrow-page .pConn=${thePConn}></wide-narrow-page>`;
          break;
  
        default:
          theErr = `BridgeBase getComponentFromConfigObj wants to render ${theComponentName}: not in switch statement`;
          console.error(theErr);
          theComp = html`<p>${theErr}</p>`;
          break;        

      }
  
      return theComp;
  
    }
    catch(err) {
      const catchErr = `BridgeBase.getComponentFromConfigObj: invalid inConfigObj: ${JSON.stringify(inConfigObj)}`
      console.error(catchErr);
      return html`<p>${catchErr}</p>`;
    }

  }


  // Writes a console.log of the current component's children types
  logChildren() {
    let childTypes: Array<String> = [];
    let theChildrenAsString = "";

    if (!this.children) {
      theChildrenAsString = "none"
    } else {
      for (var child of this.children) {
        const childPConn = child.getPConnect();
        const childType = childPConn.getComponentName();
  
        childTypes.push(childType);
      }
      theChildrenAsString = JSON.stringify(childTypes);
  
    }

    console.log(`----> logChildren: ${this.theComponentName}: children: ${theChildrenAsString}`);
  }



  // Utility to determine if a JSON object is empty
  isEmptyObject(inObj: Object): Boolean {
    var key: String;
    for (key in inObj) { return false; }
    return true;
  }


  consoleKidDump(pConn: any, level: number = 1, kidNum: number = 1) {

    let sDash = "";
    for (var i =0; i < level; i++) {
      sDash = sDash.concat("-");
    }
    console.log(sDash + "level " + level + " component(" + kidNum + "):" + pConn.getComponentName());
    if (pConn.getConfigProps() != null) {
      console.log(sDash + "configProps:" + JSON.stringify(pConn.getConfigProps()));

    }
    if (pConn.getRawMetadata() != null) {
      console.log(sDash + "rawMetadata:" + JSON.stringify(pConn.getRawMetadata()));
      
    }

    if (pConn.hasChildren() && pConn.getChildren() != null) {
      console.log(sDash + "kidCount:" + pConn.getChildren().length);
      let kids = pConn.getChildren();
      for (let index in kids) {
        let kid = kids[index];
        this.consoleKidDump(kid.getPConnect(), level + 1, parseInt(index) + 1);
      }
    }
    


  }

}