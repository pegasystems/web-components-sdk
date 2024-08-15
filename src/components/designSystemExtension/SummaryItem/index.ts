import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { SdkConfigAccess } from "@pega/auth/lib/sdk-auth-manager";
import { Utils } from "../../../helpers/utils";

// NOTE: you need to import ANY component you may render.

// import the component's styles as HTML with <style>
import { summaryItemStyles } from "./summary-item-styles";

// Declare that PCore will be defined when this code is run
declare var PCore: any;

@customElement("summary-item-extension")
class SummaryItem extends LitElement {
  @property({ attribute: false }) item: any;

  @property({ attribute: true, type: String }) menuIconOverride = "";
  @property({ attribute: false }) menuIconOverrideAction: any;

  settingsSvgIcon: string = "";

  imagePath: string = "";

  elMenu: any = null;

  // NOTE: SummaryItem is NOT derived from BridgeBase; just derived from LitElement
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();

    this.imagePath = Utils.getIconPath(Utils.getSDKStaticContentUrl());

    this.settingsSvgIcon = Utils.getImageSrc(
      "more",
      Utils.getSDKStaticContentUrl(),
    );
    if (this.menuIconOverride != "") {
      this.menuIconOverride = Utils.getImageSrc(
        this.menuIconOverride,
        Utils.getSDKStaticContentUrl(),
      );
    }
  }

  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();
  }

  getActionButtonMenuHtml(menuActions: Array<any>) {
    const arButtonMenuHtml: Array<any> = [];

    for (let actionMenu of menuActions) {
      arButtonMenuHtml.push(html`
        <a @click=${actionMenu.onClick}
          >${actionMenu.icon != null
            ? html`<img
                  class="psdk-utility-card-action-actions-svg-icon"
                  src="${this.imagePath}${actionMenu.icon}.svg"
                />&nbsp;`
            : html``}
          ${actionMenu.text}</a
        >
      `);
    }
    return arButtonMenuHtml;
  }

  getItemHtml(): any {
    const iHtml = html` <div class="psdk-utility-card">
      <div class="psdk-utility-card-icon">
        <img
          class="psdk-utility-card-svg-icon"
          src="${this.imagePath}${this.item.visual.icon}.svg"
        />
      </div>
      <div class="psdk-utility-card-main">
        ${this.item.primary.type == "URL"
          ? html` <div class="psdk-utility-card-main-primary-url">
              <lion-button @click="item.primary.click">
                ${this.item.primary.name}&nbsp;
                <img
                  class="psdk-utility-card-actions-svg-icon"
                  src="${this.imagePath}${this.item.primary.icon}.svg"
                />
              </lion-button>
            </div>`
          : html`
              <div class="psdk-utility-card-main-primary-label">
                ${this.item.primary.name}
              </div>
            `}
        <div>${this.item.secondary.text}</div>
      </div>
      <div class="psdk-utility-card-actions">
        ${this.menuIconOverride == ""
          ? html` <div class="psdk-utility-menu">
              <lion-button @click=${this._showActionMenu}>
                <img
                  class="psdk-utility-card-actions-svg-icon"
                  src="${this.settingsSvgIcon}"
                />
              </lion-button>
              <div id="actionMenu" class="psdk-action-menu-content">
                ${this.getActionButtonMenuHtml(this.item.actions)}
              </div>
            </div>`
          : html`
              <lion-button @click="${this._actionClick}">
                <img
                  class="psdk-utility-card-actions-svg-icon"
                  src="${this.menuIconOverride}"
                />
              </lion-button>
            `}
      </div>
    </div>`;

    return iHtml;
  }

  _showActionMenu(event: any) {
    let el = event.target;
    while (el != null && el.className != "psdk-utility-menu") {
      el = el.parentElement;
    }

    if (this.elMenu != null) {
      // one is already up, toggle that one first
      this.toggleActionMenu(this.elMenu);
    }

    this.toggleActionMenu(el);

    // add clickAway listener
    window.addEventListener("mouseup", this._clickAway.bind(this));
  }

  _actionClick($event) {
    this.menuIconOverrideAction.onClick(this.item);
    this._clickAway($event);
  }

  _onViewAll(event: any) {}

  toggleActionMenu(el: any) {
    if (el != null) {
      this.elMenu = el;
      let actionMenu = el.getElementsByClassName("psdk-action-menu-content")[0];
      if (actionMenu != null) {
        actionMenu.classList.toggle("show");
      }
    }
  }

  actionClick(event: any) {
    //this._showActionMenu(event);

    // remove clickAway listener
    window.removeEventListener("mouseup", this._clickAway.bind(this));
  }

  _clickAway(event: any) {
    if (this.elMenu != null) {
      this.toggleActionMenu(this.elMenu);
      this.elMenu = null;

      window.removeEventListener("mouseup", this._clickAway.bind(this));
    }
  }

  render() {
    const sContent = html`${this.getItemHtml()}`;

    const locBootstrap = SdkConfigAccess.getSdkConfigBootstrapCSS();
    let arHtml: Array<any> = [];

    // SummaryItem not derived from BridgeBase, so we need to load Bootstrap CSS
    arHtml.push(html`<link rel="stylesheet" href="${locBootstrap}" />`);

    arHtml.push(summaryItemStyles);
    arHtml.push(sContent);

    return arHtml;
  }
}

export default SummaryItem;
