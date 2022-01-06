import { html, customElement, property, LitElement, nothing } from '@lion/core';
import '../RootContainer';
import '../NotSupported';
import { SdkConfigAccess } from '../../helpers/config_access';
import { compareSdkPCoreVersions } from '../../helpers/versionHelpers';

// Declare that PCore will be defined when this code is run
declare var PCore: any;
declare var myLoadMashup;
declare var myLoadPortal; // Experiment with this


@customElement('app-entry')
class AppEntry extends LitElement {
  @property( {type: String, attribute: false } ) theComponentName = "AppEntry";
  @property( {type: String, attribute: false} ) thePConnComponentName = "";

  // Attribute properties
  @property( {type: Object } ) props;
  // @property( {type: Function, attribute: false} ) pConn$ = () => {}

  bLogging: Boolean = false;

  // NOTE: AppEntry is NOT derived from BridgeBase; just derived from LitElement
  constructor() {
    super();
    if (this.bLogging) { console.log(`${this.theComponentName}: constructor`); }
    this.props = {};
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.bLogging) { console.log(`${this.theComponentName}: connectedCallback`); }

    if (this.bLogging) { console.log(`AppEntry --> loading Portal`); }
    this.startPortal();
    
  }


  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback()

    if (this.bLogging) { console.log(`${this.theComponentName}: disconnectedCallback`); }

  }
  

  /**
   * kick off the application's portal that we're trying to serve up
   */
  startPortal() {
    
    // NOTE: When loadMashup is complete, this will be called.
    PCore.onPCoreReady(renderObj => {
      // Check that we're seeing the PCore version we expect
      compareSdkPCoreVersions();

      this.initialRender(renderObj);
    });

    // load the Portal and handle the onPCoreEntry response that establishes the
    //  top level Pega root element (likely a RootContainer)

    SdkConfigAccess.selectPortal()
    .then( () => {
      const thePortal = SdkConfigAccess.getSdkConfigServer().appPortal;
      myLoadPortal("pega-root", thePortal, []);   // this is defined in bootstrap shell that's been loaded already  
    })

  }


  /**
   * Callback from onPCoreReady that's called once the top-level render object
   * is ready to be rendered
   * @param inRenderObj the initial, top-level PConnect object to render
   */
  initialRender(inRenderObj) {
    if (this.bLogging) { console.log(`${this.theComponentName} renderObj: `, inRenderObj); }

      ////// This was done on login and kicked off the creation of this
      //////  AppEntry. So don't need to to do this.
      // With Constellation Ready, replace <div id="pega-here"></div>
      //  with top-level ViewContainer
      // const replaceMe = document.getElementById("pega-here");
      // const replacement = document.createElement("app-entry");
      // replacement.setAttribute("id", "pega-root");
      // if (replaceMe) { replaceMe.replaceWith(replacement); }

      const { props } = inRenderObj;
      this.props = props;

      this.thePConnComponentName = this.props.getPConnect().getComponentName();

      if (this.bLogging) { console.log(` --> thePConnComponentName: ${this.thePConnComponentName}`); }

  }

  // Utility to determine if a JSON object is empty
  isEmptyObject(inObj: Object): Boolean {
    var key: String;
    for (key in inObj) { return false; }
    return true;
  }  

  render(){
    if (this.bLogging) { console.log(`${this.theComponentName}: render with props - ${JSON.stringify(this.props)}`); }
    
    // NOTE: that also the AppEntry gets its initial config info as "props" from inRenderObj,
    //  we actually pass that to the RootContainer as .pConn
    if (this.isEmptyObject(this.props)) {
      return nothing;
    } else {
      if (this.thePConnComponentName === "RootContainer") {
        return html`
        <!-- <div style='width: fit-content; border: dotted 1px #DDDDDD;'>${this.theComponentName}</div>  -->
        <root-container .pConn=${this.props}></root-container>`;
      } else {
        if (this.bLogging) { console.log( `${this.theComponentName} not known as AppEntry rendered component. So rendering NotSupported`); }
        return html`
          <not-supported>AppEntry got ${this.theComponentName} to render</not-supported>
          `;
      }
    }
  }

}

export default AppEntry;