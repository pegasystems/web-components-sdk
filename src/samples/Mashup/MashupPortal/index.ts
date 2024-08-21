import { html, customElement, LitElement } from '@lion/core';
import { getSdkConfig, SdkConfigAccess, loginIfNecessary, sdkSetAuthHeader } from '@pega/auth/lib/sdk-auth-manager';
import { sampleMainInit } from '../../sampleCommon';

import '@lion/button/define';
import '@lion/textarea/define';

import '../MashupMain';

// NOTE: you need to import ANY component you may render.

// import the component's styles as HTML with <style>
import { mashupPortalStyles } from './mashup-portal-styles';

@customElement('mashup-portal-component')
class MashupPortal extends LitElement {
  // NOTE: MashupPortal is NOT derived from BridgeBase; just derived from LitElement
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();

    sampleMainInit(this, 'mashup-portal-component', 'mashup-main-component');

    getSdkConfig().then(sdkConfig => {
      const sdkConfigAuth = sdkConfig.authConfig;

      if (!sdkConfigAuth.mashupClientId && sdkConfigAuth.customAuthType === 'Basic') {
        // Service package to use custom auth with Basic
        const sB64 = window.btoa(`${sdkConfigAuth.mashupUserIdentifier}:${window.atob(sdkConfigAuth.mashupPassword)}`);
        sdkSetAuthHeader(`Basic ${sB64}`);
      }

      if (!sdkConfigAuth.mashupClientId && sdkConfigAuth.customAuthType === 'BasicTO') {
        const now = new Date();
        const expTime = new Date(now.getTime() + 5 * 60 * 1000);
        let sISOTime = `${expTime.toISOString().split('.')[0]}Z`;
        const regex = /[-:]/g;
        sISOTime = sISOTime.replace(regex, '');
        // Service package to use custom auth with Basic
        const sB64 = window.btoa(`${sdkConfigAuth.mashupUserIdentifier}:${window.atob(sdkConfigAuth.mashupPassword)}:${sISOTime}`);
        sdkSetAuthHeader(`Basic ${sB64}`);
      }

      loginIfNecessary({ appName: 'embedded', mainRedirect: false });
    });
  }

  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();
  }

  getSimplePortalHtml(): any {
    return html` <div class="column main-content">
      <div id="app-nopega">
        <!-- <hello-world title="Pega App Below!" description="This is a &lt;hello-world&gt; web component in components/hello-world.ts"></hello-world> -->
      </div>
      <div id="pega-here"></div>
    </div>`;
  }

  render() {
    const sContent = this.getSimplePortalHtml();
    const locBootstrap = SdkConfigAccess?.getSdkConfigBootstrapCSS();

    const arHtml: any[] = [];

    // MashupPortal not derived from BridgeBase, so we need to load Bootstrap CSS
    if (locBootstrap) {
      arHtml.push(html`<link rel="stylesheet" href="${locBootstrap}" />`);
    }

    arHtml.push(mashupPortalStyles);
    arHtml.push(sContent);

    return arHtml;
  }
}

export default MashupPortal;
