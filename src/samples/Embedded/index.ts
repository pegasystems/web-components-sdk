/* eslint-disable sonarjs/no-all-duplicated-branches */
import { CSSResultGroup, html, LitElement } from 'lit';
import { css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { getSdkConfig, loginIfNecessary } from '@pega/auth/lib/sdk-auth-manager';
import { compareSdkPCoreVersions } from '../../helpers/versionHelpers';

import './Header';
import './MainScreen';
import './Trade';
import '../../components/RootContainer';
import { initializeAuthentication } from './utils';

declare let myLoadMashup: any;

@customElement('embedded-component')
class Embedded extends LitElement {
  static styles?: CSSResultGroup = css`
    .uplus-content {
      // background-image: linear-gradient(var(--app-primary-color), var(--app-form-color));
      background-image: url('./assets/img/background.png');
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      width: 100%;
      height: 100vh;
    }

    .trade-div {
      width: 100%;
      height: 100vh;
      background: url(./assets/img/trade.jpeg);
    }

    .margin {
      width: calc(100% - 100px);
      margin-left: 50px;
      margin-right: 50px;
    }
  `;

  @state()
  pConn: typeof PConnect | undefined;

  @property({ attribute: false, type: Boolean }) portal = 'UConnect';

  isLoggedIn = false;
  applicationLabel: string | undefined;

  constructor() {
    super();
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.initialize();

    // Add event listener for when logged in and constellation bootstrap is loaded
    document.addEventListener('SdkConstellationReady', this.handleSdkConstellationReady.bind(this));
  }

  async initialize() {
    try {
      const { authConfig } = await getSdkConfig();
      initializeAuthentication(authConfig);

      // this function will handle login process, and SdkConstellationReady event will be fired once PCore is ready
      loginIfNecessary({ appName: 'embedded', mainRedirect: false });
    } catch (error) {
      console.error('Something went wrong while login', error);
    }
  }

  handleSdkConstellationReady(): void {
    this.isLoggedIn = true;
    this.startMashup();
  }

  startMashup() {
    PCore.onPCoreReady(renderObj => {
      // Check that we're seeing the PCore version we expect
      compareSdkPCoreVersions();

      // Need to register the callback function for PCore.registerComponentCreator
      // This callback is invoked if/when you call a PConnect createComponent
      PCore.registerComponentCreator(c11nEnv => {
        return c11nEnv;
      });

      // Now, do the initial render...
      this.initialRender(renderObj);
    });

    myLoadMashup('pega-root', false); // this is defined in bootstrap shell that's been loaded already
  }

  initialRender(renderObj) {
    const { props } = renderObj;

    // get pconnect of RootContainer component
    this.pConn = props.getPConnect();
  }

  openPortal(event: CustomEvent) {
    this.portal = event.detail?.value;
    this.requestUpdate();
  }

  getMainHtml(): any {
    let mHtml;

    if (PCore.getEnvironmentInfo().getApplicationLabel() === 'UplusAuto') {
      mHtml = html`
        ${this.portal === 'UConnect'
          ? html`
              <div class="margin">
                <embedded-main-screen-component .pConn=${this.pConn}></embedded-main-screen-component>
              </div>
            `
          : html``}
        ${this.portal === 'TradeIn' ? html`<trade-component .pConn=${this.pConn}></trade-component>` : html``}
        ${this.portal === 'Profile' ? html`` : html``}
      `;
    } else {
      mHtml = html`
        <div>
          <embedded-main-screen-component .pConn=${this.pConn}></embedded-main-screen-component>
        </div>
      `;
    }

    return mHtml;
  }

  protected render(): unknown {
    return this.isLoggedIn
      ? html`<div class=${this.portal === 'TradeIn' ? 'trade-div' : 'uplus-content'}>
          <embedded-header-component .portal=${this.portal} @openPortalClick="${this.openPortal}"></embedded-header-component>
          ${this.getMainHtml()}
          <!-- <embedded-main-screen-component .pConn=${this.pConn}></embedded-main-screen-component> -->
        </div>`
      : html`<div>Loading...</div>`;
  }
}
export default Embedded;
