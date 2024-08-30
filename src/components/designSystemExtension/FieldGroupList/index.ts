import { html, customElement, property, LitElement } from '@lion/core';
import Utils from '../../../helpers/utils';

// import the component's styles as HTML with <style>
import { fieldGroupListStyles } from './field-group-list-styles';

@customElement('field-group-list')
class FieldGroupList extends LitElement {
  @property({ attribute: true, type: Array }) items;
  menuIconDelete: any;

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();

    this.menuIconDelete = Utils.getImageSrc('trash', Utils.getSDKStaticContentUrl());
  }

  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();
  }

  /**
   *
   * @param inName the metadata <em>name</em> that will cause a region to be returned
   */
  getChildRegionArray(child: any) {
    const theMetadataType: string = child.getPConnect().getRawMetadata().type.toLowerCase();

    if (theMetadataType === 'region') {
      return html`<region-component .pConn=${child.getPConnect()}></region-component>`;
    }
    return null;
  }

  addRecord() {
    const event = new CustomEvent('onAdd');
    this.dispatchEvent(event);
  }

  deleteRecord(index) {
    const event = new CustomEvent('onDelete', { detail: index });
    this.dispatchEvent(event);
  }

  render() {
    const sContent = html`
      <div class="field-group-list-items">
        ${this.items.map((item, index) => {
          return html`
            <div class="field-group-list-item">
              <div class="field-group-list-item-title">
                ${item.name}
                <button type="button" id="delete-button" class="psdk-utility-button" @click=${() => this.deleteRecord(index)}>
                  <img class="psdk-utility-card-action-svg-icon" src=${this.menuIconDelete} />
                </button>
              </div>
              ${this.getChildRegionArray(item.children)}
            </div>
          `;
        })}
      </div>
    `;

    const addButton = html`<button style="font-size: 16px;" class="btn btn-link" @click=${this.addRecord}>+ Add</button>`;

    const arHtml: any[] = [];
    arHtml.push(fieldGroupListStyles);
    arHtml.push(sContent);
    arHtml.push(addButton);

    return arHtml;
  }
}

export default FieldGroupList;
