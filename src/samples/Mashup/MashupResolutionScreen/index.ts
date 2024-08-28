import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { SdkConfigAccess } from '@pega/auth/lib/sdk-auth-manager';

import '@lion/ui/define/lion-button.js';
import '@lion/ui/define/lion-textarea.js';

// NOTE: you need to import ANY component you may render.

// import the component's styles as HTML with <style>
import { mashupResolutionScreenStyles } from './mashup-resolution-sceen-styles';

@customElement('mashup-resolution-screen-component')
class MashupResolutionScreen extends LitElement {
  // NOTE: MashupResolutionScreen is NOT derived from BridgeBase; just derived from LitElement
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();
  }

  getResolutionScreenHtml(): any {
    return html`
      <div class="cc-resolution">
        <div class="cc-card">
          <div class="cc-header">Welcome!</div>
          <div class="cc-body">
            Thanks for selecting a package with us. <br /><br />
            A technician will contact you with in the next couple of days to schedule an installation.<br /><br />
            If you have any questions, you can contact us directly at <b>1-800-555-1234</b> or you can chat with us.
          </div>
        </div>
        <div>
          <img src="assets/img/cablechat.png" class="cc-chat-image" />
          <button class="cc-chat-button">Chat Now</button>
        </div>
      </div>
    `;
  }

  render() {
    const sContent = this.getResolutionScreenHtml();
    const locBootstrap = SdkConfigAccess.getSdkConfigBootstrapCSS();

    const arHtml: any[] = [];

    // MashupResolutionScreen not derived from BridgeBase, so we need to load Bootstrap CSS
    arHtml.push(html`<link rel="stylesheet" href="${locBootstrap}" />`);

    arHtml.push(mashupResolutionScreenStyles);
    arHtml.push(sContent);

    return arHtml;
  }
}

export default MashupResolutionScreen;
