import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { BridgeBase } from '../../bridge/BridgeBase';
import { cancelAlertStyles } from './cancel-alert-styles';

@customElement('cancel-alert-component')
class CancelAlert extends BridgeBase {
  @property({ attribute: false, type: Boolean }) bShowAlert = false;
  @property({ attribute: false, type: String }) heading = '';
  @property({ attribute: false, type: String }) content = '';
  @property({ attribute: false, type: Object }) pConn: any;
  @property({ attribute: false, type: String }) itemKey = '';
  @property({ attribute: false, type: Boolean }) hideDelete = false;
  @property({ attribute: false, type: Boolean }) isDataObject = false;
  @property({ attribute: false, type: Boolean }) skipReleaseLockRequest = false;
  @property({ attribute: false, type: Boolean }) isInCreateStage = false;

  localizedVal = PCore.getLocaleUtils().getLocaleValue;
  localeCategory = 'ModalContainer';

  @state() buttonsState = {
    DELETE: false
  };

  constructor() {
    super(false, false);
    if (this.bLogging) {
      console.log(`${this.theComponentName}: constructor`);
    }
    if (this.bDebug) {
      debugger;
    }
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
    this.theComponentStyleTemplate = cancelAlertStyles;

    // NOTE: Need to bind the callback to 'this' so it has this element's context when it's called.
    this.registerAndSubscribeComponent(this.onStateChange.bind(this));
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

  dismissAlert(dismissAll = false) {
    this.dispatchEvent(
      new CustomEvent('AlertState', {
        detail: { data: false, dismissAll }
      })
    );
  }

  _cancelHandler() {
    const actionsAPI = this.pConn.getActionsApi();
    const containerManagerAPI = this.pConn.getContainerManager();
    const isLocalAction = this.pConn.getValue(PCore.getConstants().CASE_INFO.IS_LOCAL_ACTION);
    const isBulkAction = this.pConn.options?.isBulkAction;
    const broadCastUtils: any = PCore.getCoexistenceManager().getBroadcastUtils();
    const isReverseCoexistence = broadCastUtils.isReverseCoexistenceCaseLoaded();

    if (isReverseCoexistence && !this.isInCreateStage) {
      this.dismissAlert(true);
      PCore.getPubSubUtils().publish((PCore.getConstants().PUB_SUB_EVENTS as any).REVERSE_COEXISTENCE_EVENTS.HANDLE_DISCARD);
    } else if (!this.isDataObject && !isLocalAction && !isBulkAction) {
      this.buttonsState.DELETE = true;
      this.requestUpdate();

      actionsAPI
        .deleteCaseInCreateStage(this.itemKey, this.hideDelete)
        .then(() => {
          PCore.getPubSubUtils().publish(PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL);
        })
        .catch(() => {
          console.error(this.localizedVal('Delete failed.', this.localeCategory));
        })
        .finally(() => {
          this.buttonsState.DELETE = false;
          this.requestUpdate();
          this.dismissAlert(true);
        });
    } else if (isLocalAction) {
      this.dismissAlert(true);
      actionsAPI.cancelAssignment(this.itemKey);
    } else if (isBulkAction) {
      this.dismissAlert(true);
      actionsAPI.cancelBulkAction(this.itemKey);
    } else {
      this.dismissAlert(true);
      containerManagerAPI.removeContainerItem({
        containerItemID: this.itemKey,
        skipReleaseLockRequest: this.skipReleaseLockRequest
      });
    }
  }

  getCancelAlertHtml() {
    const broadCastUtils: any = PCore.getCoexistenceManager().getBroadcastUtils();
    const isReverseCoexistence = broadCastUtils.isReverseCoexistenceCaseLoaded();

    return html`
      ${this.bShowAlert
        ? html`
            <div class="psdk-cancel-alert-background">
              <div class="psdk-cancel-alert-top">
                <h3>${this.localizedVal(this.heading, this.localeCategory)}</h3>
                <div>
                  <p>${this.localizedVal(this.content, this.localeCategory)}</p>
                </div>
                <div class="d-flex justify-content-between mt-4">
                  <button
                    class="btn btn-secondary"
                    @click="${() => {
                      this.dismissAlert();
                      if (isReverseCoexistence) {
                        broadCastUtils.setCallBackFunction(null);
                        broadCastUtils.setIsDirtyDialogActive(false);
                      }
                    }}"
                  >
                    ${this.localizedVal('Go back', this.localeCategory)}
                  </button>
                  <button class="btn btn-primary" ?disabled="${this.buttonsState.DELETE}" @click="${this._cancelHandler}">
                    ${this.localizedVal('Discard', this.localeCategory)}
                  </button>
                </div>
              </div>
            </div>
          `
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

    const sContent = html`${this.getCancelAlertHtml()}`;

    this.renderTemplates.push(sContent);

    return this.renderTemplates;
  }
}

export default CancelAlert;
