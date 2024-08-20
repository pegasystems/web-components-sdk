import { html, customElement, property, LitElement } from '@lion/core';
import { SdkConfigAccess } from '@pega/auth/lib/sdk-auth-manager';

// NOTE: you need to import ANY component you may render.

// import the component's styles as HTML with <style>
import { verticalTabsStyles } from './vertical-tabs-styles';

// Declare that PCore will be defined when this code is run
declare var PCore: any;

@customElement('vertical-tabs-component')
class VerticalTabs extends LitElement {
  @property({ type: Array }) tabConfig = [];

  selectedIndex: number = 0; // Default to first tab in array

  // NOTE: VerticalTabs is NOT derived from BridgeBase; just derived from LitElement
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();

    if (this.tabConfig) {
      for (let i in this.tabConfig) {
        let aTab: any = this.tabConfig[i];
        if (aTab.selected) {
          this.selectedIndex = parseInt(i);
          break;
        }
      }
    }
  }

  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();
  }

  updated(changedProperties) {
    for (let key of changedProperties.keys()) {
      // check if props changes, if so, normalize and render
      if (key == 'tabConfig') {
        // console.log(`VerticalTabs: about to requestUpdate with updated: ${this.selectedIndex}`);
        this.requestUpdate();
      }
    }
  }

  getVerticalTabsHtml(arTabs: Array<any>): any {
    // ${tabCount == this.selectedIndex?
    //   html` class="psdk-tab-selected" aria-selected="true" `
    //   :
    //   html` class="psdk-tab-unselected" aria-selected="false" `
    // }

    const arTabsHtml: Array<any> = [];

    let tabCount = 0;
    for (let tab of arTabs) {
      let selected = tabCount == this.selectedIndex ? 'true' : 'false';
      let selectedClass = tabCount == this.selectedIndex ? 'psdk-tab-selected' : 'psdk-tab-unselected';

      arTabsHtml.push(
        html`<button tabId="${tab.id}" @click="${this._tabClick}" class="${selectedClass}" aria-selected="${selected}">
          <span title="${tab.name}">${tab.name}</span>
        </button>`
      );

      tabCount++;
    }

    const vTHtml = html` <div class="psdk-vertical-tabs">${arTabsHtml}</div> `;

    return vTHtml;
  }

  render() {
    const sContent = html`${this.getVerticalTabsHtml(this.tabConfig)}`;
    const locBootstrap = SdkConfigAccess.getSdkConfigBootstrapCSS();

    let arHtml: Array<any> = [];

    // VerticalTabs not derived from BridgeBase, so we need to load Bootstrap CSS
    arHtml.push(html`<link rel="stylesheet" href="${locBootstrap}" />`);

    arHtml.push(verticalTabsStyles);
    arHtml.push(sContent);

    return arHtml;
  }

  _tabClick(e) {
    let target = e.target;
    let tabData = {};

    tabData['tabId'] = target.getAttribute('tabId') || target.parentElement.getAttribute('tabId');

    for (let i in this.tabConfig) {
      if (tabData['tabId'] == this.tabConfig[i]['id']) {
        this.selectedIndex = parseInt(i);
        // console.log(`VerticalTabs: about to requestUpdate for tab: ${this.selectedIndex}`);
        this.requestUpdate();
        break;
      }
    }

    let event = new CustomEvent('VerticalTabClick', {
      detail: { data: tabData }
    });

    this.dispatchEvent(event);
  }
}

export default VerticalTabs;
