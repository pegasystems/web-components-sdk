import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { SdkConfigAccess } from '@pega/auth/lib/sdk-auth-manager';

import '@lion/ui/define/lion-button.js';
import '@lion/ui/define/lion-textarea.js';
import { compareSdkPCoreVersions } from '../../../helpers/versionHelpers';

import '../SimpleSideBar';

// NOTE: you need to import ANY component you may render.

// import the component's styles as HTML with <style>
import { simpleMainStyles } from './simple-main-styles';

declare let myLoadMashup: any;

@customElement('simple-main-component')
class SimpleMain extends LitElement {
  @property({ attribute: false, type: Object }) props;
  @property({ attribute: false, type: Boolean }) bHasPConnect = false;
  @property({ attribute: false, type: Boolean }) bShowRoot = false;

  arCreateButtons: any[] = [];
  arOpenWorkItems: any[] = [];

  // NOTE: SimpleMain is NOT derived from BridgeBase; just derived from LitElement
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();

    this.startMashup();

    PCore.getPubSubUtils().subscribe(
      PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL,
      () => {
        this.cancelAssignment();
      },
      'cancelAssignment'
    );

    PCore.getPubSubUtils().subscribe(
      'assignmentFinished',
      () => {
        this.assignmentFinished();
      },
      'assignmentFinished'
    );

    PCore.getPubSubUtils().subscribe(
      'showWork',
      () => {
        this.showWork();
      },
      'showWork'
    );
  }

  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();

    PCore.getPubSubUtils().unsubscribe(PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL, 'cancelAssignment');

    PCore.getPubSubUtils().unsubscribe('assignmentFinished', 'assignmentFinished');

    PCore.getPubSubUtils().unsubscribe('showWork', 'showWork');
  }

  showWork() {
    this.bShowRoot = true;
  }

  cancelAssignment() {
    setTimeout(() => {
      this.bShowRoot = false;
    });
  }

  assignmentFinished() {
    setTimeout(() => {
      this.bShowRoot = false;
    });
  }

  getToolbarHtml(): any {
    return html`
      <div class="psdk-toolbar">
        <h1>Simple Portal</h1>
      </div>
    `;
  }

  getNavigationHtml(): any {
    const sDisplay = this.bShowRoot ? 'block' : 'none';
    return html`
      <div class="psdk-main">
        <aside class="psdk-aside">
          <simple-side-bar-component
            .pConn="${this.props}"
            .arButtons="${this.arCreateButtons}"
            .arWorkItems="${this.arOpenWorkItems}"
          ></simple-side-bar-component>
        </aside>
        <main class="psdk-main-root">
          <root-container .pConn="${this.props}" style="display:${sDisplay}" ?isMashup="${true}"></root-container>
        </main>
      </div>
    `;
  }

  /*
  async firstUpdated() {
    const sdkConfigServer = SdkConfigAccess.getSdkConfigServer();
    const serverUrl = sdkConfigServer.infinityRestServerUrl;
    const appAlias = sdkConfigServer.appAlias;
    const appAliasPath = appAlias ? `/app/${appAlias}` : '';

    await fetch ( `${serverUrl}${appAliasPath}/api/v1/casetypes` ,
        {
          method: 'GET',
          headers: {
            'Content-Type' : 'application/json',
            'Authorization' : '' + sdkGetAuthHeader(),
          },
        })
      .then( r => r.json())
      .then ( async data => {
        let arCaseTypes = data.caseTypes;

        this.getCaseTypeButtons(arCaseTypes);

        await fetch ( `${serverUrl}${appAliasPath}/api/v1/data/D_Worklist?Work=true`,
            {
              method: 'GET',
              headers: {
                'Content-Type' : 'application/json',
                'Authorization' : '' + sdkGetAuthHeader(),
              },

            })
          .then( r => r.json())
          .then ( async data => {
            let results = data.pxResults;

            this.getWorkItems(results);

            this.requestUpdate();
          })


      })
  }
*/

  getCaseTypeButtons(arCaseTypes: any[]) {
    this.arCreateButtons = [];

    for (const myCase of arCaseTypes) {
      if (myCase.CanCreate == 'true') {
        const oPayload: any = {};
        oPayload.caseTypeID = myCase.ID;
        oPayload.processID = myCase.startingProcesses[0].ID;
        oPayload.caption = myCase.name;

        this.arCreateButtons.push(oPayload);
      }
    }
  }

  getWorkItems(results: any[]) {
    this.arOpenWorkItems = [];

    for (const myWork of results) {
      const oPayload: any = {};
      oPayload.caption = `${myWork.pxRefObjectInsName} - ${myWork.pxTaskLabel}`;
      oPayload.pzInsKey = myWork.pzInsKey;
      oPayload.pxRefObjectClass = myWork.pxRefObjectClass;

      this.arOpenWorkItems.push(oPayload);
    }
  }

  getSimpleMainHtml(): any {
    const sMHtml: any[] = [];

    sMHtml.push(html`${this.getToolbarHtml()}`);

    if (this.bHasPConnect) {
      sMHtml.push(html`${this.getNavigationHtml()}`);
    }

    return sMHtml;
  }

  render() {
    const sContent = this.getSimpleMainHtml();
    const locBootstrap = SdkConfigAccess.getSdkConfigBootstrapCSS();

    const arHtml: any[] = [];

    // SimpleMain not derived from BridgeBase, so we need to load Bootstrap CSS
    arHtml.push(html`<link rel="stylesheet" href="${locBootstrap}" />`);

    arHtml.push(simpleMainStyles);
    arHtml.push(sContent);

    return arHtml;
  }

  /**
   * kick off the Mashup that we're trying to serve up
   */
  startMashup() {
    this.bShowRoot = true;

    // NOTE: When loadMashup is complete, this will be called.
    PCore.onPCoreReady(renderObj => {
      // Check that we're seeing the PCore version we expect
      compareSdkPCoreVersions();

      // Need to register the callback function for PCore.registerComponentCreator
      //  This callback is invoked if/when you call a PConnect createComponent
      PCore.registerComponentCreator(c11nEnv => {
        return c11nEnv;
      });

      // Now, do the initial render...
      this.initialRender(renderObj);
    });

    // load the Mashup and handle the onPCoreEntry response that establishes the
    //  top level Pega root element (likely a RootContainer)

    myLoadMashup('pega-root', false); // this is defined in bootstrap shell that's been loaded already
  }

  /**
   * Callback from onPCoreReady that's called once the top-level render object
   * is ready to be rendered
   * @param inRenderObj the initial, top-level PConnect object to render
   */
  initialRender(inRenderObj) {
    /// /// This was done on login and kicked off the creation of this
    /// ///  AppEntry. So don't need to to do this.
    // With Constellation Ready, replace <div id="pega-here"></div>
    //  with top-level ViewContainer
    // const replaceMe = document.getElementById("pega-here");
    // const replacement = document.createElement("app-entry");
    // replacement.setAttribute("id", "pega-root");
    // if (replaceMe) { replaceMe.replaceWith(replacement); }

    this.bHasPConnect = true;

    const { props } = inRenderObj;
    this.props = props;

    // this.thePConnComponentName = this.props.getPConnect().getComponentName();

    // console.log(` --> thePConnComponentName: ${this.thePConnComponentName}`);
  }
}

export default SimpleMain;
