import { html, customElement, LitElement } from '@lion/core';
import { getSdkConfig, SdkConfigAccess } from '../../../helpers/config_access';
import { sampleMainInit } from '../../sampleCommon';

import '@lion/button/define';
import '@lion/textarea/define';

// NOTE: you need to import ANY component you may render.

// import the component's styles as HTML with <style>
import { fullPortalStyles } from './full-portal-styles';
import { loginIfNecessary } from "../../../helpers/authManager";


// Declare that PCore will be defined when this code is run
declare var PCore: any;

@customElement('full-portal-component')
class FullPortal extends LitElement {


  // NOTE: FullPortal is NOT derived from BridgeBase; just derived from LitElement
  constructor() {
    super();

  }

  connectedCallback() {
    super.connectedCallback();

    sampleMainInit( this, 'full-portal-component', 'app-entry' );
    
    // Make sure sdkConfig is loaded prior to attempting to login
    getSdkConfig().then( sdkConfig => {
      // To eliminate the login button/component, login directly
      loginIfNecessary("portal", false);
    })

  }


  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();


  }



  getFullPortalHtml() : any {


    const fPHtml = html`
        <div class="column main-content">
          <div id="app-nopega">
          </div>
          <div id="pega-here"></div>
        </div>`;



    return fPHtml;
  }


  render(){

    const sContent = this.getFullPortalHtml();
    const locBootstrap = SdkConfigAccess?.getSdkConfigBootstrapCSS();

    let arHtml: any[] = [];

    // FullPortal not derived from BridgeBase, so we need to load Bootstrap CSS
    if( locBootstrap ) {
      arHtml.push( html`<link rel='stylesheet' href='${locBootstrap}'>`);
    }

    arHtml.push(fullPortalStyles);
    arHtml.push(sContent);

    return arHtml;

  }




}

export default FullPortal;