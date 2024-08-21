import { html, customElement, property, LitElement } from '@lion/core';
import { SdkConfigAccess } from '@pega/auth/lib/sdk-auth-manager';

// NOTE: you need to import ANY component you may render.

// import the component's styles as HTML with <style>
import { summaryListStyles } from './summary-list-styles';

import '@lion/button/define';
import '../SummaryItem';

@customElement('summary-list-extension')
class SummaryList extends LitElement {
  @property({ attribute: false, type: Array }) arItems: any[] = [];
  @property({ attribute: true, type: String }) icon = '';

  @property({ attribute: true, type: String }) menuIconOverride = '';
  @property({ attribute: false }) menuIconOverrideAction: any;

  // NOTE: SummaryList is NOT derived from BridgeBase; just derived from LitElement
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

  getItemsHtml(): any {
    const arItemsHtml: any[] = [];

    for (const item of this.arItems) {
      arItemsHtml.push(html`
        <summary-item-extension
          .item="${item}"
          menuIconOverride="${this.menuIconOverride}"
          .menuIconOverrideAction="${this.menuIconOverrideAction}"
        ></summary-item-extension>
      `);
    }

    return html`${arItemsHtml}`;
  }

  render() {
    const sContent = html`${this.getItemsHtml()}`;
    const locBootstrap = SdkConfigAccess.getSdkConfigBootstrapCSS();

    const arHtml: any[] = [];

    // SummaryList not derived from BridgeBase, so we need to load Bootstrap CSS
    arHtml.push(html`<link rel="stylesheet" href="${locBootstrap}" />`);

    arHtml.push(summaryListStyles);
    arHtml.push(sContent);

    return arHtml;
  }
}

export default SummaryList;
