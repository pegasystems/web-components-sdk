import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { BridgeBase } from '../../bridge/BridgeBase';
// NOTE: you need to import ANY component you may render.

// import the component's styles as HTML with <style>
import { modalViewContainerStyles } from './modal-view-container-styles';

import '../CancelAlert';

//
// WARNING:  It is not expected that this file should be modified.  It is part of infrastructure code that works with
// Redux and creation/update of Redux containers and PConnect.  Modifying this code could have undesireable results and
// is totally at your own risk.
//

@customElement('modal-view-container-component')
class ModalViewContainer extends BridgeBase {
  arNewChildren: any[] = [];
  configProps: Object = {};
  templateName = '';
  buildName = '';
  context = '';
  title = '';
  bShowModal = false;
  itemKey = '';
  oCaseInfo: Object = {};

  routingInfoRef: any = {};

  // created object is now a View with a Template
  //  Use its PConnect to render the CaseView; DON'T replace this.pConn$
  createdViewPConn: any;

  bSubscribed = false;
  cancelPConn: any;
  bShowCancelAlert = false;
  bAlertState = false;
  localizedVal: Function = () => {};
  localeCategory = 'Data Object';

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
    this.theComponentStyleTemplate = modalViewContainerStyles;

    // NOTE: Need to bind the callback to 'this' so it has this element's context when it's called.
    this.registerAndSubscribeComponent(this.onStateChange.bind(this));

    const baseContext = this.thePConn.getContextName();
    const acName = this.thePConn.getContainerName();

    // for now, in general this should be overridden by updateSelf(), and not be blank
    if (this.itemKey === '') {
      this.itemKey = baseContext.concat('/').concat(acName);
    }

    const containerMgr = this.thePConn.getContainerManager();

    containerMgr.initializeContainers({
      type: 'multiple'
    });
    this.localizedVal = PCore.getLocaleUtils().getLocaleValue;
    // const { CONTAINER_TYPE, PUB_SUB_EVENTS } = PCore.getConstants();

    // window.PCore.getPubSubUtils().subscribe(
    //   PUB_SUB_EVENTS.EVENT_SHOW_CANCEL_ALERT,
    //   this.showAlert,
    //   PUB_SUB_EVENTS.EVENT_SHOW_CANCEL_ALERT /* Unique string for subscription */,
    //   this.routingInfoRef
    // );
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

    const { PUB_SUB_EVENTS } = PCore.getConstants();

    PCore.getPubSubUtils().unsubscribe(
      PUB_SUB_EVENTS.EVENT_SHOW_CANCEL_ALERT,
      PUB_SUB_EVENTS.EVENT_SHOW_CANCEL_ALERT /* Should be same unique string passed during subscription */
    );
    this.bSubscribed = false;
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

    // routingInfo was added as component prop in populateAdditionalProps
    const routingInfo = this.getComponentProp('routingInfo');

    const loadingInfo = this.thePConn.getLoadingStatus(''); // 1st arg empty string until typedefs properly allow optional;
    // const configProps = this.thePConn.resolveConfigProps(this.thePConn.getConfigProps());

    if (!loadingInfo) {
      // turn off spinner
      // this.psService.sendMessage(false);
    }

    if (routingInfo && !loadingInfo /* && this.bUpdate */) {
      // console.log(" >> modal view container: has routingInfo");

      const currentOrder = routingInfo.accessedOrder;

      if (undefined == currentOrder) {
        return;
      }

      const currentItems = routingInfo.items;
      // let key = currentOrder[currentOrder.length - 1];

      const { key, latestItem } = this.getKeyAndLatestItem(routingInfo);

      if (currentOrder.length > 0) {
        if (currentItems[key] && currentItems[key].view && Object.keys(currentItems[key].view).length > 0) {
          const currentItem = currentItems[key];
          const rootView = currentItem.view;
          const { context } = rootView.config;
          const config: any = { meta: rootView };
          config.options = {
            context: currentItem.context,
            hasForm: true,
            pageReference: context || this.thePConn.getPageReference()
          };

          if (!this.bSubscribed) {
            this.bSubscribed = true;
            const { PUB_SUB_EVENTS } = PCore.getConstants();
            this.routingInfoRef = routingInfo;
            PCore.getPubSubUtils().subscribe(
              PUB_SUB_EVENTS.EVENT_SHOW_CANCEL_ALERT,
              payload => {
                this.showAlert(payload);
              },
              PUB_SUB_EVENTS.EVENT_SHOW_CANCEL_ALERT,
              this.routingInfoRef
            );
          }

          const configObject = PCore.createPConnect(config);

          // THIS is where the ViewContainer creates a View
          //    The config has meta.config.type = "view"
          const newComp = configObject.getPConnect();
          const newCompName = newComp.getComponentName();
          const caseInfo = newComp && newComp.getDataObject() && newComp.getDataObject().caseInfo ? newComp.getDataObject().caseInfo : null;
          // The metadata for pyDetails changed such that the "template": "CaseView"
          //  is no longer a child of the created View but is in the created View's
          //  config. So, we DON'T want to replace this.pConn$ since the created
          //  component is a View (and not a ViewContainer). We now look for the
          //  "template" type directly in the created component (newComp) and NOT
          //  as a child of the newly created component.
          // console.log(`---> ModalViewContainer created new ${newCompName}`);

          // Use the newly created component (View) info but DO NOT replace
          //  this ModalViewContainer's pConn$, etc.
          //  Note that we're now using the newly created View's PConnect in the
          //  ViewContainer HTML template to guide what's rendered similar to what
          //  the React return of React.Fragment does

          // right now need to check caseInfo for changes, to trigger redraw, not getting
          // changes from angularPconnect except for first draw
          if (newComp && caseInfo && this.compareCaseInfoIsDifferent(caseInfo)) {
            // this.psService.sendMessage(false);

            this.createdViewPConn = newComp;
            const newConfigProps = newComp.getConfigProps();
            this.templateName = 'template' in newConfigProps ? newConfigProps.template : '';

            const { actionName } = latestItem;
            // eslint-disable-next-line @typescript-eslint/no-shadow
            const caseInfo = newComp.getCaseInfo();
            const caseName = caseInfo.getName();
            const ID = caseInfo.getID();

            this.title = actionName || `${this.localizedVal('New', this.localeCategory)} ${caseName} (${ID})`;
            // // update children with new view's children

            // With 8.7, the newly created component can be a Reference to a View
            //  rather than a View itself
            if (newCompName === 'reference') {
              // Reference component doesn't have children. But we can get the
              //  View that it references and that View's children.
              //  So we set the children to the reference's View's children
              //  Note: the underlying components want the children as an array
              //  of getPConnect() and not the children components directly.
              //  So, we need to get referenced View PConnect and get its children
              //  and CANNOT use the simpler, getReferencedView().children

              const referencedViewPConn = newComp.getReferencedViewPConnect(true);
              // children needs to be an array!
              this.arNewChildren = [referencedViewPConn];

              // This approach below works, too. But it seems less clean to skip over
              //  the Reference component like we do here. So, unless problems
              //  are seen, using the approach above instead of this.
              // const referencedChildren = newComp.getReferencedViewPConnect(true).getPConnect().getChildren();
              // this.arNewChildren = referencedChildren;
            } else {
              this.arNewChildren = newComp.getChildren();
            }
            this.bShowModal = true;

            // save off itemKey to be used for finishAssignment, etc.
            this.itemKey = key;

            this.requestUpdate();

            // console.log("view container expect redraw");
          }

          // this will cause a redraw
          // this.cdRef.detectChanges();
        }
      } else {
        this.bShowModal = false;
        this.oCaseInfo = {};
      }
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
      // eslint-disable-next-line sonarjs/no-duplicated-branches
    } else if (this.bShowModal) {
      // right now onlu get one updated when initial diaplay.  So, once modal is up
      // let fall through and do a check with "compareCaseInfoIsDifferent" until fixed
      this.updateSelf();
    }
  }

  getModalViewContainerHtml(): any {
    return html`
      ${this.bShowModal
        ? html`
            <div id="dialog" class="psdk-dialog-background ">
              <div class="psdk-modal-view-container-top" id="${this.buildName}">
                ${this.title != '' ? html`<h3>${this.title}</h3>` : html``}
                <assignment-component
                  .pConn=${this.createdViewPConn}
                  .arChildren=${this.arNewChildren}
                  itemKey=${this.itemKey}
                ></assignment-component>
              </div>
            </div>
          `
        : html``}
      ${this.bShowCancelAlert
        ? html`
      <cancel-alert-component .bShowAlert=${this.bShowCancelAlert} @AlertState=${this._onAlertState}" .pConn=${this.cancelPConn}></app-cancel-alert>`
        : html``}
    `;
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

    const sContent = html`${this.getModalViewContainerHtml()}`;

    this.renderTemplates.push(sContent);

    return this.renderTemplates;
  }

  getConfigObject(item, pConnect) {
    if (item) {
      const { context, view } = item;
      const config = {
        meta: view,
        options: {
          context,
          pageReference: view.config.context || pConnect.getPageReference(),
          hasForm: true
        }
      };
      return PCore.createPConnect(config);
    }
    return null;
  }

  _onAlertState(e: any) {
    this.bAlertState = e.detail.data;
    if (this.bAlertState === false) {
      this.bShowCancelAlert = false;
    }
  }

  showAlert(payload) {
    const { latestItem } = this.getKeyAndLatestItem(this.routingInfoRef);
    const { isModalAction } = payload;

    /*
      If we are in create stage full page mode, created a new case and trying to click on cancel button
      it will show two alert dialogs which is not expected. Hence isModalAction flag to avoid that.
    */
    if (latestItem && isModalAction) {
      const configObject: any = this.getConfigObject(latestItem, this.thePConn);
      this.cancelPConn = configObject.getPConnect();
      this.bShowCancelAlert = true;
      // this.showCancelAlert(configObject.getPConnect, create);
    }
  }

  hasContainerItems(routingInfo) {
    if (routingInfo) {
      const { accessedOrder, items } = routingInfo;
      return accessedOrder && accessedOrder.length > 0 && items;
    }
    return false;
  }

  getKeyAndLatestItem(routinginfo) {
    if (this.hasContainerItems(routinginfo)) {
      const { accessedOrder, items } = routinginfo;
      const key = accessedOrder[accessedOrder.length - 1];
      const latestItem = items[key];
      return { key, latestItem };
    }
    return {};
  }

  compareCaseInfoIsDifferent(oCurrentCaseInfo: Object): boolean {
    let bRet = false;

    if (PCore.isDeepEqual !== undefined) {
      bRet = !PCore.isDeepEqual(this.oCaseInfo, oCurrentCaseInfo);
    } else {
      const sCurrnentCaseInfo = JSON.stringify(oCurrentCaseInfo);
      const sOldCaseInfo = JSON.stringify(this.oCaseInfo);
      // stringify compare version
      if (sCurrnentCaseInfo != sOldCaseInfo) {
        bRet = true;
      }
    }

    // if different, save off new case info
    if (bRet) {
      this.oCaseInfo = JSON.parse(JSON.stringify(oCurrentCaseInfo));
    }

    return bRet;
  }
}

export default ModalViewContainer;
