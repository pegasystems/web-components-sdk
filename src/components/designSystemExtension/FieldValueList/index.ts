import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { fieldValueListStyles } from './field-value-list-styles';

@customElement('field-value-list')
class FieldValueList extends LitElement {
  @property({ attribute: 'label', type: String }) label = '';
  @property({ attribute: 'value', type: String }) value = '';
  @property({ attribute: 'display-mode', type: String }) displayMode = 'DISPLAY_ONLY';
  @property({ attribute: 'is-html', type: Boolean }) isHtml = false;

  constructor() {
    super();
  }

  renderValue() {
    const displayValue = this.value || '---';

    if (this.isHtml) {
      return html`<div id="instruction-text">${unsafeHTML(displayValue)}</div>`;
    }

    return html`${displayValue}`;
  }

  render() {
    const arHtml: any = [];
    arHtml.push(fieldValueListStyles);

    let content = html``;

    if (this.displayMode === 'DISPLAY_ONLY') {
      const containerClass = this.label ? 'psdk-container-labels-left' : 'psdk-container-nolabels';

      content = html`
        <div class="${containerClass}">
          ${this.label ? html`<div class="psdk-grid-label">${this.label}</div>` : ''}
          <div class="psdk-val-labels-left">${this.renderValue()}</div>
        </div>
      `;
    } else if (this.displayMode === 'STACKED_LARGE_VAL') {
      content = html`
        <div class="psdk-container-stacked-large-val">
          <div class="psdk-grid-label">${this.label}</div>
          <div class="psdk-val-stacked">${this.renderValue()}</div>
        </div>
      `;
    }

    arHtml.push(content);
    return arHtml;
  }
}

export default FieldValueList;
