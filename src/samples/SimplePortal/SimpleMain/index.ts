import { html, customElement, property, LitElement } from '@lion/core';
import { SdkConfigAccess } from '../../../helpers/config_access';

import '@lion/button/define';
import '@lion/textarea/define';
import '../../../components/OAuthLogin/oauth-login';
import '../../../components/OAuthLogin/oauth-popup';
import { compareSdkPCoreVersions } from '../../../helpers/versionHelpers';

import '../SimpleSideBar';

// NOTE: you need to import ANY component you may render.

// import the component's styles as HTML with <style>
import { simpleMainStyles } from './simple-main-styles';




// Declare that PCore will be defined when this code is run
declare var PCore: any;
declare var myLoadMashup: any;

@customElement('simple-main-component')
class SimpleMain extends LitElement {


  @property( {attribute: false, type: Object } ) props; 
  @property( {attribute: false, type: Boolean } ) bHasPConnect = false; 
  @property( {attribute: false, type: Boolean}) bShowRoot = false;

  arCreateButtons: Array<any> = [];
  arOpenWorkItems: Array<any> = [];

  // NOTE: SimpleMain is NOT derived from BridgeBase; just derived from LitElement
  constructor() {
    super();

  }

  connectedCallback() {
    super.connectedCallback();

    this.startMashup();

    PCore.getPubSubUtils().subscribe(
      PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL,
      () => { this.cancelAssignment() },
      "cancelAssignment"
    );

    PCore.getPubSubUtils().subscribe(
      "assignmentFinished",
      () => { this.assignmentFinished() },
      "assignmentFinished"
    );

    PCore.getPubSubUtils().subscribe(
      "showWork",
      () => { this.showWork() },
      "showWork"
    );

  }


  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();

    PCore.getPubSubUtils().unsubscribe(
      PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL,
      "cancelAssignment"
    );

    PCore.getPubSubUtils().unsubscribe(
      "assignmentFinished",
      "assignmentFinished"
    );

    PCore.getPubSubUtils().unsubscribe(
      "showWork",
      "showWork"
    );
  }


  showWork() {
    this.bShowRoot = true;
  }

  cancelAssignment() {

    setTimeout(() => {
      this.bShowRoot = false;
    });

  }

  assignmentFinished() {

    setTimeout(() => {
      this.bShowRoot = false;
    });
  }

  getToolbarHtml() : any {
    const tBHtml = html `
      <div class="psdk-toolbar">
        <h1>Simple Portal</h1>
      </div>
    `;

    return tBHtml;
  }

  getNavigationHtml(): any {
    let sDisplay = this.bShowRoot? "block" : "none";
    const nHtml = html`
    <div class="psdk-main">
    <aside class="psdk-aside">
      <simple-side-bar-component .pConn="${this.props}" .arButtons="${this.arCreateButtons}" .arWorkItems="${this.arOpenWorkItems}"></simple-side-bar-component>
    </aside>
    <main class="psdk-main-root">
      <root-container .pConn="${this.props}" style="display:${sDisplay}" ?isMashup="${true}"></root-container>
    </main>
    </div>
    `;

    return nHtml;

  }

  async firstUpdated() {
    const serverUrl = SdkConfigAccess.getSdkConfigServer().infinityRestServerUrl;
    
    await fetch ( serverUrl + "/api/v1/casetypes" ,
        {
          method: 'GET',
          headers: {
            'Content-Type' : 'application/json',
            'Authorization' : 'Bearer ' + window.sessionStorage.getItem("accessToken"),
          },
        })
      .then( r => r.json())
      .then ( async data => {
        let arCaseTypes = data.caseTypes;

        this.getCaseTypeButtons(arCaseTypes);

        await fetch ( serverUrl + "/api/v1/data/D_Worklist?Work=true",
            {
              method: 'GET',
              headers: {
                'Content-Type' : 'application/json',
                'Authorization' : 'Bearer ' + window.sessionStorage.getItem("accessToken"),
              },

            })
          .then( r => r.json())
          .then ( async data => {
            let results = data.pxResults;

            this.getWorkItems(results);

            this.requestUpdate();
          })
          

      })
  }


  getCaseTypeButtons(arCaseTypes: Array<any>) {

    this.arCreateButtons = new Array();

    for (let myCase of arCaseTypes) {
      if (myCase.CanCreate == "true") {
        let oPayload = {};
        oPayload["caseTypeID"] = myCase.ID;
        oPayload["processID"] = myCase.startingProcesses[0].ID;
        oPayload["caption"] = myCase.name;

        this.arCreateButtons.push(oPayload);

      }
    }
  }

  getWorkItems( results: Array<any>) {

    this.arOpenWorkItems = new Array();

    for (let myWork of results) {
      let oPayload = {};
      oPayload["caption"] = myWork.pxRefObjectInsName + " - " + myWork.pxTaskLabel;
      oPayload["pzInsKey"] = myWork.pzInsKey;
      oPayload["pxRefObjectClass"] = myWork.pxRefObjectClass;

      this.arOpenWorkItems.push(oPayload);
    }
  }


  getSimpleMainHtml() : any {

    const sMHtml: any[] = [];

    sMHtml.push(html `${this.getToolbarHtml()}`);

    if (this.bHasPConnect) {
      sMHtml.push(html `${this.getNavigationHtml()}`);
    }

  


    return sMHtml;
  }


  render(){

    const sContent = this.getSimpleMainHtml();
    const locBootstrap = SdkConfigAccess.getSdkConfigBootstrapCSS();

    let arHtml: any[] = [];

    // SimpleMain not derived from BridgeBase, so we need to load Bootstrap CSS
    arHtml.push( html`<link rel='stylesheet' href='${locBootstrap}'>`);

    arHtml.push(simpleMainStyles);
    arHtml.push(sContent);

    return arHtml;

  }


  /**
   * kick off the Mashup that we're trying to serve up
   */
   startMashup() {
    
    this.bShowRoot = true;

    // NOTE: When loadMashup is complete, this will be called.
    PCore.onPCoreReady(renderObj => {
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

    // eslint-disable-next-line no-undef
    myLoadMashup("pega-root", false);   // this is defined in bootstrap shell that's been loaded already

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

export default SimpleMain;