import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { SdkConfigAccess } from '@pega/auth/lib/sdk-auth-manager';

// NOTE: you need to import ANY component you may render.

// import the component's styles as HTML with <style>
import { summaryListStyles } from './summary-list-styles';


import '@lion/button/define';
import '../SummaryItem';

// Declare that PCore will be defined when this code is run
declare var PCore: any;

@customElement('summary-list-extension')
class SummaryList extends LitElement {

  @property({ attribute: false, type: Array }) arItems: Array<any> = [];
  @property({ attribute: true, type: String }) icon: string = "";

  @property({ attribute: true, type: String }) menuIconOverride = "";
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


    const arItemsHtml: Array<any> = [];

    for (let item of this.arItems) {
      arItemsHtml.push(html`
        <summary-item-extension .item="${item}" menuIconOverride="${this.menuIconOverride}" .menuIconOverrideAction="${this.menuIconOverrideAction}"></summary-item-extension>
      `);
    }

    const iHtml = html`${arItemsHtml}`;

    return iHtml;

  }







  render() {


    const sContent = html`${this.getItemsHtml()}`;
    const locBootstrap = SdkConfigAccess.getSdkConfigBootstrapCSS();

    let arHtml: Array<any> = [];

    // SummaryList not derived from BridgeBase, so we need to load Bootstrap CSS
    arHtml.push(html`<link rel='stylesheet' href='${locBootstrap}'>`);

    arHtml.push(summaryListStyles);
    arHtml.push(sContent);


    return arHtml;

  }




}

export default SummaryList;
