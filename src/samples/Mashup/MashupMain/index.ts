import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { SdkConfigAccess } from "@pega/auth/lib/sdk-auth-manager";

import "@lion/ui/define/lion-button.js";
import "@lion/ui/define/lion-textarea.js";

import "../MashupMainScreen";
import { compareSdkPCoreVersions } from "../../../helpers/versionHelpers";

// NOTE: you need to import ANY component you may render.

// import the component's styles as HTML with <style>
import { mashupMainStyles } from "./mashup-main-styles";

// Declare that PCore will be defined when this code is run
declare var PCore: any;
declare var myLoadMashup: any;

@customElement("mashup-main-component")
class MashupMain extends LitElement {
  bHasPConnect: boolean = false;

  @property({ attribute: false, type: Object }) props;

  // NOTE: MashupMain is NOT derived from BridgeBase; just derived from LitElement
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();

    this.startMashup();
  }

  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();
  }

  getToolbarHtml(): any {
    const tBHtml = html`
      <div class="cc-toolbar">
        <h1>${PCore.getEnvironmentInfo().getApplicationLabel()}&nbsp;</h1>
        <img src="./assets/img/antenna.svg" class="cc-icon" />
      </div>
    `;

    return tBHtml;
  }

  getMainHtml(): any {
    const mHtml = html`
      <div>
        <mashup-main-screen-component
          .pConn=${this.props}
        ></mashup-main-screen-component>
      </div>
    `;

    return mHtml;
  }

  getMashupMainHtml(): any {
    const mMHtml: Array<any> = [];

    mMHtml.push(html`${this.getToolbarHtml()}`);

    if (this.bHasPConnect) {
      mMHtml.push(html`${this.getMainHtml()}`);
    }

    return mMHtml;
  }

  render() {
    const sContent = this.getMashupMainHtml();
    const locBootstrap = SdkConfigAccess.getSdkConfigBootstrapCSS();

    let arHtml: Array<any> = [];

    // MashupMain not derived from BridgeBase, so we need to load Bootstrap CSS
    arHtml.push(html`<link rel="stylesheet" href="${locBootstrap}" />`);

    arHtml.push(mashupMainStyles);
    arHtml.push(sContent);

    return arHtml;
  }

  /**
   * kick off the Mashup that we're trying to serve up
   */
  startMashup() {
    // NOTE: When loadMashup is complete, this will be called.
    PCore.onPCoreReady((renderObj) => {
      // Check that we're seeing the PCore version we expect
      compareSdkPCoreVersions();

      // Need to register the callback function for PCore.registerComponentCreator
      //  This callback is invoked if/when you call a PConnect createComponent
      PCore.registerComponentCreator((c11nEnv, additionalProps = {}) => {
        // debugger;

        return c11nEnv;

        // REACT implementaion:
        // const PConnectComp = createPConnectComponent();
        // return (
        //     <PConnectComp {
        //       ...{
        //         ...c11nEnv,
        //         ...c11nEnv.getPConnect().getConfigProps(),
        //         ...c11nEnv.getPConnect().getActions(),
        //         additionalProps
        //       }}
        //     />
        //   );
      });

      // Now, do the initial render...
      this.initialRender(renderObj);
    });

    // load the Mashup and handle the onPCoreEntry response that establishes the
    //  top level Pega root element (likely a RootContainer)

    myLoadMashup("pega-root", false); // this is defined in bootstrap shell that's been loaded already
  }

  /**
   * Callback from onPCoreReady that's called once the top-level render object
   * is ready to be rendered
   * @param inRenderObj the initial, top-level PConnect object to render
   */
  initialRender(inRenderObj) {
    ////// This was done on login and kicked off the creation of this
    //////  AppEntry. So don't need to to do this.
    // With Constellation Ready, replace <div id="pega-here"></div>
    //  with top-level ViewContainer
    // const replaceMe = document.getElementById("pega-here");
    // const replacement = document.createElement("app-entry");
    // replacement.setAttribute("id", "pega-root");
    // if (replaceMe) { replaceMe.replaceWith(replacement); }

    this.bHasPConnect = true;

    const { props } = inRenderObj;
    this.props = props;

    // this.thePConnComponentName = this.props.getPConnect().getComponentName();

    // console.log(` --> thePConnComponentName: ${this.thePConnComponentName}`);
  }
}

export default MashupMain;
