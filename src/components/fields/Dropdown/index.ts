import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FormComponentBase } from '../FormComponentBase';
import { Utils } from '../../../helpers/utils';
import type { PConnFieldProps } from '../../../types/PConnProps.interface';

// NOTE: you need to import ANY component you may render.
import '@lion/ui/define/lion-select.js';

// import the component's styles as HTML with <style>
import { dropdownStyles } from './dropdown-styles';

interface DropdownProps extends PConnFieldProps {
  // If any, enter additional props that only exist on Dropdown here
  datasource?: any[];
  onRecordChange?: any;
  fieldMetadata?: any;
  listType?: any;
}

// NOTE: this is just a boilerplate component definition intended
//  to be used as a starting point for any new components as they're built out
@customElement('dropdown-form')
class Dropdown extends FormComponentBase {
  @property({ attribute: false, type: Array }) options;
  @property({ attribute: true, type: String }) datasource = '';

  dataList: any = [];
  fieldMetadata: any = [];
  localeContext = '';
  localeClass = '';
  localeName = '';
  localePath = '';
  localizedValue = '';
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
    this.theComponentStyleTemplate = dropdownStyles;
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

  attributeChangedCallback(name, oldValue, newValue) {
    // eslint-disable-next-line sonarjs/no-collapsible-if
    if (name === 'datasource') {
      if (newValue && oldValue !== newValue) {
        this.dataList = JSON.parse(newValue);
        this.updateSelf();
      }
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

    const theConfigProps = this.thePConn.resolveConfigProps(this.thePConn.getConfigProps()) as DropdownProps;

    if (this.dataList.length > 0) {
      theConfigProps.datasource = this.dataList;
      theConfigProps.listType = 'associated';
    }

    const optionsList = Utils.getOptionList(theConfigProps, this.thePConn.getDataObject());
    const index = optionsList?.findIndex(ele => ele.key === 'Select');
    if (index < 0) {
      optionsList?.unshift({ key: 'Select', value: this.thePConn.getLocalizedValue('Select...', '', '') });
    }
    this.options = optionsList;

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
  }

  // Comment that was in the original fieldOnChange before we started to use
  //  the super class implementation
  // NOTE: for lion-radio-group, the clicked button will be in event.target.modelValue
  //  See https://lion-web-components.netlify.app/?path=/docs/forms-radio-group--main

  isSelected(buttonValue: string): boolean {
    return this.value === buttonValue;
  }

  getErrorMessage() {
    const tempError = `${this.theComponentName}: getErrorMessage needs to have a field control implemented.`;
    const errMessage: string = tempError;

    console.error(tempError);

    // // look for validation messages for json, pre-defined or just an error pushed from workitem (400)
    // if (this.fieldControl.hasError('message')) {
    //   errMessage = this.validateMessage;
    // }
    // else if (this.fieldControl.hasError('required')) {

    //   errMessage = 'You must enter a value';
    // }
    // else if (this.fieldControl.errors) {

    //   errMessage = this.fieldControl.errors.toString();

    // }

    return errMessage;
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
          value=${this.localizedValue}
          testId=${this.testId}
        >
        </text-form>
      `;
    }

    const theContent = html`${this.bVisible
      ? html` <div>
          ${this.bVisible
            ? html`
              <div class="form-group">
                <lion-select
                  id=${this.theComponentId}
                  dataTestId=${this.testId}
                  .fieldName=${this.label}
                  .modelValue=${this.value === '' && !this.bReadonly ? 'Select' : this.value}
                  .validators = ${this.lionValidatorsArray}
                  .feedbackCondition=${this.requiredFeedbackCondition.bind(this)}
                  ?readonly=${this.bReadonly}
                  ?disabled=${this.bDisabled}
                  /* @model-value-changed=${this.fieldOnChange} */ >
                  <span slot="label">${this.annotatedLabel}</span>
                  <select slot="input">
                    ${this.options.map(option => {
                      return html`<option value=${option.key}>
                        ${this.thePConn.getLocalizedValue(
                          option.value,
                          this.localePath,
                          this.thePConn.getLocaleRuleNameFromKeys(this.localeClass, this.localeContext, this.localeName)
                        )}
                      </option>`;
                    })}
                  </select>
                </lion-radio-group>
              </div>
            `
            : nothing}
        </div>`
      : nothing}`;

    this.renderTemplates.push(theContent);

    // this.addChildTemplates();

    return this.renderTemplates;
    // @model-value-changed=${this.fieldOnChange} >
  }
}

export default Dropdown;
