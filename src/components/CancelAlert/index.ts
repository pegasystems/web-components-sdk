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

  @state() isDeleteInProgress = false;

  connectedCallback() {
    super.connectedCallback();

    // setup this component's styling...
    this.theComponentStyleTemplate = cancelAlertStyles;
  }

  dismissAlert(dismissAll = false) {
    this.dispatchEvent(
      new CustomEvent('AlertState', {
        detail: { data: false, dismissAll }
      })
    );
  }

  /**
   * Handles the deletion of a case in create stage
   */
  _handleDeleteCase(actionsAPI: any) {
    this.isDeleteInProgress = true;

    actionsAPI
      .deleteCaseInCreateStage(this.itemKey, this.hideDelete)
      .then(() => {
        PCore.getPubSubUtils().publish(PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL);
      })
      .catch(() => {
        console.error(this.localizedVal('Delete failed.', this.localeCategory));
      })
      .finally(() => {
        this.isDeleteInProgress = false;
        this.dismissAlert(true);
      });
  }

  /**
   * Handles standard container item removal
   */
  _handleStandardCancel(containerManagerAPI: any) {
    this.dismissAlert(true);
    containerManagerAPI.removeContainerItem({
      containerItemID: this.itemKey,
      skipReleaseLockRequest: this.skipReleaseLockRequest
    });
  }

  /**
   * Main handler for the cancel/discard action, routing to specific handlers based on context
   */
  _cancelHandler() {
    const actionsAPI = this.pConn.getActionsApi();
    const containerManagerAPI = this.pConn.getContainerManager();
    const isLocalAction = this.pConn.getValue(PCore.getConstants().CASE_INFO.IS_LOCAL_ACTION);
    const isBulkAction = this.pConn.options?.isBulkAction;

    if (!this.isDataObject && !isLocalAction && !isBulkAction) {
      this._handleDeleteCase(actionsAPI);
      return;
    }

    if (isLocalAction) {
      this.dismissAlert(true);
      actionsAPI.cancelAssignment(this.itemKey);
      return;
    }

    if (isBulkAction) {
      this.dismissAlert(true);
      actionsAPI.cancelBulkAction(this.itemKey);
      return;
    }

    this._handleStandardCancel(containerManagerAPI);
  }

  render() {
    // To prevent accumulation (and extra rendering) of previous renders, begin each the render
    //  of any component that's a child of BridgeBase with a call to this.prepareForRender();
    this.prepareForRender();

    const sContent = html`
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
                    }}"
                  >
                    ${this.localizedVal('Go back', this.localeCategory)}
                  </button>
                  <button class="btn btn-primary" ?disabled="${this.isDeleteInProgress}" @click="${this._cancelHandler}">
                    ${this.localizedVal('Discard', this.localeCategory)}
                  </button>
                </div>
              </div>
            </div>
          `
        : html``}
    `;

    this.renderTemplates.push(sContent);

    return this.renderTemplates;
  }
}

export default CancelAlert;
