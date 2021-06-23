import { html, customElement, property, LitElement } from '@lion/core';
import { SdkConfigAccess } from '../../../helpers/config_access';

import '@lion/button/define';
import '@lion/textarea/define';
import '../../../components/OAuthLogin/oauth-login';
import '../../../components/OAuthLogin/oauth-popup';

import { authLogin, authLogout, authIsSignedIn, authMashupLogin } from "../../../helpers/auth";

import '../MashupMain';

// NOTE: you need to import ANY component you may render.

// import the component's styles as HTML with <style>
import { mashupPortalStyles } from './mashup-portal-styles';


// Declare that PCore will be defined when this code is run
declare var PCore: any;

@customElement('mashup-portal-component')
class MashupPortal extends LitElement {


  // NOTE: MashupPortal is NOT derived from BridgeBase; just derived from LitElement
  constructor() {
    super();

    // Force use of mashupClientId and mashupClientSecret (that chooses the right flow)
    //  by making sure any currently logged in user is logged out.
    if (authIsSignedIn()) {
      authLogout();
    }
    window.sessionStorage.setItem("startingComponent", "mashup-portal-component");

  }

  connectedCallback() {
    super.connectedCallback();

    
  }


  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();


  }


  getSimplePortalHtml() : any {

    const sPHtml = html`
    <div class="column main-content">
      <div id="app-nopega">
        <!-- <hello-world title="Pega App Below!" description="This is a &lt;hello-world&gt; web component in components/hello-world.ts"></hello-world> -->
      </div>
      <div id="pega-here"></div>
    </div>`;

  if( !authIsSignedIn() ) {
    authMashupLogin();
  }

    return sPHtml;
  }


  render(){

    const sContent = this.getSimplePortalHtml();
    const locBootstrap = SdkConfigAccess.getSdkConfigBootstrapCSS();

    let arHtml: any[] = [];

    // MashupPortal not derived from BridgeBase, so we need to load Bootstrap CSS
    arHtml.push( html`<link rel='stylesheet' href='${locBootstrap}'>`);

    arHtml.push(mashupPortalStyles);
    arHtml.push(sContent);

    return arHtml;

  }




}

export default MashupPortal;