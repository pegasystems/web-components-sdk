import { html, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { FormComponentBase } from '../FormComponentBase';

// NOTE: you need to import ANY component you may render.
import '@lion/ui/define/lion-input-amount.js';
import '../../designSystemExtension/FieldValueList';
import { format } from '../../../helpers/formatters';
import { getCurrencyOptions } from '../../../helpers/currency-utils';

// import the component's styles as HTML with <style>
import { decimalStyles } from './decimal-styles';
import { loadDefaultFeedbackMessages } from '@lion/ui/validate-messages.js';

@customElement('decimal-form')
class Decimal extends FormComponentBase {
  formatter: any;
  currencyISOCode: any;
  decimalPrecision: number | undefined;
  formatOptions: { style: string; minimumFractionDigits: number | undefined; maximumFractionDigits: number | undefined } | undefined;
  formattedValue: any;
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
    this.theComponentStyleTemplate = decimalStyles;
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

  updateSelf() {
    super.updateSelf();

    const theConfigProps = this.thePConn.getConfigProps();

    if (theConfigProps.formatter) {
      this.formatter = theConfigProps.formatter;
    }
    if (theConfigProps.currencyISOCode) {
      this.currencyISOCode = theConfigProps.currencyISOCode;
    }
    if (theConfigProps.decimalPrecision !== undefined) {
      this.decimalPrecision = parseInt(theConfigProps.decimalPrecision, 10);
    }
    this.formatOptions = {
      style: 'decimal',
      minimumFractionDigits: this.decimalPrecision,
      maximumFractionDigits: this.decimalPrecision
    };
    if (['DISPLAY_ONLY', 'STACKED_LARGE_VAL'].includes(this.displayMode)) {
      const options = {
        ...getCurrencyOptions(this.currencyISOCode),
        decPlaces: this.decimalPrecision
      };

      const formatterType = this.formatter?.toLowerCase();
      this.formattedValue = format(this.value, formatterType, options);
    }
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

    // return if not visible
    if (!this.bVisible) {
      return nothing;
    }

    if (this.displayMode) {
      return html` <field-value-list .label="${this.label}" .value="${this.formattedValue}" .displayMode="${this.displayMode}"> </field-value-list> `;
    }

    // Handle and return if read only rendering
    if (this.bReadonly) {
      const theContent = html`
        <lion-input-amount
          id=${this.theComponentId}
          ?readonly=${this.bReadonly}
          ?visible=${this.bVisible}
          label=${this.label}
          .modelValue=${this.value}
          dataTestId=${this.testId}
        >
        </lion-input-amount>
      `;
      this.renderTemplates.push(theContent);

      return this.renderTemplates;
    }

    loadDefaultFeedbackMessages();

    const theContent = html` <div class="form-group">
      <lion-input-amount
        id=${this.theComponentId}
        name="Amount"
        dataTestId=${this.testId}
        .modelValue=${this.value}
        .fieldName=${this.label}
        .validators=${this.lionValidatorsArray}
        .feedbackCondition=${this.requiredFeedbackCondition.bind(this)}
        ?readonly=${this.bReadonly}
        ?disabled=${this.bDisabled}
        @click=${this.fieldOnChange}
        @blur=${this.fieldOnBlur}
        @change=${this.fieldOnChange}
      >
        <span slot="label">${this.annotatedLabel}</span>
      </lion-input-amount>
    </div>`;

    this.renderTemplates.push(theContent);

    // There shouldn't be any chidren
    // this.addChildTemplates();

    return this.renderTemplates;
  }
}

export default Decimal;
