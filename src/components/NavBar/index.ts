import { html, customElement, property, nothing } from '@lion/core';
import { BridgeBase } from '../../bridge/BridgeBase';
import { Utils } from '../../helpers/utils';
import { logout } from '@pega/auth/lib/sdk-auth-manager';

// NOTE: you need to import ANY component you may render.

// import the component's styles
import { navbarStyles } from './navbar-styles';

// Declare that PCore will be defined when this code is run
declare var PCore: any;

@customElement('nav-bar')
class NavBar extends BridgeBase {
  // Note: these 1st 3 come in as attributes on the component
  @property({ attribute: true }) appName;
  @property({ attribute: true, type: Array }) pages;
  @property({ attribute: true, type: Array }) caseTypes;

  @property({ attribute: false, type: Array }) navPages;
  @property({ attribute: false }) navExpandCollapse;
  @property({ attribute: false, type: Boolean }) bShowCaseTypes = false;
  @property({ attribute: false, type: Boolean }) bShowOperatorButtons = false;
  @property({ attribute: false }) portalName = 'User Portal';
  @property({ attribute: false }) portalApp = 'App Name';
  @property({ attribute: false }) portalLogoImage;
  @property({ attribute: false }) portalOperator;
  @property({ attribute: false }) portalOperatorInitials;
  @property({ attribute: false }) navIcon;

  /*
  actionsAPI: any;
  createWork: any;
  showPage: any;
  logout:any;
  
*/

  constructor() {
    //  Note: BridgeBase constructor has 2 optional args:
    //  1st: inDebug - sets this.bLogging: false if not provided
    //  2nd: inLogging - sets this.bLogging: false if not provided.
    //  To get started, we set both to true here. Set to false if you don't need debugger or logging, respectively.
    super(false, false);
    if (this.bLogging) {
      console.log(`${this.theComponentName}: constructor`);
    }
    // this.bDebug = true;
    if (this.bDebug) {
      debugger;
    }

    this.pConn = {};
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.bLogging) {
      console.log(`${this.theComponentName}: connectedCallback`);
    }
    if (this.bDebug) {
      debugger;
    }

    // Add this component's styles to the array of templates to render
    this.theComponentStyleTemplate = navbarStyles;

    // NOTE: Need to bind the callback to 'this' so it has this element's context when it's called.
    this.registerAndSubscribeComponent(this.onStateChange.bind(this));

    // was "assets" in Angular SDK ; is "static" in React
    this.navIcon = Utils.getIconPath(Utils.getSDKStaticContentUrl()).concat('pzpega-logo-mark.svg');
    this.navExpandCollapse = Utils.getImageSrc('plus', Utils.getSDKStaticContentUrl());

    // making a copy, so can add info
    this.navPages = JSON.parse(JSON.stringify(this.pages));

    for (let page in this.navPages) {
      //this.navPages$[page]["iconName"] = this.translateIcon(this.navPages$[page]["pxPageViewIcon"]);
      this.navPages[page]['iconName'] = Utils.getImageSrc(this.navPages[page]['pxPageViewIcon'], Utils.getSDKStaticContentUrl());
    }

    //    this.actionsAPI = this.pConn$.getActionsApi();
    //    this.createWork = this.actionsAPI.createWork.bind(this.actionsAPI);
    //    this.showPage = this.actionsAPI.showPage.bind(this.actionsAPI);
    //    this.logout = this.actionsAPI.logout.bind(this.actionsAPI);

    // was "assets" in Angular SDK ; is "static" in React
    this.portalLogoImage = Utils.getIconPath(Utils.getSDKStaticContentUrl()).concat('pzpega-logo-mark.svg');
    //this.portalOperator$ = oData["pxRequestor"].pxUserName;
    //this.portalOperator$ = oData["D_pxEnvironmentInfo"].pxOperator.pyUserName;
    this.portalOperator = PCore.getEnvironmentInfo().getOperatorName();

    this.portalOperatorInitials = Utils.getInitials(this.portalOperator);

    this.portalApp = PCore.getEnvironmentInfo().getApplicationLabel();
  }

  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();
    if (this.bLogging) {
      console.log(`${this.theComponentName}: disconnectedCallback`);
    }
    if (this.bDebug) {
      debugger;
    }
  }

  /**
   * updateSelf
   */
  updateSelf() {
    if (this.bLogging) {
      console.log(`${this.theComponentName}: updateSelf`);
    }
    if (this.bDebug) {
      debugger;
    }
  }

  /**
   * The `onStateChange()` method will be called when the state is updated.
   *  Override this method in each class that extends BridgeBase.               /
   *  This implementation can be used for common code that should be done for
   *  all components that are derived from BridgeBase
   */
  onStateChange() {
    if (this.bLogging) {
      console.log(`${this.theComponentName}: onStateChange`);
    }
    if (this.bDebug) {
      debugger;
    }

    const bShouldUpdate = super.shouldComponentUpdate();

    if (bShouldUpdate) {
      this.updateSelf();
    }
  }

  // Adapted from Angular SDK

  navPanelButtonClick(oPageData: any) {
    const { pyClassName, pyRuleName } = oPageData;

    this.thePConn
      .getActionsApi()
      .showPage(pyRuleName, pyClassName)
      .then(() => {
        if (this.bLogging) {
          console.log(`showPage completed`);
        }
      });
  }

  navPanelCreateButtonClick() {
    if (this.navExpandCollapse.indexOf('plus') > 0) {
      this.navExpandCollapse = Utils.getImageSrc('times', Utils.getSDKStaticContentUrl());
      this.bShowCaseTypes = true;
    } else {
      this.navExpandCollapse = Utils.getImageSrc('plus', Utils.getSDKStaticContentUrl());
      this.bShowCaseTypes = false;
    }
  }

  navPanelCreateCaseType(sCaseType: string, sFlowType: string) {
    const actionInfo = {
      containerName: 'primary',
      flowType: sFlowType ? sFlowType : 'pyStartCase'
    };

    this.thePConn
      .getActionsApi()
      .createWork(sCaseType, actionInfo)
      .then(() => {
        if (this.bLogging) {
          console.log(`createWork completed`);
        }
      });
  }

  // Toggle showing the Operator buttons
  navPanelOperatorButtonClick() {
    this.bShowOperatorButtons = !this.bShowOperatorButtons;
  }

  navPanelLogoutClick() {
    try {
      if (this.bLogging) {
        console.log(`--> navPanelLogoutClick clicked`);
      }
      /*
        this.thePConn.getActionsApi().logout().then(() => {
        if (this.bLogging) { console.log(`logout completed`); }
      },
      error => {
        console.error('onRejected function called: ' + error.message);
      })
      */
    } catch (err) {
      if (this.bLogging) {
        console.log(`--> Attempt to call logout api failed: ${err}`);
      }
    } finally {
      logout().then(() => {
        window.location.reload();
      });
    }
  }

  // End of adapted from Angular SDK

  render() {
    if (this.bLogging) {
      console.log(`${this.theComponentName}: render with pConn: ${JSON.stringify(this.pConn)}`);
    }
    if (this.bDebug) {
      debugger;
    }

    // To prevent accumulation (and extra rendering) of previous renders, begin each the render
    //  of any component that's a child of BridgeBase with a call to this.prepareForRender();
    this.prepareForRender();

    // In Angular SDK, NavBar gets a copy of the pConn from the AppShell that renders it. But it
    //  doesn't use the pConn for children, etc. The rendering is done here...

    const theCaseTypeButtons = html`
      ${this.caseTypes.map(
        caseType =>
          html`<div style="display: flex;">
            <button
              class="btn btn-link text-white"
              @click=${() => {
                this.navPanelCreateCaseType(caseType.pyClassName, caseType.pyFlowType);
              }}
            >
              ${caseType.pyLabel}
            </button>
          </div>`
      )}
    `;

    const theOperatorButtons = html`
      <button class="btn btn-link text-white" style="margin-left: -0.05rem;" @click=${this.navPanelLogoutClick}>Logoff</button>
    `;

    const theTemplate = html`
      <div class="psdk-appshell-nav">
        <div class="psdk-nav-header">
          <div>
            <img src="${this.portalLogoImage}" class="psdk-nav-logo" />
          </div>
          <div class="psdk-nav-portal-info">
            <!-- <div class="psdk-nav-portal-name">${this.portalName}</div> -->
            <div class="psdk-nav-portal-app">${this.portalApp}</div>
          </div>
        </div>
        <div class="psdk-nav-divider"></div>
        <div>
          <ul class="psdk-nav-ul-middle">
            <li class="psdk-nav-li-middle">
              <button
                @click=${this.navPanelCreateButtonClick}
                class="psdk-appshell-buttonnav"
                style="width: 100%; text-align: left; padding: 1rem 0rem;"
              >
                <img class="psdk-nav-svg-icon" src="${this.navExpandCollapse}" />
                <span class="psdk-nav-button-span" id="create-nav">Create</span>
              </button>
              ${this.bShowCaseTypes ? html`<div style="padding-left: -0.75rem;">${theCaseTypeButtons}</div>` : nothing}
            </li>
          </ul>
        </div>

        <div>
          <ul class="psdk-nav-ul-middle">
            ${this.navPages.map(
              page =>
                html`<li class="psdk-nav-li-middle">
                  <button
                    @click=${() => {
                      this.navPanelButtonClick(page);
                    }}
                    class="psdk-appshell-buttonnav"
                    style="width: 100%; text-align: left; padding: 1rem 0rem;"
                  >
                    <img class="psdk-nav-svg-icon" src="${page.iconName}" />
                    <span class="psdk-nav-button-span">${page.pyLabel}</span>
                  </button>
                </li>`
            )}
          </ul>
        </div>
        <div class="psdk-appshell-bottom">
          <ul class="psdk-nav-ul-middle">
            <li class="psdk-nav-li-middle">
              <button
                @click=${this.navPanelOperatorButtonClick}
                class="psdk-appshell-buttonnav"
                style="width: 100%; text-align: left; padding: 1rem 0rem; margin-left: -0.75rem"
              >
                <div class="psdk-nav-oper-avatar">${this.portalOperatorInitials}</div>
                <span class="psdk-nav-button-span">${this.portalOperator}</span>
              </button>
              <br />
              ${this.bShowOperatorButtons ? html`<div style="padding-left: 0rem;">${theOperatorButtons}</div>` : nothing}
            </li>
          </ul>
        </div>
      </div>
    `;

    this.renderTemplates.push(theTemplate);

    return this.renderTemplates;
  }
}

export default NavBar;
