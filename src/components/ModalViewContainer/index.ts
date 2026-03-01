import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { keyed } from 'lit/directives/keyed.js';
import { BridgeBase } from '../../bridge/BridgeBase';
// NOTE: you need to import ANY component you may render.

// import the component's styles as HTML with <style>
import { modalViewContainerStyles } from './modal-view-container-styles';

import '../CancelAlert';
import '../ListViewActionButtons';
import '../DataViewActionButtons';

//
// WARNING:  It is not expected that this file should be modified.  It is part of infrastructure code that works with
// Redux and creation/update of Redux containers and PConnect.  Modifying this code could have undesireable results and
// is totally at your own risk.
//

interface ModalViewContainerProps {
  getPConnect?: () => typeof PConnect;
  loadingInfo?: boolean;
  routingInfo?: any;
  pageMessages?: string[];
  httpMessages?: string[];
  name?: string;
  correlationID?: string;
}

interface CancelAlertProps {
  heading?: string;
  content?: string;
  getPConnect?: () => typeof PConnect;
  itemKey?: string;
  hideDelete?: boolean;
  isDataObject?: boolean;
  skipReleaseLockRequest?: boolean;
  isInCreateStage?: boolean;
}

const ERROR_WHILE_RENDERING = 'ERROR_WHILE_RENDERING';

@customElement('modal-view-container-component')
class ModalViewContainer extends BridgeBase {
  arNewChildren: any[] = [];
  configProps: ModalViewContainerProps = {};
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
  localeCategory = 'ModalContainer';
  isMultiRecord: any;

  // New properties from React parity
  isDataObject = false;
  dataObjectAction = '';
  dataRecordKeys = '';
  actionID = '';
  isReadOnly = false;
  error = false;
  actionsLoading = false;
  showProgress = false;
  progressMessage = '';

  @state() cancelAlertProps: CancelAlertProps = {};

  // In Web Components, component is not unmounted if the next view also contains the same component.
  // From performance POV it reuses the component and triggers state change. So Lifecycle methods will not be executed.
  // So maintaining a unique id (localComponentId) in modal view container to be used in keyed, updated whenever it's pconn is updated.
  localComponentId?: number;

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

    // local Id will be same as the componentId created in bridge base
    this.localComponentId = this.theComponentId;

    // Setup Subscriptions
    const { PUB_SUB_EVENTS } = PCore.getConstants();
    PCore.getPubSubUtils().subscribe(
      PUB_SUB_EVENTS.EVENT_SHOW_CANCEL_ALERT,
      payload => {
        this.showAlert(payload);
      },
      PUB_SUB_EVENTS.EVENT_SHOW_CANCEL_ALERT /* Unique string for subscription */,
      this.routingInfoRef
    );

    PCore.getPubSubUtils().subscribe(
      ERROR_WHILE_RENDERING,
      () => {
        this.error = true;
        this.requestUpdate();
      },
      `${ERROR_WHILE_RENDERING}-mc-${this.thePConn.getContextName()}`,
      false,
      this.thePConn.getContextName()
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

    const { PUB_SUB_EVENTS } = PCore.getConstants();

    PCore.getPubSubUtils().unsubscribe(PUB_SUB_EVENTS.EVENT_SHOW_CANCEL_ALERT, PUB_SUB_EVENTS.EVENT_SHOW_CANCEL_ALERT);

    PCore.getPubSubUtils().unsubscribe(ERROR_WHILE_RENDERING, `${ERROR_WHILE_RENDERING}-mc-${this.thePConn.getContextName()}`);

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
    this.routingInfoRef = routingInfo;

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

      const { key, latestItem } = this.getKeyAndLatestItem(routingInfo);

      if (latestItem && currentOrder.length > 0) {
        const configObject = this.getConfigObject(latestItem, null);
        const pConnect = configObject?.getPConnect();

        if (pConnect) {
          // THIS is where the ViewContainer creates a View
          //    The config has meta.config.type = "view"

          const caseInfo: any = pConnect.getCaseInfo();
          const caseTypeName = caseInfo.getCaseTypeName();
          const ID = caseInfo.getBusinessID() || caseInfo.getID();

          const isDataObject = routingInfo.items[latestItem.context].resourceType === PCore.getConstants().RESOURCE_TYPES.DATA;
          const dataObjectAction = routingInfo.items[latestItem.context].resourceStatus;
          const isMultiRecord = routingInfo.items[latestItem.context].isMultiRecordData;
          const readOnly = routingInfo.items[latestItem.context].readOnly;
          const itemActionID = routingInfo.items[latestItem.context].actionID;
          const itemShowProgress = latestItem.showProgress;
          const itemProgressMessage = latestItem.progressMessage;
          const itemDataRecordKeys = latestItem.key;
          const { actionName } = latestItem;

          if (readOnly) {
            pConnect.setInheritedProp('displayMode', 'DISPLAY_ONLY');
            pConnect.setInheritedProp('readOnly', true);
          }

          const headingValue = (() => {
            if (isMultiRecord) {
              return routingInfo.items[latestItem.context].heading || this.getModalHeading(dataObjectAction, actionName);
            }
            if (isDataObject) {
              if (actionName) {
                return this.localizedVal(actionName, this.localeCategory);
              }
              return this.getModalHeading(dataObjectAction, actionName);
            }
            return this.determineModalHeaderByAction(actionName, caseTypeName, ID, pConnect?.getCaseLocaleReference());
          })();

          this.createdViewPConn = pConnect; // Important for rendering children

          // Replaces the old child creation logic
          const newCompName = pConnect.getComponentName();
          if (newCompName === 'reference') {
            const referencedViewPConn = pConnect.getReferencedViewPConnect(true);
            this.arNewChildren = [referencedViewPConn];
          } else {
            this.arNewChildren = pConnect.getChildren();
          }

          this.isMultiRecord = isMultiRecord;
          this.isDataObject = isDataObject;
          this.dataObjectAction = dataObjectAction;
          this.dataRecordKeys = itemDataRecordKeys || '';
          this.actionID = itemActionID || '';
          this.isReadOnly = readOnly;
          this.title = headingValue;
          this.itemKey = key;
          this.bShowModal = true;
          this.showProgress = itemShowProgress || false;
          this.progressMessage = itemProgressMessage || '';
          this.context = latestItem.context;
        }
      } else {
        this.bShowModal = false;
        this.oCaseInfo = {};
        this.requestUpdate();
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
    } else if (this.bShowModal) {
      // right now only get one updated when initial display.  So, once modal is up
      // let fall through and do a check with "compareCaseInfoIsDifferent" until fixed
      this.updateSelf();
      // Whenever pconn is modified and modalviewcontainer needs to update self then localComponentId is updated with new unique id
      this.localComponentId = Date.now();
    }
  }

  getModalViewContainerHtml(): any {
    return html`
      ${this.bShowModal
        ? keyed(
            this.localComponentId,
            html`
              <div id="dialog" class="psdk-dialog-background ">
                <div class="psdk-modal-view-container-top" id="${this.buildName}">
                  ${this.title != '' ? html`<h3>${this.title}</h3>` : html``}
                  ${this.error
                    ? html`<div class="psdk-error">
                        ${this.localizedVal('Failed to create the case. Contact the application administrator.', this.localeCategory)}
                      </div>`
                    : html``}
                  <assignment-component
                    .pConn=${this.createdViewPConn}
                    .arChildren=${this.arNewChildren}
                    itemKey=${this.itemKey}
                  ></assignment-component>
                  ${this.isMultiRecord && !this.isReadOnly
                    ? html`
                        <div>
                          <listview-action-buttons-component
                            .pConn=${this.createdViewPConn}
                            .context=${this.context}
                            @DismissModalContainer=${this._dismissModalContainer.bind(this)}
                          >
                          </listview-action-buttons-component>
                        </div>
                      `
                    : html``}
                  ${this.isDataObject && !this.isReadOnly
                    ? html`
                        <div>
                          <data-view-action-buttons-component
                            .pConn=${this.createdViewPConn}
                            .context=${this.context}
                            .classId=${this.createdViewPConn.getValue('.classID')}
                            .dataObjectAction=${this.dataObjectAction}
                            .dataRecordKeys=${this.dataRecordKeys}
                            .actionID=${this.actionID}
                            .disableAllButtons=${false}
                            @DismissModalContainer=${this._dismissModalContainer.bind(this)}
                          >
                          </data-view-action-buttons-component>
                        </div>
                      `
                    : html``}
                </div>
              </div>
            `
          )
        : html``}
      ${this.bShowCancelAlert
        ? html` <cancel-alert-component
            .bShowAlert=${this.bShowCancelAlert}
            @AlertState=${this._onAlertState.bind(this)}
            .pConn=${this.cancelPConn}
            .heading=${this.cancelAlertProps.heading}
            .content=${this.cancelAlertProps.content}
            .itemKey=${this.cancelAlertProps.itemKey}
            .hideDelete=${this.cancelAlertProps.hideDelete}
            .isDataObject=${this.cancelAlertProps.isDataObject}
            .skipReleaseLockRequest=${this.cancelAlertProps.skipReleaseLockRequest}
            .isInCreateStage=${this.cancelAlertProps.isInCreateStage}
          ></cancel-alert-component>`
        : html``}
    `;
  }

  _dismissModalContainer() {
    this.bShowModal = false;
    this.oCaseInfo = {};

    this.requestUpdate();
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

  getModalHeading(dataObjectAction, actionName = '') {
    switch (dataObjectAction) {
      case PCore.getConstants().RESOURCE_STATUS.CREATE:
        return this.localizedVal('Add Record', this.localeCategory);
      case (PCore.getConstants() as any).RESOURCE_STATUS.OPEN_FLOW_ACTION:
        return this.localizedVal(actionName, this.localeCategory);
      default:
        return this.localizedVal('Edit Record', this.localeCategory);
    }
  }

  determineModalHeaderByAction(actionName, caseTypeName, ID, caseLocaleRef) {
    if (actionName) {
      return this.localizedVal(actionName, this.localeCategory);
    }
    return `${this.localizedVal('Create', this.localeCategory)} ${this.localizedVal(caseTypeName, undefined, caseLocaleRef)} (${ID})`;
  }

  getConfigObject(item, pconnect) {
    const isReverseCoexistence = (PCore.getCoexistenceManager().getBroadcastUtils() as any).isReverseCoexistenceCaseLoaded();
    const isInCreateStage = false; // logic for isInCreateStage is complex in react, defaulting to false here as per current WC capabilities

    if (isReverseCoexistence && !isInCreateStage) {
      const config = {
        options: {
          pageReference: pconnect?.getPageReference(),
          hasForm: true,
          containerName: pconnect?.getContainerName() || PCore.getConstants().MODAL
        }
      };
      return PCore.createPConnect(config);
    }

    if (item) {
      const { context, view, isBulkAction } = item;
      const target = PCore.getContainerUtils().getTargetFromContainerItemID(context);
      const config: any = {
        meta: view,
        options: {
          context,
          pageReference: view.config.context || pconnect?.getPageReference(),
          hasForm: true,
          ...(isBulkAction && { isBulkAction }),
          containerName: pconnect?.getContainerName() || PCore.getConstants().MODAL,
          target
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
      this.requestUpdate();
    }
  }

  showAlert(payload) {
    const { latestItem } = this.getKeyAndLatestItem(this.routingInfoRef);
    const isReverseCoexistence = (PCore.getCoexistenceManager().getBroadcastUtils() as any).isReverseCoexistenceCaseLoaded();
    const { isModalAction, hideDelete, isDataObject: isDataObjectPayload, skipReleaseLockRequest, isInCreateStage } = payload;

    /*
      If we are in create stage full page mode, created a new case and trying to click on cancel button
      it will show two alert dialogs which is not expected. Hence isModalAction flag to avoid that.
    */
    if ((latestItem && isModalAction) || isReverseCoexistence) {
      const configObject: any = this.getConfigObject(latestItem, this.thePConn);
      const contextName = configObject?.getPConnect().getContextName();
      this.cancelPConn = configObject.getPConnect();

      this.cancelAlertProps = {
        heading: 'Discard unsaved changes?',
        content: 'You have unsaved changes. You can discard them or go back to keep working.',
        getPConnect: configObject?.getPConnect,
        itemKey: contextName,
        hideDelete,
        isDataObject: isDataObjectPayload,
        skipReleaseLockRequest,
        isInCreateStage
      };

      this.bShowCancelAlert = true;
      this.requestUpdate();
    }
  }

  _buildName(pConnect, name = '') {
    const context = pConnect.getContextName();
    return `${context}/${name}`;
  }

  hasContainerItems(routingInfo) {
    if (routingInfo) {
      const { accessedOrder, items } = routingInfo;
      return accessedOrder && accessedOrder.length > 0 && items;
    }
    return false;
  }

  getKeyAndLatestItem(routinginfo) {
    const pConn = this.thePConn;
    const containerName = pConn.getContainerName();
    const { acTertiary = false } = (pConn.getConfigProps() as any) || {};

    if (PCore.getContainerUtils().hasContainerItems(this._buildName(pConn, containerName))) {
      const { accessedOrder, items } = routinginfo;
      let key;

      for (let i = accessedOrder.length - 1; i >= 0; i -= 1) {
        const tempkey = accessedOrder[i];
        if ((acTertiary && items[tempkey].acTertiary) || (!acTertiary && !items[tempkey].acTertiary)) {
          key = tempkey;
          break;
        }
      }
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
