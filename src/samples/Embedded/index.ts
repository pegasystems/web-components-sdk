import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { getSdkConfig, loginIfNecessary } from '@pega/auth/lib/sdk-auth-manager';
import { compareSdkPCoreVersions } from '../../helpers/versionHelpers';

import './Header';
import './MainScreen';
import '../../components/RootContainer';
import { initializeAuthentication } from './utils';

declare let myLoadMashup: any;

@customElement('embedded-component')
class Embedded extends LitElement {
  @state()
  pConn: typeof PConnect | undefined;

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

  protected render(): unknown {
    return this.isLoggedIn
      ? html`<div>
          <embedded-header-component></embedded-header-component>
          <embedded-main-screen-component .pConn=${this.pConn}></embedded-main-screen-component>
        </div>`
      : html`<div>Loading...</div>`;
  }
}
export default Embedded;
