import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BridgeBase } from '../../bridge/BridgeBase';
// NOTE: you need to import ANY component you may render.
import '../designSystemExtension/ProgressIndicator';

// import the component's styles as HTML with <style>
import { deferLoadStyles } from './defer-load-styles';

//
// WARNING:  It is not expected that this file should be modified.  It is part of infrastructure code that works with
// Redux and creation/update of Redux containers and PConnect.  Modifying this code could have undesireable results and
// is totally at your own risk.
//

@customElement('defer-load-component')
class DeferLoad extends BridgeBase {
  @property({ attribute: true, type: Object }) loadData: any = {};
  // Making bShowDefer a property lets LitElement track it and trigger an update if it changes
  @property({ attribute: false, type: Boolean }) bShowDefer = false;
  @property({ attribute: false }) name;

  componentName = '';

  loadedPConn: any;
  loadViewCaseID: any;
  containerName: any;
  constants: any;
  CASE: any;
  PAGE: any;
  DATA: any;
  resourceType: any;
  isContainerPreview: boolean;
  deferLoadId: any;
  currentLoadedAssignment = '';
  isLoading = true;

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

    // this.pConn = {};
    this.constants = PCore.getConstants();
    this.isContainerPreview = false;
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

    // NOTE: Need to bind the callback to 'this' so it has this element's context when it's called.
    this.registerAndSubscribeComponent(this.onStateChange.bind(this));
  }

  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();
    if (this.bLogging) {
      console.log(`${this.theComponentName}: disconnectedCallback`);
    }
  }

  /**
   * The `onStateChange()` method will be called when the state is updated.
   *  Override this method in each class that extends BridgeBase.
   *  This implementation can be used for common code that should be done for
   *  all components that are derived from BridgeBase
   */
  onStateChange() {
    const theRequestedAssignment = this.thePConn.getValue(PCore.getConstants().CASE_INFO.ASSIGNMENT_LABEL);
    if (theRequestedAssignment !== this.currentLoadedAssignment) {
      this.currentLoadedAssignment = theRequestedAssignment;
      this.loadActiveTab();
    }
  }

  loadActiveTab() {
    if (this.resourceType === this.DATA) {
      // Rendering defer loaded tabs in data context
      if (this.containerName) {
        const dataContext = PCore.getStoreValue('.dataContext', 'dataInfo', this.containerName);
        const dataContextParameters = PCore.getStoreValue('.dataContextParameters', 'dataInfo', this.containerName);

        this.thePConn
          .getActionsApi()
          .showData(this.name, dataContext, dataContextParameters, {
            skipSemanticUrl: true,
            isDeferLoaded: true
          })
          .then(data => {
            this.onResponse(data);
          });
      } else {
        console.error('Cannot load the defer loaded view without container information');
      }
    } else if (this.resourceType === this.PAGE) {
      // Rendering defer loaded tabs in case/ page context
      this.thePConn
        .getActionsApi()
        .loadView(encodeURI(this.loadViewCaseID), this.name, this.getViewOptions())
        .then(data => {
          this.onResponse(data);
        });
    } else {
      this.thePConn
        .getActionsApi()
        .refreshCaseView(encodeURI(this.loadViewCaseID), this.name, null)
        .then(data => {
          this.onResponse(data.root);
        })
        .catch(error => {
          console.log(`error: ${error}`);
        });
    }
  }

  getViewOptions = () => ({
    viewContext: this.resourceType,
    // @ts-ignore - parameter “contextName” for getDataObject method should be optional
    pageClass: this.loadViewCaseID ? '' : this.pConn$.getDataObject().pyPortal.classID,
    container: this.isContainerPreview ? 'preview' : null,
    containerName: this.isContainerPreview ? 'preview' : null,
    updateData: this.isContainerPreview
  });

  onResponse(data) {
    this.isLoading = false;
    if (this.deferLoadId) {
      PCore.getDeferLoadManager().start(
        this.name,
        this.thePConn.getCaseInfo().getKey(),
        this.thePConn.getPageReference().replace('caseInfo.content', ''),
        this.thePConn.getContextName(),
        this.deferLoadId
      );
    }

    if (data && !(data.type && data.type === 'error')) {
      const config = {
        meta: data,
        options: {
          context: this.thePConn.getContextName(),
          pageReference: this.thePConn.getPageReference()
        }
      };
      const configObject = PCore.createPConnect(config);
      configObject.getPConnect().setInheritedProp('displayMode', 'LABELS_LEFT');
      this.loadedPConn = configObject.getPConnect();
      this.componentName = this.loadedPConn.getComponentName();
      // ${BridgeBase.getComponentFromConfigObj(config)}
      if (this.deferLoadId) {
        PCore.getDeferLoadManager().stop(this.deferLoadId, this.thePConn.getContextName());
      }
    }
    this.requestUpdate();
  }

  getDeferLoadHtml(): any {
    const arComponent: any[] = [];

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

    // eslint-disable-next-line sonarjs/prefer-immediate-return
    const dLHtml = html`
      <div class="container-for-progress">
        ${!this.isLoading
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
    if (changedProperties.has('loadData')) {
      // @ts-ignore - second parameter pageReference for getValue method should be optional
      this.loadViewCaseID = this.thePConn.getValue(this.constants.PZINSKEY) || this.thePConn.getValue(this.constants.CASE_INFO.CASE_INFO_ID);
      let containerItemData;
      const targetName = this.thePConn.getTarget();
      if (targetName) {
        this.containerName = PCore.getContainerUtils().getActiveContainerItemName(targetName);
        containerItemData = PCore.getContainerUtils().getContainerItemData(targetName, this.containerName);
      }
      const { CASE, PAGE, DATA } = this.constants.RESOURCE_TYPES;
      this.CASE = CASE;
      this.PAGE = PAGE;
      this.DATA = DATA;

      const { resourceType = this.CASE } = containerItemData || { resourceType: this.loadViewCaseID ? this.CASE : this.PAGE };
      this.resourceType = resourceType;
      this.isContainerPreview = /preview_[0-9]*/g.test(this.thePConn.getContextName());

      const theConfigProps: any = this.thePConn.getConfigProps();
      this.deferLoadId = theConfigProps.deferLoadId;
      this.name = this.name || theConfigProps.name;

      this.loadActiveTab();
    }
  }
}

export default DeferLoad;
