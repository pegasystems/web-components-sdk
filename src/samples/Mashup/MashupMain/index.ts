import { html, customElement, property, LitElement } from '@lion/core';
import { SdkConfigAccess } from '@pega/auth/lib/sdk-auth-manager';

import '@lion/button/define';
import '@lion/textarea/define';

import '../MashupMainScreen';
import '../Trade';
import { compareSdkPCoreVersions } from '../../../helpers/versionHelpers';


// NOTE: you need to import ANY component you may render.

// import the component's styles as HTML with <style>
import { mashupMainStyles } from './mashup-main-styles';

// Declare that PCore will be defined when this code is run
declare var PCore: any;
declare var myLoadMashup: any;

@customElement('mashup-main-component')
class MashupMain extends LitElement {

  bHasPConnect: boolean = false;
  
  @property( {attribute: false, type: Object } ) props; 
  @property( {attribute: false, type: Boolean} ) portal = 'UConnect';



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


  getToolbarHtml() : any {
    let tBHtml;
    if(PCore.getEnvironmentInfo().getApplicationLabel() === 'UplusAuto'){
      tBHtml = html `
        <div class="uplus-toolbar margin">
          <button @click=${()=> window.location.reload()}><img src="./assets/img/appName.png" class="uplus-icon"></button>
          <ul>
            <li><button style="${this.portal === 'UConnect' ? "border-bottom: 1px solid"  : "border-bottom: 0"}" @click=${() => { this.openPortal('UConnect') }}>U+ Connect</button></li>
            <li><button style="${this.portal === 'TradeIn' ? "border-bottom: 1px solid"  : "border-bottom: 0"}" @click=${() => { this.openPortal('TradeIn') }}>Trade in</button></li>
            <li><button style="${this.portal === 'Profile' ? "border-bottom: 1px solid"  : "border-bottom: 0"}" @click=${() => { this.openPortal('Profile') }}>Profile</button></li>
          </ul>
          <img src="./assets/img/Avatars.png" style="margin:10px;">
        </div>
      `;
    }else{
      tBHtml = html `
        <div class="cc-toolbar">
          <h1>${PCore.getEnvironmentInfo().getApplicationLabel()}&nbsp;</h1><img src="./assets/img/antenna.svg" class="cc-icon">
        </div>
      `;
    }

    return tBHtml;
  }

  openPortal(portal:string) {
    this.portal = portal;
    this.requestUpdate();
  }

  getMainHtml() : any {
    let mHtml;

    if(PCore.getEnvironmentInfo().getApplicationLabel() === 'UplusAuto'){
      mHtml = html`
        ${this.portal === 'UConnect'?
          html `
          <div class="margin">
            <mashup-main-screen-component .pConn=${this.props}></mashup-main-screen-component>
          </div>
        `:html``}

        ${this.portal === 'TradeIn'?
          html `<trade-component .pConn=${this.props}></trade-component>`:html``}

        ${this.portal === 'Profile'?
          html ``:html``}
      `;
    }else{
      mHtml = html `
        <div>
          <mashup-main-screen-component .pConn=${this.props}></mashup-main-screen-component>
        </div>
      `;
    }
  
    return mHtml;
  }


  getMashupMainHtml() : any {



    const mMHtml = html`
      <div class=${this.portal === 'TradeIn' ? "trade-div" : "uplus-content"}>
        ${this.getToolbarHtml()}
        ${this.bHasPConnect ? html `${this.getMainHtml()}` :html``}
      </div>
    `
  


    return mMHtml;
  }


  render(){

    const sContent = this.getMashupMainHtml();
    const locBootstrap = SdkConfigAccess.getSdkConfigBootstrapCSS();

    let arHtml: Array<any> = [];

    // MashupMain not derived from BridgeBase, so we need to load Bootstrap CSS
    arHtml.push( html`<link rel='stylesheet' href='${locBootstrap}'>`);

    arHtml.push(mashupMainStyles);
    arHtml.push(sContent);

    return arHtml;

  }


  /**
   * kick off the Mashup that we're trying to serve up
   */
   startMashup() {
    
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

  // _tradeInService() {
  //   let actionInfo;
  //   switch (PCore.getEnvironmentInfo().getApplicationLabel()) {
  //       case "UplusAuto" :

  //         actionInfo = {
  //           pageName: 'pyEmbedAssignment'
  //         };

  //         PCore.getMashupApi().createCase("O533RU-UplusAuto-Work-TradeIn",this.pc.getContextName()).then(
  //           ()=>{console.log('case created');}
  //         );
  //         break;
  //   }
  // }



}

export default MashupMain;