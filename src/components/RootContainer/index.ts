import { html, customElement, property } from '@lion/core';
import { BridgeBase } from '../../bridge/BridgeBase';
import '../View';
import '../NotSupported';
import '../ViewContainer';
import '../PreviewViewContainer';
import '../ModalViewContainer';
import '../ReAuthenticationModal';

// Declare that PCore will be defined when this code is run
declare var PCore: any;

@customElement('root-container')
class RootContainer extends BridgeBase {
  @property( {attribute: false, type: Object} ) previewViewContainerConn = null;
  @property( {attribute: false, type: Object} ) modalViewContainerConn = null;
  @property( {attribute: false, type: Object} ) createdPConnect;
  @property( {attribute: true, type: Boolean} ) displayOnlyFA = false; 


  componentName: string = "";
  newPConn: any;

  constructor() {
    //  Note: BridgeBase constructor has 2 optional args:
    //  1st: inDebug - sets this.bLogging: false if not provided
    //  2nd: inLogging - sets this.bLogging: false if not provided.
    //  To get started, we set both to true here. Set to false if you don't need debugger or logging, respectively.
    super(false, false);
    if (this.bLogging) { console.log(`${this.theComponentName}: constructor`); }
    if (this.bDebug){ debugger; }

    this.pConn = {};
    this.createdPConnect = null;
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.bLogging) { console.log(`${this.theComponentName}: connectedCallback`); }
    if (this.bDebug){ debugger; }

    // Adapted from Angular SDK
    const options = { context: "app" };

    const { containers } = PCore.getStore().getState();
    const items = Object.keys(containers).filter((item) =>
      item.includes("root")
    );
    PCore.getContainerItems().addContainerItems(items);

    const configObjPreview = PCore.createPConnect({
      meta: {
        type: "PreviewViewContainer",
        config: {
          name: "preview"
        }
      },
      options
    });

    this.previewViewContainerConn = configObjPreview.getPConnect();


    const configObjModal = PCore.createPConnect({
      meta: {
        "type": "ModalViewContainer",
        "config": {
          "name": "modal"
        }
      },
      options: {
        "pageReference": "pyPortal",
        "context": "app"
      }
    });

    // becasue of Web Component frame work not calling constructor when root container updates, need to tell
    // flow container when to init
    window.sessionStorage.setItem("okToInitFlowContainer", "true");

    this.modalViewContainerConn = configObjModal.getPConnect();

    //NOTE: Need to bind the callback to 'this' so it has this element's context when it's called.
    this.registerAndSubscribeComponent(this.onStateChange.bind(this));
    
  }


  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback()
    if (this.bLogging) { console.log(`${this.theComponentName}: disconnectedCallback`); }
    if (this.bDebug){ debugger; }

  }
  

  /**
   * updateSelf
   */
  updateSelf() {
    if (this.bLogging) { console.log(`${this.theComponentName}: updateSelf`); }
    if (this.bDebug){ debugger; }

    // need to call this.getCurrentCompleteProps (not this.thePConn.getConfigProps) 
    //  to get full set of props that affect this component in Redux
    const myProps: any = this.getCurrentCompleteProps();

    const renderingModes = ["portal", "view"];
    const noPortalMode = "noPortal";
    const options = { context: "app" };

    //const { renderingMode, viewConfig, children, skeleton } = myProps;
    const {
      renderingMode,
      viewConfig,
      children,
      skeleton,
      /* httpMessages, */
      routingInfo
    } = myProps;

    if (this.bLogging) { console.log(`${this.theComponentName}: updateSelf with myProps: ${JSON.stringify(myProps)}`); }

    if (routingInfo && renderingModes.includes(renderingMode)) {
      const { accessedOrder, items } = routingInfo;
      if (accessedOrder && items) {
        const key = accessedOrder[accessedOrder.length - 1];
        if (
          items[key] &&
          items[key].view &&
          Object.keys(items[key].view).length > 0
        ) {
          const itemView = items[key].view;

          const rootObject: any = PCore.createPConnect({
            meta: itemView,
            options: {
              context: items[key].context
            }
          });
    
          //this.createdPConnect = rootObject;
          this.newPConn = rootObject.getPConnect();
          //const thePConnComponentName = this.createdPConnect.getPConnect().getComponentName();
          this.componentName = this.newPConn.getComponentName();

          //if (this.bLogging) { console.log(`${this.theComponentName}: created ${thePConnComponentName}`); }
        }      
      }
    } else if (renderingMode == noPortalMode) { 

      // becasue of Web Component frame work not calling constructor when root container updates, need to tell
      // flow container when to init
      window.sessionStorage.setItem("okToInitFlowContainer", "true");
      
      const theChildren = this.children;
      if (theChildren && (theChildren.length == 1)) {
        //this.createdPConnect =  theChildren[0];
        //this.createdPConnect = null;
        let localPConn = theChildren[0].getPConnect();
        this.newPConn = this.thePConn;

        this.componentName = localPConn.getComponentName();

        //if (this.bLogging) { console.log(`${this.theComponentName}: has child ${this.createdPConnect.getPConnect().getComponentName()}`); }
      }

    
    } else if (children && children.length > 0) {
      //return <div id="root-container">{children}</div>;

      // currently we never get here, but we should get here for mashup
      alert("here with children: " + children);
    } else if (skeleton !== undefined) {
      if (this.bLogging) { console.log(`${this.theComponentName}: updateSelf: skeleton !== undefined`); }
      // TODO: need to update once skeletons are available;
      //const LoadingComponent = LazyComponentMap[skeleton];
      //return <LoadingComponent />;
      //alert("skeleton");

      //
      //I believe we should turn on the spinner here.  We should
      // check if spinner is already on and if no, turn on.  We should
      // check so we don't keep update the boolean and cause an angular error
      //
    // } else if (renderingMode === "noPortal") {
    //   // makes sure Angular tracks these changes
    //   this.ngZone.run(() => {
    //     this.pConn$ = this.pConn$.getChildren()[0].getPConnect();
    //     this.componentName$ = this.pConn$.getComponentName();
    //   });

    } else {
      alert("didn't match any tests");
      //return null;
    }

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

  getRootHtml() :any {

    let arKidHtml: Array<Object> = [];
    // modalviewcontainer and hybridviewcontainer are handled elsewhere
    switch (this.componentName) {
      case "View" :
        arKidHtml.push(html`<view-component .pConn=${this.newPConn} ?displayOnlyFA=${this.displayOnlyFA}></view-component>`);
        break;
      case "ViewContainer":
        arKidHtml.push(html`<view-container .pConn=${this.newPConn} ?displayOnlyFA=${this.displayOnlyFA}></view-container>`);
        break;
    }

    return arKidHtml;

  }

  render(){
    if (this.bLogging) { console.log(`${this.theComponentName}: render with pConn: ${JSON.stringify(this.pConn)}`); }
    if (this.bDebug){ debugger; }

    // To prevent accumulation (and extra rendering) of previous renders, begin each the render
    //  of any component that's a child of BridgeBase with a call to this.prepareForRender();
    this.prepareForRender();

    if (this.createdPConnect !== null) {
      if (this.children === null) {
        // initialize if necessary
        this.children = [];
      }

      // push the created PConnect onto this.children
      this.children.push( this.createdPConnect );
    } else if (this.children === null) {
      if (this.bLogging) { console.log(`${this.theComponentName}: nothing to render`); }
    } else {

      // Otherwise, we're just going to expect that the RootContainer has children
      //  and we'll let the children be rendered with the call to addChildTemplates below...

    }

    // Adapted from Angular SDK - add previewViewContainer and modalViewContainer if they exist...
    if (this.previewViewContainerConn) {
      this.renderTemplates.push( html`<preview-view-container .pConn=${this.previewViewContainerConn}></preview-view-container>`);
    }

    if (this.modalViewContainerConn) {
      this.renderTemplates.push( html`<modal-view-container-component .pConn=${this.modalViewContainerConn}></modal-view-container-component>`);
    }

    // iterate over the children, pushing appropriate templates onto the renderTemplates array
    //this.addChildTemplates();
    this.renderTemplates.push( html`${this.getRootHtml()}`);

    // always add the ReAuthenticationModal
    this.renderTemplates.push( html`<reauthentication-modal-component></reauthentication-modal-component>`);

    return this.renderTemplates;

  }

}

export default RootContainer;