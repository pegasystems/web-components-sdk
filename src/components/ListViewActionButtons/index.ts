import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { bootstrapStyles } from '../../bridge/BridgeBase/bootstrap-styles';
import { actionButtonsStyles } from '../ActionButtons/action-buttons-styles';

@customElement('listview-action-buttons-component')
class ListViewActionButtons extends LitElement {
  static get styles() {
    return bootstrapStyles;
  }

  @property({ attribute: false, type: Object }) pConn: any;
  @property({ attribute: false, type: String }) context = '';

  localizedVal = PCore.getLocaleUtils().getLocaleValue;
  localeCategory = 'Data Object';

  constructor() {
    super();
  }

  aButtonsHtml(): any {
    return html`
      <div class="nq_button_grid">
        <div>
          <button class="btn btn-secondary" buttonType="secondary" @click="${this._onCancel}">
            ${this.localizedVal('Cancel', this.localeCategory)}
          </button>
        </div>
        <div>
          <button class="btn btn-primary" buttonType="primary" @click="${this._onSubmit}">${this.localizedVal('Submit', this.localeCategory)}</button>
        </div>
      </div>
    `;
  }

  _onCancel() {
    this.dispatchDismissModalEvent();
    this.pConn.getActionsApi().cancelDataObject(this.context);
  }

  _onSubmit() {
    this.pConn
      .getActionsApi()
      .submitEmbeddedDataModal(this.context)
      .then(() => {
        this.dispatchDismissModalEvent();
      });
  }

  private dispatchDismissModalEvent() {
    const event = new CustomEvent('DismissModalContainer');
    this.dispatchEvent(event);
  }

  render() {
    const arHtml: any[] = [];
    const sContent = html`${this.aButtonsHtml()}`;
    arHtml.push(actionButtonsStyles);
    arHtml.push(sContent);
    return arHtml;
  }
}

export default ListViewActionButtons;
