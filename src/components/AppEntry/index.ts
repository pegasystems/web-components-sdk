import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../RootContainer';
import '../NotSupported';
import { SdkConfigAccess, getAvailablePortals, logout } from '@pega/auth/lib/sdk-auth-manager';
import { compareSdkPCoreVersions } from '../../helpers/versionHelpers';
import { appEntryStyles } from './app-entry-styles';

// Declare that PCore will be defined when this code is run
declare let PCore: any;
declare let myLoadPortal; // Experiment with this
declare let myLoadDefaultPortal;

const isObjectEmpty = objectName => {
  return objectName && Object.keys(objectName).length === 0 && objectName.constructor === Object;
};

@customElement('app-entry')
class AppEntry extends LitElement {
  @property({ type: String, attribute: false }) theComponentName = 'AppEntry';
  @property({ type: String, attribute: false }) thePConnComponentName = '';

  // Attribute properties
  @property({ type: Object }) props;
  // @property( {type: Function, attribute: false} ) pConn$ = () => {}
  @property({ attribute: false, type: Object }) renderTemplates;
  @property({ attribute: false, type: Object }) theComponentStyleTemplate: any = nothing; // Any styling lit-html template that should be added to renderTemplates

  bLogging: Boolean = false;
  portalSelectionScreen = false;
  defaultPortalName: string;
  availablePortals: string[];

  // NOTE: AppEntry is NOT derived from BridgeBase; just derived from LitElement
  constructor() {
    super();
    if (this.bLogging) {
      console.log(`${this.theComponentName}: constructor`);
    }
    this.props = {};
    this.defaultPortalName = '';
    this.availablePortals = [];
    this.renderTemplates = [];
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.bLogging) {
      console.log(`${this.theComponentName}: connectedCallback`);
    }

    if (this.bLogging) {
      console.log(`AppEntry --> loading Portal`);
    }
    this.theComponentStyleTemplate = appEntryStyles;
    this.startPortal();
  }

  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();

    if (this.bLogging) {
      console.log(`${this.theComponentName}: disconnectedCallback`);
    }
  }

  /**
   * kick off the application's portal that we're trying to serve up
   */
  startPortal() {
    // NOTE: When loadMashup is complete, this will be called.
    PCore.onPCoreReady(renderObj => {
      // Check that we're seeing the PCore version we expect
      compareSdkPCoreVersions();

      // Need to register the callback function for PCore.registerComponentCreator
      //  This callback is invoked if/when you call a PConnect createComponent
      PCore.registerComponentCreator(c11nEnv => {
        return c11nEnv;
      });

      this.initialRender(renderObj);
    });

    // load the Portal and handle the onPCoreEntry response that establishes the
    //  top level Pega root element (likely a RootContainer)

    const { appPortal: thePortal, excludePortals } = SdkConfigAccess.getSdkConfigServer();
    const defaultPortal = PCore?.getEnvironmentInfo?.().getDefaultPortal?.();
    const queryPortal = sessionStorage.getItem('wcsdk_portalName');

    // Note: myLoadPortal and myLoadDefaultPortal are set when bootstrapWithAuthHeader is invoked
    if (queryPortal) {
      myLoadPortal('pega-root', queryPortal, []);
    } else if (thePortal) {
      console.log(`Loading specified appPortal: ${thePortal}`);
      myLoadPortal('pega-root', thePortal, []);
    } else if (myLoadDefaultPortal && defaultPortal && !excludePortals.includes(defaultPortal)) {
      console.log(`Loading default portal: ${defaultPortal}`);
      myLoadDefaultPortal('pega-root', []);
    } else {
      console.log('Loading portal selection screen');
      this.portalSelectionScreen = true;
      this.defaultPortalName = defaultPortal ?? '';
      // Add logic to display a portal selection screen
      // Getting current user's access group's available portals list other than excluded portals (relies on Traditional DX APIs)
      getAvailablePortals().then(portals => {
        this.availablePortals = portals;
        this.requestUpdate();
      });
    }
  }

  /**
   * Callback from onPCoreReady that's called once the top-level render object
   * is ready to be rendered
   * @param inRenderObj the initial, top-level PConnect object to render
   */
  initialRender(inRenderObj) {
    if (this.bLogging) {
      console.log(`${this.theComponentName} renderObj: `, inRenderObj);
    }

    /// /// This was done on login and kicked off the creation of this
    /// ///  AppEntry. So don't need to to do this.
    // With Constellation Ready, replace <div id="pega-here"></div>
    //  with top-level ViewContainer
    // const replaceMe = document.getElementById("pega-here");
    // const replacement = document.createElement("app-entry");
    // replacement.setAttribute("id", "pega-root");
    // if (replaceMe) { replaceMe.replaceWith(replacement); }

    const { props } = inRenderObj;
    this.props = props;

    this.thePConnComponentName = this.props.getPConnect().getComponentName();

    if (this.bLogging) {
      console.log(` --> thePConnComponentName: ${this.thePConnComponentName}`);
    }
  }

  loadSelectedPortal(portal) {
    this.portalSelectionScreen = false;
    myLoadPortal('pega-root', portal, []); // this is defined in bootstrap shell that's been loaded already
  }

  logOff() {
    logout().then(() => {
      // Reload the page to kick off the login
      window.location.reload();
    });
  }

  render() {
    if (this.bLogging) {
      console.log(`${this.theComponentName}: render with props - ${JSON.stringify(this.props)}`);
    }
    this.renderTemplates = [];

    // NOTE: that also the AppEntry gets its initial config info as "props" from inRenderObj,
    //  we actually pass that to the RootContainer as .pConn
    if (this.portalSelectionScreen) {
      this.renderTemplates.push(this.theComponentStyleTemplate);

      const content = html`
        <div class="portal-load-error">
          <div data-test-id="defaultPortalErrorMessage">
            Default portal ( <span class="portal-name">${this.defaultPortalName}</span> ) for current operator is not compatible with SDK.
            <br /><br />
            Please select one of the portals available to the operator's access group:
          </div>
          <div class="portals-list">
            ${this.availablePortals?.map(portal => {
              const portalDisplay = `${portal}`;
              return html`<div class="portal-list-item" @click=${() => this.loadSelectedPortal(portal)}>${portalDisplay}</div>`;
            })}
          </div>
          <button class="logout-btn" @click=${this.logOff}>Logout</button>
        </div>
      `;

      this.renderTemplates.push(content);

      return this.renderTemplates;
    }
    if (isObjectEmpty(this.props)) {
      return nothing;
    }
    if (this.thePConnComponentName === 'RootContainer') {
      return html` <!-- <div style='width: fit-content; border: dotted 1px #DDDDDD;'>${this.theComponentName}</div>  -->
        <root-container .pConn=${this.props}></root-container>`;
    }
    if (this.bLogging) {
      console.log(`${this.theComponentName} not known as AppEntry rendered component. So rendering NotSupported`);
    }
    return html` <not-supported>AppEntry got ${this.theComponentName} to render</not-supported> `;
  }
}

export default AppEntry;
