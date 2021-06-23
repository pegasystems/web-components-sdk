import { html, customElement, property, LitElement } from '@lion/core';
import { SdkConfigAccess } from '../../../helpers/config_access';

import '@lion/button/define';
import '@lion/textarea/define';
import '../../../components/OAuthLogin/oauth-login';
import '../../../components/OAuthLogin/oauth-popup';

import '../SimpleMain';

// NOTE: you need to import ANY component you may render.

// import the component's styles as HTML with <style>
import { simplePortalStyles } from './simple-portal-styles';
import { authLogin, authIsSignedIn } from "../../../helpers/auth";



// Declare that PCore will be defined when this code is run
declare var PCore: any;

@customElement('simple-portal-component')
class SimplePortal extends LitElement {


  // NOTE: SimplePortal is NOT derived from BridgeBase; just derived from LitElement
  constructor() {
    super();

    window.sessionStorage.setItem("startingComponent", "simple-portal-component");

  }

  connectedCallback() {
    super.connectedCallback();

    // To eliminate the login button/component, login directly
    if( !authIsSignedIn() ) {
      authLogin();
    }
  
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
    const locBootstrap = SdkConfigAccess.getSdkConfigBootstrapCSS();

    let arHtml: any[] = [];

    // SimplePortal not derived from BridgeBase, so we need to load Bootstrap CSS
    arHtml.push( html`<link rel='stylesheet' href='${locBootstrap}'>`);

    arHtml.push(simplePortalStyles);
    arHtml.push(sContent);

    return arHtml;

  }




}

export default SimplePortal;