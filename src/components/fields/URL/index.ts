import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { FormComponentBase } from '../FormComponentBase';
import handleEvent from '../../../helpers/event-utils';

// NOTE: you need to import ANY component you may render.
import '../../designSystemExtension/LionInputUrl';

// import the component's styles as HTML with <style>
import { urlStyles } from './url-styles';

/*
    TODO: find a true Url Lion webcomponent
*/

@customElement('url-form')
class URL extends FormComponentBase {
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
    this.theComponentStyleTemplate = urlStyles;
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

    const sDisplay = this.bVisible ? 'block' : 'none';

    const theContent = html` <div style="display:${sDisplay};">
      <div class="form-group">
        <lion-input-url
          id=${this.theComponentId}
          name="URL"
          dataTestId=${this.testId}
          .modelValue=${this.value}
          .validators=${this.lionValidatorsArray}
          .fieldName=${this.label}
          .feedbackCondition=${this.requiredFeedbackCondition.bind(this)}
          ?readonly=${this.bReadonly}
          ?disabled=${this.bDisabled}
          @click=${this.fieldOnChange}
          @blur=${this.fieldOnBlur}
          @change=${this.fieldOnChange}
        >
          <span slot="label">${this.annotatedLabel}</span>
        </lion-input-url>
      </div>
    </div>`;

    this.renderTemplates.push(theContent);

    return this.renderTemplates;
  }
}

export default URL;
