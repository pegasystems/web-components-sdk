import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FormComponentBase } from '../FormComponentBase';

// NOTE: you need to import ANY component you may render.
import '@lion/ui/define/lion-input-amount.js';

// import the component's styles as HTML with <style>
import { percentageStyles } from './percentage-styles';

// NOTE: this is just a boilerplate component definition intended
//  to be used as a starting point for any new components as they're built out
@customElement('percentage-form')
class Percentage extends FormComponentBase {

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
    this.theComponentStyleTemplate = percentageStyles;

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

  updateSelf() {
    super.updateSelf();

    // Reset to defaults

    // const theConfigProps = this.thePConn.getConfigProps();

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
          .formatOptions=${{ style: 'percent', minimumFractionDigits: 0, maximumFractionDigits: 4 }}
          .validators=${this.lionValidatorsArray}
          .feedbackCondition=${this.requiredFeedbackCondition.bind(this)}
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

export default Percentage;
