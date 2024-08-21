import { html, customElement, property, LitElement } from '@lion/core';
import Utils from '../../../helpers/utils';

// import the component's styles as HTML with <style>
import { fieldGroupStyles } from './field-group-styles';

function generateFields(item, fields) {
  // eslint-disable-next-line no-restricted-syntax
  for (const label in item) {
    if (Utils.isObject(item[label])) {
      generateFields(item[label], fields);
    } else if (label !== 'classID') {
      fields.push({ label, value: item[label] });
    }
  }
}

@customElement('field-group')
class FieldGroup extends LitElement {
  @property({ attribute: true, type: Array }) item;
  @property({ attribute: true, type: String }) name;
  fields: any = [];

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();

    generateFields(this.item, this.fields);
  }

  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();
  }

  formatItemValue(value) {
    let formattedVal = value;

    // if the value is an empty string, we want to display it as "---"
    if (formattedVal === '') {
      formattedVal = '---';
    }

    return formattedVal;
  }

  getItems() {
    return html`${this.fields.map(item => {
      return html`
        <div class="field-group-item">
          <div class="field-group-item-label">${item.label}</div>
          <div class="field-group-item-value">${this.formatItemValue(item.value)}</div>
        </div>
      `;
    })}`;
  }

  render() {
    const sContent = html`
      <div class="field-group-container">
        <div class="field-group-title">${this.name}</div>
        <div class="field-group-items">${this.getItems()}</div>
      </div>
    `;

    const arHtml: any[] = [];
    arHtml.push(fieldGroupStyles);
    arHtml.push(sContent);

    return arHtml;
  }
}

export default FieldGroup;
