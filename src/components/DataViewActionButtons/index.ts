import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { dataViewActionButtonsStyles } from './data-view-action-buttons-styles';
import { bootstrapStyles } from '../../bridge/BridgeBase/bootstrap-styles';

function getActionLabel(action: string, constants: { RESOURCE_STATUS: Record<string, unknown> }) {
  switch (action) {
    case constants.RESOURCE_STATUS.UPDATE:
      return 'Update';
    case constants.RESOURCE_STATUS.CREATE:
      return 'Submit';
    case constants.RESOURCE_STATUS.OPEN_FLOW_ACTION:
      return 'Submit';
    default:
      return 'Submit';
  }
}

@customElement('data-view-action-buttons-component')
class DataViewActionButtons extends LitElement {
  static styles = [bootstrapStyles, dataViewActionButtonsStyles];

  @property({ attribute: false, type: Object }) pConn: any;
  @property({ attribute: false, type: String }) context = '';
  @property({ attribute: false, type: String }) classId = '';
  @property({ attribute: false, type: String }) dataObjectAction = '';
  @property({ attribute: false, type: String }) dataRecordKeys = '';
  @property({ attribute: false, type: String }) actionID = '';
  @property({ attribute: false, type: Boolean }) disableAllButtons = false;

  localizedVal = PCore.getLocaleUtils().getLocaleValue;
  localeCategory = 'Data Object';

  @state() isDisabled = false;

  constructor() {
    super();
  }

  _handleSubmitAction() {
    this.isDisabled = true;
    const constants: any = PCore.getConstants();
    const actionsApi = this.pConn.getActionsApi();

    if (constants.RESOURCE_STATUS[this.dataObjectAction] === constants.RESOURCE_STATUS.CREATE) {
      actionsApi
        .createDataObject(this.context)
        .then((data: unknown) => {
          PCore.getPubSubUtils().publish((constants.PUB_SUB_EVENTS as any).DATA_EVENTS.DATA_OBJECT_CREATED, {
            classId: this.classId,
            data
          });
          this._closeActionsDialog();
        })
        .catch(() => {
          PCore.getPubSubUtils().publish('ERROR_WHILE_RENDERING');
        })
        .finally(() => {
          this.isDisabled = false;
        });
    } else if (constants.RESOURCE_STATUS[this.dataObjectAction] === constants.RESOURCE_STATUS.UPDATE) {
      actionsApi
        .updateDataObject(this.context, JSON.parse(this.dataRecordKeys))
        .then(() => {
          PCore.getPubSubUtils().publish((constants.PUB_SUB_EVENTS as any).DATA_EVENTS.DATA_OBJECT_UPDATED, {
            classId: this.classId
          });
          this._closeActionsDialog();
        })
        .catch(() => {
          PCore.getPubSubUtils().publish('ERROR_WHILE_RENDERING');
        })
        .finally(() => {
          this.isDisabled = false;
        });
    } else if (constants.RESOURCE_STATUS[this.dataObjectAction] === constants.RESOURCE_STATUS.OPEN_FLOW_ACTION) {
      actionsApi
        .submitDataObjectAction(this.context, JSON.parse(this.dataRecordKeys), this.actionID)
        .then(() => {
          PCore.getPubSubUtils().publish((constants.PUB_SUB_EVENTS as any).DATA_EVENTS.DATA_OBJECT_UPDATED, {
            classId: this.classId,
            actionID: this.actionID
          });
          this._closeActionsDialog();
        })
        .catch(() => {
          PCore.getPubSubUtils().publish('ERROR_WHILE_RENDERING');
        })
        .finally(() => {
          this.isDisabled = false;
        });
    }
  }

  _handleCancelAction() {
    this.pConn.getActionsApi().cancelDataObject(this.context);
  }

  _closeActionsDialog() {
    this.dispatchEvent(new CustomEvent('DismissModalContainer', { bubbles: true, composed: true }));
  }

  render() {
    const actionName = this.localizedVal(
      getActionLabel((PCore.getConstants().RESOURCE_STATUS as any)[this.dataObjectAction] as string, PCore.getConstants() as any),
      this.localeCategory
    );

    return html`
      <div class="div">
        <button class="btn btn-secondary button" ?disabled="${this.disableAllButtons || this.isDisabled}" @click="${this._handleCancelAction}">
          ${this.localizedVal('Cancel', this.localeCategory)}
        </button>
        <button class="btn btn-primary button" ?disabled="${this.disableAllButtons || this.isDisabled}" @click="${this._handleSubmitAction}">
          ${actionName}
        </button>
      </div>
    `;
  }
}

export default DataViewActionButtons;
