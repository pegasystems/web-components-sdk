import { html, customElement, property, LitElement } from '@lion/core';
import { SdkConfigAccess } from '@pega/auth/lib/sdk-auth-manager';
import { Utils } from '../../../helpers/utils';

// NOTE: you need to import ANY component you may render.

// import the component's styles as HTML with <style>
import { listUtilityStyles } from './list-utility-styles';

import '@lion/button/define';
import '../SummaryList';
import '../ProgressIndicator';

@customElement('list-utility-extension')
class ListUtility extends LitElement {
  @property({ attribute: true, type: String }) name = '';
  @property({ attribute: true, type: String }) icon = '';
  @property({ attribute: true, type: Boolean }) bLoading = false;
  @property({ attribute: false }) count = 0;
  @property({ attribute: false, type: Array }) arActions: any[] = [];
  @property({ attribute: false, type: Array }) arItems: any[] = [];

  headerSvgIcon = '';
  settingsSvgIcon = '';

  imagePath = '';

  noItemsMessage = 'No Items';

  elMenu: any = null;

  // NOTE: ListUtility is NOT derived from BridgeBase; just derived from LitElement
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();

    this.imagePath = Utils.getIconPath(Utils.getSDKStaticContentUrl());

    this.headerSvgIcon = Utils.getImageSrc(this.icon, Utils.getSDKStaticContentUrl());
    this.settingsSvgIcon = Utils.getImageSrc('more', Utils.getSDKStaticContentUrl());
  }

  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();
  }

  getActionButtonMenuHtml(menuActions: any[]) {
    const arButtonMenuHtml: any[] = [];

    for (const actionMenu of menuActions) {
      arButtonMenuHtml.push(html`
        <a @click=${actionMenu.onClick}
          >${actionMenu.icon != null
            ? html`<img class="psdk-utility-card-action-actions-svg-icon" src="${this.imagePath}${actionMenu.icon}.svg" />&nbsp;`
            : html``}
          ${actionMenu.text}</a
        >
      `);
    }
    return arButtonMenuHtml;
  }

  getItemsHtml(): any {
    return html` <summary-list-extension .arItems="${this.arItems}"></summary-list-extension> `;
  }

  getListUtilityHtml(): any {
    return html`
      <div style="text-align: left;">
        <div class="psdk-utility">
          <div class="header">
            <div class="header-icon">
              <img class="psdk-utility-svg-icon" src="${this.headerSvgIcon}" />
            </div>
            <div class="header-text">${this.name}</div>
            <div class="psdk-utility-count" id="attachments-count">${this.count}</div>
            <div style="flex-grow: 1"></div>
            <div class="header-icon">
              <div class="psdk-utility-menu">
                <lion-button @click=${this._showActionMenu}>
                  <img class="psdk-utility-card-actions-svg-icon" src="${this.settingsSvgIcon}" />
                </lion-button>
                <div id="actionMenu" class="psdk-action-menu-content">${this.getActionButtonMenuHtml(this.arActions)}</div>
              </div>
            </div>
          </div>
          <div class="psdk-utiltiy-divider"></div>
          <br />
          ${this.bLoading ? html` <progress-extension></progress-extension> ` : html``}
          ${this.count == 0 && !this.bLoading
            ? html` <div class="message">${this.noItemsMessage}</div>`
            : html` <div class="psdk-utility-items">${this.getItemsHtml()}</div>`}
          ${this.count > 3
            ? html` <div class="psdk-utility-view-all">
                <lion-button @click=${this._onViewAll}> View all </lion-button>
              </div>`
            : html``}
        </div>
      </div>
    `;
  }

  _showActionMenu(event: any) {
    let el = event.target;
    while (el != null && el.className != 'psdk-utility-menu') {
      el = el.parentElement;
    }

    if (this.elMenu != null) {
      // one is already up, toggle that one first
      this.toggleActionMenu(this.elMenu);
    }

    this.toggleActionMenu(el);

    // add clickAway listener
    window.addEventListener('mouseup', this._clickAway.bind(this));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _onViewAll(event: any) {
    const newEvent = new CustomEvent('ViewAll', {});

    this.dispatchEvent(newEvent);
  }

  toggleActionMenu(el: any) {
    if (el != null) {
      this.elMenu = el;
      const actionMenu = el.getElementsByClassName('psdk-action-menu-content')[0];
      if (actionMenu != null) {
        actionMenu.classList.toggle('show');
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  actionClick(event: any) {
    // this._showActionMenu(event);

    // remove clickAway listener
    window.removeEventListener('mouseup', this._clickAway.bind(this));
  }

  _clickAway(event: any) {
    let bInMenu = false;

    // run through list of elements in path, if menu not in th path, then want to
    // hide (toggle) the menu
    // eslint-disable-next-line no-restricted-syntax
    for (const i in event.path) {
      if (event.path[i].className == 'psdk-utility-menu') {
        bInMenu = true;
        break;
      }
    }
    // eslint-disable-next-line sonarjs/no-collapsible-if
    if (!bInMenu) {
      if (this.elMenu != null) {
        this.toggleActionMenu(this.elMenu);
        this.elMenu = null;

        window.removeEventListener('mouseup', this._clickAway.bind(this));
      }
    }
  }

  render() {
    const sContent = html`${this.getListUtilityHtml()}`;
    const locBootstrap = SdkConfigAccess.getSdkConfigBootstrapCSS();

    const arHtml: any[] = [];

    // ListUtility not derived from BridgeBase, so we need to load Bootstrap CSS
    arHtml.push(html`<link rel="stylesheet" href="${locBootstrap}" />`);

    arHtml.push(listUtilityStyles);
    arHtml.push(sContent);

    return arHtml;
  }
}

export default ListUtility;
