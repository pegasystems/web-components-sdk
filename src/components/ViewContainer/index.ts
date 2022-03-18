import { html, customElement, property, nothing } from '@lion/core';
import { BridgeBase } from '../../bridge/BridgeBase';


// NOTE: you need to import ANY component you may render.
import '../NotSupported';
import '../Region';
import '../templates/CaseView';
import '../templates/ListPage';
import '../templates/OneColumn';
import '../Boilerplate';
import '../designSystemExtension/ProgressIndicator';

// import the component's styles
import { viewContainerStyles } from './view-container-styles';


// Declare that PCore will be defined when this code is run
declare var PCore: any;

//
// WARNING:  It is not expected that this file should be modified.  It is part of infrastructure code that works with 
// Redux and creation/update of Redux containers and PConnect.  Modifying this code could have undesireable results and
// is totally at your own risk.
//

@customElement('view-container')
class ViewContainer extends BridgeBase {
  @property( {attribute: true, type: Boolean} ) displayOnlyFA = false; 

  @property( {attribute: false, type: String} ) templateName;
  @property({attribute: false, type: String}) title:string = `${this.theComponentName}: placeholder`;
  @property( {attribute: false, type: String} ) theBuildName;
  @property( {attribute: false, type: String} ) context;
  // JA - created object is now a View with a Template
  //  Use its PConnect to render the CaseView; DON'T replace this.pConn$
  @property( {attribute: false, type: Object} ) createdViewPConn;

  @property({attribute: false, type: String}) routingInfo = "default value";

  state: any;


  constructor() {    //  Note: BridgeBase constructor has 2 optional args:
    //  1st: inDebug - sets this.bLogging: false if not provided
    //  2nd: inLogging - sets this.bLogging: false if not provided.
    //  To get started, we set both to true here. Set to false if you don't need debugger or logging, respectively.
    super(false, false);
    if (this.bLogging) { console.log(`${this.theComponentName}: constructor`); }
    if (this.bDebug){ debugger; }

    this.pConn = {};
  }

  connectedCallback() {



    super.connectedCallback();
    if (this.bLogging) { console.log(`${this.theComponentName}: connectedCallback`); }
    if (this.bDebug){ debugger; }

    // Add this component's styles to the array of templates to render
    this.theComponentStyleTemplate = viewContainerStyles;

    //NOTE: Need to bind the callback to 'this' so it has this element's context when it's called.
    this.registerAndSubscribeComponent(this.onStateChange.bind(this));


    const configProps = this.thePConn.getConfigProps();
    this.templateName = ('template' in configProps) ? configProps["template"] : "";
    let { loadingInfo, limit, mode } = configProps;
    if (this.bLogging) { console.log(`--> ${this.theComponentName} - templateName: ${this.templateName}`); }
    this.title = ('title' in configProps) ? configProps["title"] : "";
    this.theBuildName = this.buildName();
    const { CONTAINER_TYPE, APP } = PCore.getConstants();

    this.thePConn.isBoundToState();

   
    const containerMgr = this.thePConn.getContainerManager();

    this.prepareDispatchObject = this.prepareDispatchObject.bind(this);

    const dispatchObject = this.prepareDispatchObject();

    this.state = {
      dispatchObject,
      // PCore is defined in pxBootstrapShell - eventually will be exported in place of constellationCore
      visible: !PCore.checkIfSemanticURL(),
      loadingInfo,
      isLoadingInfoChange: false
    };


    // unlike React, have to initializeContainer after we create a dispatchObject and state, otherwise, when calling
    // initializeContainer before, code will get executed that needs state that wasn't defined.

    containerMgr.initializeContainers({
      type:
        mode === CONTAINER_TYPE.MULTIPLE
          ? CONTAINER_TYPE.MULTIPLE
          : CONTAINER_TYPE.SINGLE
    });

    if (mode === CONTAINER_TYPE.MULTIPLE && limit) {
      /* NOTE: setContainerLimit use is temporary. It is a non-public, unsupported API. */
      PCore.getContainerUtils().setContainerLimit(`${APP.APP}/${name}`, limit);
    }

    


    if (this.thePConn.getMetadata()["children"]) {
      containerMgr.addContainerItem(dispatchObject);
    }

  }

  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();
    if (this.bLogging) { console.log(`${this.theComponentName}: disconnectedCallback`); }

  }


  /**
   *  After calling registerAndSubscribe, this function is called whenever
   *  the store changes.  
   */
  onStateChange() {
    super.onStateChange();
    if (this.bLogging) { console.log(`${this.theComponentName}: onStateChange`); }
    if (this.bDebug){ debugger; }

    const bShouldUpdate = super.shouldComponentUpdate();

    if (bShouldUpdate) {  
      this.updateSelf();
    }
  } 


  /**
   * updateSelf
   */
  updateSelf() {
    if (this.bLogging) { console.log(`${this.theComponentName}: updateSelf`); }
    if (this.bDebug){ debugger; }

    //  ORIGINAL CODE from Chandra code, etc.
    // const activeContainer = PCore.getContainerUtils().getActiveContainerItemContext("app/primary");
    // const routingInfo = PCore.getContainerUtils().getContainerItemData('app/primary', activeContainer);

    // const thePropValRoutingInfo = this.getComponentProp("routingInfo");
    // if (this.bLogging) { console.log(`thePropValRoutingInfo: ${JSON.stringify(thePropValRoutingInfo)}`); }
    
    // if (routingInfo !== null) {
    //   if (this.bLogging) { console.log(`routingInfo: ${JSON.stringify(routingInfo)}`); }
    //   this.routingInfo = JSON.stringify(routingInfo);
    // }

    if (this.children == null) {
      this.children = this.thePConn.getChildren();
    }
 
    const routingInfo = this.getComponentProp("routingInfo");
    const loadingInfo = this.getComponentProp("loadingInfo");
    if (this.bLogging) { console.log(`${this.theComponentName}: routingInfo prop: ${JSON.stringify(routingInfo)} | loadingInfo: ${loadingInfo}`); }


    const buildName = this.buildName();
    const { CREATE_DETAILS_VIEW_NAME } = PCore.getConstants();
    if (routingInfo) {
      const { accessedOrder, items } = routingInfo;
      if (accessedOrder && items) {
        const key = accessedOrder[accessedOrder.length - 1];
        let componentVisible = accessedOrder.length > 0;
        const { visible } = this.state;
        componentVisible = visible || componentVisible;
        if (
          items[key] &&
          items[key].view &&
          Object.keys(items[key].view).length > 0
        ) {
          const latestItem = items[key];
          const rootView = latestItem.view;
          const { context, name: viewName } = rootView.config;
          const config = { meta: rootView };
          config["options"] = {
            context: latestItem.context,
            pageReference: context || this.thePConn.getPageReference(),
            containerName: this.thePConn.getContainerName(),
            containerItemName: key,
            hasForm: viewName === CREATE_DETAILS_VIEW_NAME
          };
          const configObject = PCore.createPConnect(config);

          // THIS is where the ViewContainer creates a View
          //    The config has meta.config.type = "view"
          const newComp = configObject.getPConnect();
          const newCompName = newComp.getComponentName();
          // The metadata for pyDetails changed such that the "template": "CaseView"
          //  is no longer a child of the created View but is in the created View's
          //  config. So, we DON'T want to replace this.pConn$ since the created
          //  component is a View (and not a ViewContainer). We now look for the
          //  "template" type directly in the created component (newComp) and NOT
          //  as a child of the newly created component.
          if (this.bLogging) { console.log(`---> ${this.theComponentName} created new ${newCompName}`); }

          // Use the newly created component (View) info but DO NOT replace
          //  this ViewContainer's pConn$, etc.
          //  Note that we're now using the newly created View's PConnect in the
          //  ViewContainer HTML template to guide what's rendered similar to what
          //  the React return of React.Fragment does
          
          this.createdViewPConn = newComp;
          const newConfigProps = newComp.getConfigProps();
          this.templateName = ('template' in newConfigProps) ? newConfigProps["template"] : "";
          this.title = ('title' in newConfigProps) ? newConfigProps["title"] : "";

          // debugger;     // NOW a reference component!!!

          // update children with new view's children
          // JA experiment. Only replace if the newComp has children!
          //  The new Reference component does NOT have children!
          if (newComp.getChildren() && newComp.getChildren().length > 0) {
            this.children = newComp.getChildren();
          }

          // debugger;     // NOW a reference component!!!

        }
      }
    }


  }  


/**
 * Adapted from Angular SDK
 */
  prepareDispatchObject(): Object {
    const baseContext = this.thePConn.getContextName();
    const { acName = "primary" } = this.thePConn.getContainerName();

    return {
      semanticURL: "",
      context: baseContext,
      acName
    };
  }

  buildName(): string {
    let sContext = this.thePConn.getContextName();
    let sName = this.thePConn.getContainerName();

    return sContext.toUpperCase() + "/" + sName.toUpperCase();
  }




  render(){
    if (this.bLogging) { console.log(`${this.theComponentName}: render with pConn: ${JSON.stringify(this.pConn)}`); }
    if (this.bDebug){ debugger; }

    // To prevent accumulation (and extra rendering) of previous renders, begin each the render
    //  of any component that's a child of BridgeBase with a call to this.prepareForRender();
    this.prepareForRender(this.displayOnlyFA);

    const showLoadingIndicator = this.getComponentProp("loadingInfo");
    if (this.bLogging) { console.log(`${this.theComponentName}: render with showLoadingIndicator: ${showLoadingIndicator}`); }
    // if (showLoadingIndicator) { debugger; }

    // NOTE: We're handling the possible Title and children in the templates below
    let theInnerTemplate = nothing;

    // debugger;

    if (this.templateName !== "") {
      theInnerTemplate = html`
        ${this.getTemplateForTemplate(this.templateName, this.createdViewPConn, this.displayOnlyFA)}
      `;
    } else if (this.displayOnlyFA) {
      theInnerTemplate = html`
        ${this.getChildTemplateArray(this.displayOnlyFA)}
      `;
    } else {
      theInnerTemplate = html`
        ${this.getChildTemplateArray()}
        `;
    }

    const theOuterTemplate = html`
      <div class="psdk-view-container-top" id=${this.theBuildName}>
        ${ (this.title !== "") ? html`<h4>${this.title}</h4>` : nothing }
        <div>${theInnerTemplate}</div>
      </div>
      ${ showLoadingIndicator ? html`
        <div class="progress-box">
          <progress-extension id="${this.theComponentId}"></progress-extension>
        </div>` : nothing }

    `;

    // debugger;

    // Try simplifying to only render the createdViewPConn (that's now a reference)
    const theCreatedRefComponent = html`<reference-component .pConn=${this.createdViewPConn} ?displayOnlyFA=${this.displayOnlyFA}></reference-component>`;

    this.renderTemplates.push(theCreatedRefComponent);
    // was: this.renderTemplates.push(theOuterTemplate);
    

    // NOTE: lit-html knows how to render array of lit-html templates!
    return this.renderTemplates;

    

  }

}

export default ViewContainer;