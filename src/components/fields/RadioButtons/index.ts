import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FormComponentBase } from '../FormComponentBase';
import { Utils } from '../../../helpers/utils';
import { formComponentStyles } from '../FormComponentBase/form-component-styles';
import type { PConnFieldProps } from '../../../types/PConnProps.interface';

// NOTE: you need to import ANY component you may render.
import '@lion/ui/define/lion-radio-group.js';
import '@lion/ui/define/lion-radio.js';
import '../../designSystemExtension/FieldValueList';

// import the component's styles as HTML with <style>
import { radioButtonStyles } from './radio-buttons-styles';

interface RadioButtonsProps extends PConnFieldProps {
  // If any, enter additional props that only exist on RadioButtons here
  inline: boolean;
  fieldMetadata?: any;
}

// NOTE: this is just a boilerplate component definition intended
//  to be used as a starting point for any new components as they're built out
@customElement('radio-buttons-form')
class RadioButtons extends FormComponentBase {
  // NOTE: we override (and replace) the BridgeBase default styles() that is our
  //  Bootstrap CSS since Bootstrap CSS interferes with the default use of "form-control"
  //  and other class use that comes with the @lion/checkbox
  //  But need to keep formComponentStyles...
  static styles = [formComponentStyles];

  @property({ attribute: false, type: Array }) options;

  fieldMetadata: any = [];
  localeContext = '';
  localeClass = '';
  localeName = '';
  localePath = '';
  localizedValue = '';
  inline = false;
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

    this.options = [];
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
    this.theComponentStyleTemplate = radioButtonStyles;
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

  /**
   * updateSelf
   */
  updateSelf() {
    if (this.bLogging) {
      console.log(`${this.theComponentName}: updateSelf`);
    }
    if (this.bDebug) {
      debugger;
    }

    super.updateSelf();

    // Some additional processing
    const theConfigProps = this.thePConn.getConfigProps() as RadioButtonsProps;

    this.options = Utils.getOptionList(theConfigProps, this.thePConn.getDataObject());

    const propName = this.thePConn.getStateProps().value;
    const className = this.thePConn.getCaseInfo().getClassName();
    const refName = propName?.slice(propName.lastIndexOf('.') + 1);

    this.fieldMetadata = theConfigProps.fieldMetadata;
    const metaData = Array.isArray(this.fieldMetadata)
      ? this.fieldMetadata.filter((field: any) => field?.classID === className)[0]
      : this.fieldMetadata;

    let displayName = metaData?.datasource?.propertyForDisplayText;
    displayName = displayName?.slice(displayName.lastIndexOf('.') + 1);
    this.localeContext = metaData?.datasource?.tableType === 'DataPage' ? 'datapage' : 'associated';
    this.localeClass = this.localeContext === 'datapage' ? '@baseclass' : className;
    this.localeName = this.localeContext === 'datapage' ? metaData?.datasource?.name : refName;
    this.localePath = this.localeContext === 'datapage' ? displayName : this.localeName;

    this.localizedValue = this.thePConn.getLocalizedValue(
      this.value,
      this.localePath,
      this.thePConn.getLocaleRuleNameFromKeys(this.localeClass, this.localeContext, this.localeName)
    );
    this.inline = theConfigProps.inline;
  }

  // The original implementation of fieldOnChange before we switched to using the super class implementation
  //  had this comment
  // NOTE: for lion-radio-group, the clicked button will be in event.target.modelValue
  //  See https://lion-web-components.netlify.app/?path=/docs/forms-radio-group--main

  isSelected(buttonValue: string): boolean {
    return this.value === buttonValue;
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
          value=${this.localizedValue}
          testId=${this.testId}
        >
        </text-form>
      `;
    }

    const theContent = html` <div>
      ${this.bVisible
        ? html`
            <div class="mat-form-field-infix radio-group-form">
              <lion-radio-group
                id=${this.theComponentId}
                dataTestId=${this.testId}
                .fieldName=${this.label}
                .modelValue=${this.value}
                .validators=${this.lionValidatorsArray}
                ?readonly=${this.bReadonly}
                ?disabled=${this.bDisabled}
                .feedbackCondition=${this.requiredFeedbackCondition.bind(this)}
                @click=${this.fieldOnChange}
                @blur=${this.fieldOnBlur}
                @change=${this.fieldOnChange}
              >
                <span slot="label" class="radio-group-label">${this.annotatedLabel}</span>
                <div class=${this.inline ? 'psdk-radio-horizontal' : 'psdk-radio-vertical'}>
                  ${this.options.map((option: any) => {
                    const val = this.thePConn.getLocalizedValue(
                      option.value,
                      this.localePath,
                      this.thePConn.getLocaleRuleNameFromKeys(this.localeClass, this.localeContext, this.localeName)
                    );
                    return option.key === this.value
                      ? html` <lion-radio class="psdk-radio-button" checked label=${val} .choiceValue=${option.key}></lion-radio>`
                      : html` <lion-radio class="psdk-radio-button" label=${val} .choiceValue=${option.key}></lion-radio>`;
                  })}
                </div>
              </lion-radio-group>
            </div>
          `
        : nothing}
    </div>`;

    this.renderTemplates.push(theContent);

    // this.addChildTemplates();

    return this.renderTemplates;
  }
}

export default RadioButtons;
