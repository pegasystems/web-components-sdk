import { html, customElement, property, nothing } from '@lion/core';
import { BridgeBase } from '../../bridge/BridgeBase';
// NOTE: you need to import ANY component you may render.


// Declare that PCore will be defined when this code is run
declare var PCore: any;

// NOTE: this is just a boilerplate component definition intended
//  to be used as a starting point for any new components as they're built out
@customElement('reference-component')
class Reference extends BridgeBase {
  @property( {attribute: true, type: Boolean} ) displayOnlyFA = false; 
  @property( {attribute: false, type: Object} ) resolvedConfigProps = {};
  @property( {attribute: false, type: Function} ) referencedViewComponent = null;

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

    if (!this.pConn.getConfigProps) {
      if (this.pConn.getPConnect()) {
        this.pConn = this.pConn.getPConnect();
      } else {
        console.error(`Reference component: bad pConn: ${JSON.stringify(this.pConn)}`);
      }
    }

    this.resolvedConfigProps = this.pConn.resolveConfigProps( this.pConn.getConfigProps());

    const referenceConfig = { ...this.pConn.getComponentConfig() } || {};

    delete referenceConfig?.name;
    delete referenceConfig?.type;
    delete referenceConfig?.visibility;

    const viewMetadata = this.pConn.getReferencedView();

    if (!viewMetadata) {
      // This happens rarely during some transitions but doesn't seem to have an impact.
      console.warn(`View not found. getComponentConfig(): ${JSON.stringify(this.pConn.getComponentConfig())}`);
      return null;
    }

    const viewObject = {
      ...viewMetadata,
      config: {
        ...viewMetadata.config,
        ...referenceConfig
      }
    };

    // eslint-disable-next-line no-console
    if (this.bLogging) { console.log( `Reference: about to call createComponent with pageReference: context: ${this.resolvedConfigProps["context"]}`); }

    const viewComponent = this.pConn.createComponent(viewObject, null, null, {
        pageReference: this.resolvedConfigProps["context"]
      });

    // updating the referencedComponent should trigger a render
    const newCompPConnect = viewComponent.getPConnect();

    newCompPConnect.setInheritedConfig({
          ...referenceConfig,
          readOnly: this.resolvedConfigProps["readOnly"] ? this.resolvedConfigProps["readOnly"] : false,
          displayMode: this.resolvedConfigProps["displayMode"] ? this.resolvedConfigProps["displayMode"]: null
        }
    );

    // eslint-disable-next-line no-console
    if (this.bLogging) { console.log(`Web Component Reference component: newCompPConnect configProps: ${JSON.stringify(newCompPConnect.getConfigProps())}`); }

    this.referencedViewComponent = newCompPConnect;

//   viewComponent.props.getPConnect().setInheritedConfig({
//     ...referenceConfig,
//     readOnly,
//     displayMode
//   });

//   // eslint-disable-next-line no-console
//   console.log(`React Reference component: viewComponent configProps: ${JSON.stringify(viewComponent.props.getPConnect().getConfigProps())}`);


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

  getComponentToRender() {
    if (this.bLogging) { console.log(`Reference: getComponentToRender: displayOnlyFA: ${this.displayOnlyFA}`); }

    if (this.bLogging) {
      const theRefViewComp: any = this.referencedViewComponent;

      if (theRefViewComp) {
        console.log(`Reference: this.referencedViewComponent: ${JSON.stringify(theRefViewComp?.getConfigProps())}`);
      } else {
        console.log(`Reference: this.referencedViewComponent is NULL`);
      }      
    }
    
    const viewContent = this.referencedViewComponent
      ? html`<view-component .pConn=${this.referencedViewComponent} ?displayOnlyFA=${this.displayOnlyFA}></view-component>`
      : nothing;

    return viewContent;

  }

  render(){
    if (this.bLogging) { console.log(`${this.theComponentName}: render with pConn: ${JSON.stringify(this.pConn)}`); }
    if (this.bDebug){ debugger; }

    // To prevent accumulation (and extra rendering) of previous renders, begin each the render
    //  of any component that's a child of BridgeBase with a call to this.prepareForRender();
    this.prepareForRender(this.displayOnlyFA);
    

    this.renderTemplates.push( this.getComponentToRender() );

    this.addChildTemplates();

    return this.renderTemplates;

  }

}


// React implementation
// export default function Reference(props) {
//   const { visibility, context, getPConnect, readOnly, displayMode } = props;

//   const pConnect = getPConnect();
//   const referenceConfig = { ...pConnect.getComponentConfig() } || {};

//   delete referenceConfig?.name;
//   delete referenceConfig?.type;
//   delete referenceConfig?.visibility;

//   const viewMetadata = pConnect.getReferencedView();

//   if (!viewMetadata) {
//     // console.log("View not found ", pConnect.getComponentConfig());
//     return null;
//   }

//   const viewObject = {
//     ...viewMetadata,
//     config: {
//       ...viewMetadata.config,
//       ...referenceConfig
//     }
//   };

//   // eslint-disable-next-line no-console
//   console.log( `Reference: about to call createComponent with pageReference: context: ${context}`);

//   const viewComponent = pConnect.createComponent(viewObject, null, null, {
//     pageReference: context
//   });

//   viewComponent.props.getPConnect().setInheritedConfig({
//     ...referenceConfig,
//     readOnly,
//     displayMode
//   });

//   // eslint-disable-next-line no-console
//   console.log(`React Reference component: viewComponent configProps: ${JSON.stringify(viewComponent.props.getPConnect().getConfigProps())}`);

//   if (visibility !== false) {
//     return <React.Fragment>{viewComponent}</React.Fragment>;
//   }
//   return null;
// }

export default Reference;