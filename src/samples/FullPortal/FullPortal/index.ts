import { html, customElement, LitElement } from '@lion/core';
import { SdkConfigAccess, loginIfNecessary } from '@pega/auth/lib/sdk-auth-manager';
import { sampleMainInit } from '../../sampleCommon';

import '@lion/button/define';
import '@lion/textarea/define';

// NOTE: you need to import ANY component you may render.

// import the component's styles as HTML with <style>
import { fullPortalStyles } from './full-portal-styles';


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
    
    // Present challenge screen if necessary and bootstrap Constellation 
    loginIfNecessary({appName:'portal', mainRedirect: true});

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

    let arHtml: Array<any> = [];

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