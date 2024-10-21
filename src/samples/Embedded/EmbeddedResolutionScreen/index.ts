import { CSSResultGroup, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { bootstrapCSSLink } from '../utils';

import '@lion/ui/define/lion-button.js';
import '@lion/ui/define/lion-textarea.js';

// NOTE: you need to import ANY component you may render.

// import the component's styles
import { embeddedResolutionScreenStyles } from './embedded-resolution-sceen-styles';

@customElement('embedded-resolution-screen-component')
class EmbeddedResolutionScreen extends LitElement {
  static styles?: CSSResultGroup = embeddedResolutionScreenStyles;

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

    return [bootstrapCSSLink, sContent];
  }
}

export default EmbeddedResolutionScreen;
