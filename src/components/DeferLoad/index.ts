import { html, customElement, property } from '@lion/core';
import { BridgeBase } from '../../bridge/BridgeBase';
// NOTE: you need to import ANY component you may render.
import '../designSystemExtension/ProgressIndicator';

// import the component's styles as HTML with <style>
import { deferLoadStyles } from './defer-load-styles';

// Declare that PCore will be defined when this code is run
declare var PCore: any;

//
// WARNING:  It is not expected that this file should be modified.  It is part of infrastructure code that works with
// Redux and creation/update of Redux containers and PConnect.  Modifying this code could have undesireable results and
// is totally at your own risk.
//

@customElement('defer-load-component')
class DeferLoad extends BridgeBase {
  @property({ attribute: true, type: Object }) loadData = {};
  // Making bShowDefer a property lets LitElement track it and trigger an update if it changes
  @property({ attribute: false, type: Boolean }) bShowDefer = false;

  componentName: string = '';

  loadedPConn: any;

  constructor() {
    //  Note: BridgeBase constructor has 2 optional args:
    //  1st: inDebug - sets this.bLogging: false if not provided
    //  2nd: inLogging - sets this.bLogging: false if not provided.
    //  To get started, we set both to true here. Set to false if you don't need debugger or logging, respectively.
    super(false, false);
    if (this.bLogging) {
      console.log(`${this.theComponentName}: constructor`);
    }
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

    // setup this component's styling...
    this.theComponentStyleTemplate = deferLoadStyles;

    //NOTE: Need to bind the callback to 'this' so it has this element's context when it's called.
    this.registerAndSubscribeComponent(this.onStateChange.bind(this));

    PCore.getPubSubUtils().subscribe(
      PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL,
      data => {
        this.loadActiveTab(data);
      },
      'loadActiveTab'
    );

    PCore.getPubSubUtils().subscribe(
      PCore.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.ASSIGNMENT_SUBMISSION,
      data => {
        this.loadActiveTab(data);
      },
      'loadActiveTab'
    );
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

    PCore.getPubSubUtils().unsubscribe(PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL, 'loadActiveTab');

    PCore.getPubSubUtils().unsubscribe(PCore.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.ASSIGNMENT_SUBMISSION, 'loadActiveTab');
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

    //  JA - Already handled by the check in "updated" callback. Calling again seems to cause race condition
    // this.loadActiveTab();
  }

  loadActiveTab(data: any = {}) {
    if (this.bLogging) {
      console.log(`DeferLoad: loadActiveTab data: ${JSON.stringify(data)} | loadData: ${JSON.stringify(this.loadData)}`);
    }

    const { isModalAction } = data;

    if (this.loadData && this.loadData['config'] && !isModalAction) {
      let name = this.loadData['config'].name;
      let actionsAPI = this.thePConn.getActionsApi();
      let baseContext = this.thePConn.getContextName();
      let basePageReference = this.thePConn.getPageReference();
      let loadView = actionsAPI.loadView.bind(actionsAPI);

      this.bShowDefer = false;

      //this.psService.sendMessage(true);

      // Latest version in React uses value for CASE_INFO.CASE_INFO_ID is it exists
      //  and prefers that over PZINSKEY
      loadView(
        encodeURI(this.thePConn.getValue(PCore.getConstants().CASE_INFO.CASE_INFO_ID) || this.thePConn.getValue(PCore.getConstants().PZINSKEY)),
        name
      )
        .then(data => {
          const config = {
            meta: data,
            options: {
              context: baseContext,
              pageReference: basePageReference
            }
          };

          let configObject = PCore.createPConnect(config);

          if (this.loadData['config'].label == 'Details') {
            // for now, prevent details from being drawn
            this.componentName = 'Details';

            this.loadedPConn = configObject.getPConnect();
            this.componentName = this.loadedPConn.getComponentName();
          } else {
            this.loadedPConn = configObject.getPConnect();
            this.componentName = this.loadedPConn.getComponentName();
          }

          // As of 8.7, the loadedPConn may be a Reference component. When we
          //  see one of those, update loadedPConn and componentName to be the
          //  referenced View, not the Reference component itself
          if (this.componentName === 'reference') {
            this.loadedPConn = this.loadedPConn.getReferencedViewPConnect(true).getPConnect();
            this.componentName = 'View';
          }
        })
        .then(() => {
          this.bShowDefer = true;
        });
    }
  }

  /**
   * The `onStateChange()` method will be called when the state is updated.
   *  Override this method in each class that extends BridgeBase.
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

  getDeferLoadHtml(): any {
    const arComponent: Array<any> = [];

    switch (this.componentName) {
      case 'View':
        arComponent.push(html`<view-component .pConn=${this.loadedPConn}></view-component>`);
        break;

      case 'Reference':
      case 'reference':
        arComponent.push(html`<reference-component .pConn=${this.loadedPConn}></reference-component>`);
        break;

      default:
        arComponent.push(html`<div>Defer load missing: ${this.componentName}</div>`);
        break;
    }

    const dLHtml = html`
      <div class="container-for-progress">
        ${this.bShowDefer
          ? html` <div>${arComponent}</div>`
          : html`<div>&nbsp;<br />&nbsp;<br /></div>
              <progress-extension id="${this.theComponentId}"></progress-extension>`}
      </div>
    `;

    return dLHtml;
  }

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

    const sContent = html`${this.getDeferLoadHtml()}`;

    this.renderTemplates.push(sContent);

    return this.renderTemplates;
  }

  willUpdate(changedProperties) {
    for (let key of changedProperties.keys()) {
      // check for property changes, if so, normalize and render
      if (key == 'loadData') {
        this.loadActiveTab();
      }
    }
  }
}

export default DeferLoad;
