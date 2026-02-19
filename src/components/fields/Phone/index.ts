import { html, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { FormComponentBase } from '../FormComponentBase';

// NOTE: you need to import ANY component you may render.
import '@lion/ui/define/lion-input-tel-dropdown.js';
import '../../designSystemExtension/FieldValueList';
import handleEvent from '../../../helpers/event-utils';

// import the component's styles as HTML with <style>
import { phoneStyles } from './phone-styles';

@customElement('phone-form')
class Phone extends FormComponentBase {
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
    this.theComponentStyleTemplate = phoneStyles;
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

  fieldOnChange(event: any) {
    if (this.bDebug) {
      debugger;
    }

    if (this.bLogging) {
      console.log(`--> fieldOnChange: ${this.componentBaseComponentName} for ${this.theComponentName}`);
    }

    let newVal = event.target.value ?? '';
    const phoneValue = event?.target?.value;
    let phoneNumber = phoneValue.split(' ').slice(1).join();
    phoneNumber = phoneNumber ? `+${phoneValue && phoneValue.replace(/\D+/g, '')}` : '';
    newVal = phoneNumber;
    if (newVal) {
      handleEvent(this.actionsApi, 'change', this.propName, newVal);
    }
  }

  fieldOnBlur(event: any) {
    if (this.bDebug) {
      debugger;
    } // PConnect wants to use eventHandler for onBlur

    if (this.bLogging) {
      console.log(`--> fieldOnBlur: ${this.componentBaseComponentName} for ${this.theComponentName}`);
    }

    const oldVal = this.value ?? '';
    let newVal = event.target.value ?? '';
    const phoneValue = event?.target?.value;
    let phoneNumber = phoneValue.split(' ').slice(1).join();
    phoneNumber = phoneNumber ? `+${phoneValue && phoneValue.replace(/\D+/g, '')}` : '';
    newVal = phoneNumber;

    const isValueChanged = newVal?.toString() !== oldVal.toString();

    if (isValueChanged && newVal) {
      handleEvent(this.actionsApi, 'changeNblur', this.propName, newVal);
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

    if (this.displayMode) {
      return html` <field-value-list .label="${this.label}" .value="${this.value}" .displayMode="${this.displayMode}"> </field-value-list> `;
    }

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
    const theContent = html`${this.bVisible
      ? html` <div class="form-group">
          <lion-input-tel-dropdown
            id=${this.theComponentId}
            dataTestId=${this.testId}
            .modelValue=${this.value || '+1'}
            .preferredRegions="${['US']}"
            .activeRegion="US"
            .validators=${this.lionValidatorsArray}
            .feedbackCondition=${this.requiredFeedbackCondition.bind(this)}
            ?readonly=${this.bReadonly}
            ?disabled=${this.bDisabled}
            @click=${this.fieldOnChange}
            @blur=${this.fieldOnBlur}
          >
            <span slot="label">${this.annotatedLabel}</span>
          </lion-input-tel-dropdown>
        </div>`
      : nothing}`;

    this.renderTemplates.push(theContent);

    // There shouldn't be any chidren
    // this.addChildTemplates();

    return this.renderTemplates;
  }
}

export default Phone;
