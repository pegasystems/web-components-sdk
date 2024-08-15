import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { FormComponentBase } from "../FormComponentBase";
import { Utils } from "../../../helpers/utils";

// NOTE: you need to import ANY component you may render.
import "@lion/ui/define/lion-input-amount.js";

// import the component's styles as HTML with <style>
import { currencyStyles } from "./currency-styles";

// Declare that PCore will be defined when this code is run
declare var PCore: any;

// NOTE: this is just a boilerplate component definition intended
//  to be used as a starting point for any new components as they're built out
@customElement("currency-form")
class Currency extends FormComponentBase {
  @property({ attribute: false, type: String }) currencyISOCode = "USD";
  @property({ attribute: false, type: Boolean }) bAllowDecimals = true;
  // lion-input-amount options as based on Intl.NumberFormat standard
  @property({ attribute: false, type: Object }) numberOptions = {};

  constructor() {
    //  Note: BridgeBase constructor has 2 optional args:
    //  1st: inDebug - sets this.bLogging: false if not provided
    //  2nd: inLogging - sets this.bLogging: false if not provided.
    //  To get started, we set Debug to false and Logging to true here. Set to your preferred value during development.
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
    this.theComponentStyleTemplate = currencyStyles;

    //NOTE: Need to bind the callback to 'this' so it has this element's context when it's called.
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

  updateSelf() {
    super.updateSelf();

    // Reset to defaults
    this.currencyISOCode = "USD";
    this.bAllowDecimals = true;
    this.numberOptions = {};

    const theConfigProps = this.thePConn.getConfigProps();

    if (
      theConfigProps["currencyISOCode"] !== null &&
      theConfigProps["currencyISOCode"] !== undefined
    ) {
      this.currencyISOCode = theConfigProps["currencyISOCode"];
    }

    if (
      theConfigProps["allowDecimals"] !== null &&
      theConfigProps["allowDecimals"] !== undefined
    ) {
      this.bAllowDecimals = Utils.getBooleanValue(
        theConfigProps["allowDecimals"],
      );
    }

    if (this.bAllowDecimals) {
      // Using normal, 2-decimal point currency
      this.numberOptions = `{ style: 'currency', currency: '${this.currencyISOCode}', minimumFractionDigits: 2, maximumFractionDigits: 2 }`;
    } else {
      // Use no decimal point
      this.numberOptions = `{ style: 'currency', currency: '${this.currencyISOCode}', minimumFractionDigits: 0, maximumFractionDigits: 0 }`;
    }
  }

  render() {
    if (this.bLogging) {
      console.log(
        `${this.theComponentName}: render with pConn: ${JSON.stringify(this.pConn)}`,
      );
    }
    if (this.bDebug) {
      debugger;
    }

    // To prevent accumulation (and extra rendering) of previous renders, begin each the render
    //  of any component that's a child of BridgeBase with a call to this.prepareForRender();
    this.prepareForRender();

    // Handle and return if read only rendering
    if (this.bReadonly) {
      return html`
        <text-form
          .pConn=${this.thePConn}
          ?disabled=${this.bDisabled}
          ?visible=${this.bVisible}
          label=${this.label}
          value=${this.value}
          testId=${this.testId}
        >
        </text-form>
      `;
    }

    // lion-input-amount options as based on Intl.NumberFormat standard
    //  NOTE: we set modelValue to parseFloat(this.value). This helps validation.
    const theContent = html`${this.bVisible
      ? html` <lion-input-amount
          id=${this.theComponentId}
          dataTestId=${this.testId}
          .modelValue=${parseFloat(this.value)}
          .fieldName=${this.label}
          .validators=${this.lionValidatorsArray}
          .feedbackCondition=${this.requiredFeedbackCondition.bind(this)}
          currency=${this.currencyISOCode}
          ?readonly=${this.bReadonly}
          ?disabled=${this.bDisabled}
          @click=${this.fieldOnChange}
          @blur=${this.fieldOnBlur}
          @change=${this.fieldOnChange}
        >
          <span slot="label">${this.annotatedLabel}</span>
        </lion-input-amount>`
      : nothing}`;

    this.renderTemplates.push(theContent);

    return this.renderTemplates;
  }
}

export default Currency;
