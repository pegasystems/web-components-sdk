import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { getSdkConfig, SdkConfigAccess, loginIfNecessary } from '@pega/auth/lib/sdk-auth-manager';
import { sampleMainInit } from '../../sampleCommon';

import '@lion/button/define';
import '@lion/textarea/define';

import '../SimpleMain';

// NOTE: you need to import ANY component you may render.

// import the component's styles as HTML with <style>
import { simplePortalStyles } from './simple-portal-styles';



// Declare that PCore will be defined when this code is run
declare var PCore: any;

@customElement('simple-portal-component')
class SimplePortal extends LitElement {


  // NOTE: SimplePortal is NOT derived from BridgeBase; just derived from LitElement
  constructor() {
    super();

  }

  connectedCallback() {
    super.connectedCallback();

    sampleMainInit( this, 'simple-portal-component', 'simple-main-component' );    

    // Make sure sdkConfig is loaded prior to attempting to login
    getSdkConfig().then( sdkConfig => {
        // To eliminate the login button/component, login directly
      loginIfNecessary({appName: 'simpleportal', mainRedirect: true});
    });
    
  }


  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();


  }


  getSimplePortalHtml() : any {

    const sPHtml = html`
    <div class="column main-content">
      <div id="app-nopega">
      </div>
      <div id="pega-here"></div>
    </div>`;



    return sPHtml;
  }


  render(){

    const sContent = this.getSimplePortalHtml();
    const locBootstrap = SdkConfigAccess?.getSdkConfigBootstrapCSS();

    let arHtml: Array<any> = [];

    // SimplePortal not derived from BridgeBase, so we need to load Bootstrap CSS
    if( locBootstrap ) {
      arHtml.push( html`<link rel='stylesheet' href='${locBootstrap}'>`);
    }

    arHtml.push(simplePortalStyles);
    arHtml.push(sContent);

    return arHtml;  

  }




}

export default SimplePortal;
