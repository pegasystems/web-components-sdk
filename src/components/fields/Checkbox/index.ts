import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FormComponentBase } from '../FormComponentBase';
import { formComponentStyles } from '../FormComponentBase/form-component-styles';
import handleEvent from '../../../helpers/event-utils';

// NOTE: you need to import ANY component you may render.
import '@lion/ui/define/lion-checkbox-group.js';
import '@lion/ui/define/lion-checkbox-indeterminate.js';
import '@lion/ui/define/lion-checkbox.js';
import '../../designSystemExtension/FieldValueList';

// import the component's styles as HTML with <style>
import { checkboxStyles } from './check-box-styles';
import { deleteInstruction, insertInstruction } from '../../../helpers/instructions-utils';
import type { PConnFieldProps } from '../../../types/PConnProps.interface';

interface CheckboxProps extends Omit<PConnFieldProps, 'value'> {
  // If any, enter additional props that only exist on Checkbox here
  // Everything from PConnFieldProps except value and change type of value to boolean
  value: boolean;
  caption?: string;
  trueLabel?: string;
  falseLabel?: string;
  selectionMode?: string;
  datasource?: any;
  selectionKey?: string;
  selectionList?: any;
  primaryField: string;
  readonlyContextList: any;
  referenceList: string;
}

// NOTE: this is just a boilerplate component definition intended
//  to be used as a starting point for any new components as they're built out
@customElement('check-box-form')
class CheckBox extends FormComponentBase {
  // NOTE: we override (and replace) the BridgeBase default styles() that is our
  //  Bootstrap CSS since Bootstrap CSS interferes with the default use of "form-control"
  //  and other class use that comes with the @lion/checkbox
  //  But need to keep formComponentStyles...
  static styles = [formComponentStyles];

  @property({ attribute: false, type: Boolean }) isChecked = false;

  @property({ attribute: false }) checkboxLabelPos = 'after';
  @property({ attribute: false }) caption = 'default caption';

  @property({ attribute: false }) theConfigProps: any = {};
  @property({ attribute: false }) hideLabel: Boolean = false;

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
    this.theComponentStyleTemplate = checkboxStyles;

    // // bind the change events to this
    // this.fieldOnChange = this.fieldOnChange.bind(this);
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

    // Checkbox does some extra processing beyond what's in the super implementation

    this.theConfigProps = this.thePConn.getConfigProps() as CheckboxProps;

    this.hideLabel = this.theConfigProps.hideLabel ?? false;

    // Note: for Checkbox, the "caption" is the label...
    this.caption = this.theConfigProps.caption;

    this.handleChecked();
  }

  handleChecked() {
    // For unknown reasons, the "value" is toggling between "" and false. So test for "" until we figure out why
    if (this.value === 'true' || this.value === 'on') {
      this.isChecked = true;
    } else if (typeof this.value === 'boolean' && this.value === true) {
      this.isChecked = true;
    } else {
      this.isChecked = false;
    }
  }

  // NOTE: Special logic to handle value. Do nothing is the value is the same as current value.
  //  When different, bypass super class version and call onChange directly with new value
  fieldOnChange(event: any) {
    if (this.bDebug) {
      debugger;
    }

    // NOTE: for lion-radio-group, the clicked checkbox will be in event.target.modelValue
    //  that seems to get moved up to the value of event.target.checked
    //  See https://lion-web-components.netlify.app/?path=/docs/forms-checkbox-group--main

    // if (this.isChecked !== event.target.checked) {
    //   this.isChecked = event.target.checked;
    // }

    // handle the caption, since users click on caption as well as checkbox
    if (event.target.tagName === 'SPAN') {
      if (event.target.parentElement.checked) {
        event.target.parentElement.checked = false;
      } else {
        event.target.parentElement.checked = true;
      }
      event.target.parentElement.click();
      return;
    }
    const value = event.target.checked;
    handleEvent(this.actionsApi, 'changeNblur', this.propName, value);
    this.thePConn.clearErrorMessages({
      property: this.propName
    });
  }

  fieldOnBlur(event: any) {
    if (this.selectionMode === 'multi') {
      this.thePConn.getValidationApi().validate(this.selectedvalues, this.selectionList);
    } else {
      this.thePConn.getValidationApi().validate(event.target.checked);
    }
  }

  handleChangeMultiMode(event) {
    if (!event.currentTarget['model-value'].checked) {
      insertInstruction(this.thePConn, this.selectionList, this.selectionKey, this.primaryField, {
        id: event.currentTarget['model-value'].key,
        primary: event.currentTarget['model-value'].value
      });
    } else {
      deleteInstruction(this.thePConn, this.selectionList, this.selectionKey, {
        id: event.currentTarget['model-value'].key,
        primary: event.currentTarget['model-value'].value
      });
    }
    this.thePConn.clearErrorMessages({
      property: this.selectionList,
      category: '',
      context: ''
    });
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
    this.handleChecked();
    if (this.displayMode) {
      return html`
        <field-value-list .label="${this.hideLabel ? '' : this.caption}" .value="${this.value}" .displayMode="${this.displayMode}">
        </field-value-list>
      `;
    }

    // Handle and return if read only rendering
    if (this.bReadonly && this.bVisible) {
      return html`
        <lion-checkbox
          .pConn=${this.thePConn}
          ?disabled=${this.bReadonly}
          label=${this.caption}
          ?checked=${this.isChecked}
          value=${this.value}
          testId=${this.testId}
        >
        </lion-checkbox>
      `;
    }

    const bHideLabel: Boolean = this.getComponentProp('hideLabel');

    if (this.theConfigProps.selectionMode === 'multi') {
      const listOfCheckboxes: any = [];
      const listSourceItems = this.theConfigProps.datasource?.source ?? [];
      const dataField: any = this.theConfigProps.selectionKey?.split?.('.')[1];
      const label = html`<div class="check-box-form">${bHideLabel ? nothing : this.label}</div>`;
      listOfCheckboxes.push(label);
      listSourceItems.forEach((element, index) => {
        const multiChecked = this.selectedvalues?.some?.(data => data[dataField] === element.key);
        const content = html`
          <lion-checkbox
            id=${index}
            ?checked=${multiChecked}
            dataTestId=${this.testId || element.value}
            .model-value=${{
              value: element.text ?? element.value,
              key: element.key,
              checked: this.selectedvalues?.some?.(data => data[dataField] === element.key)
            }}
            @blur=${this.fieldOnBlur}
            @change=${this.handleChangeMultiMode}
          >
            <span slot="label">${element.text ?? element.value}</span>
          </lion-checkbox>
        `;
        listOfCheckboxes.push(content);
      });
      const labelEnd = html`</div>`;
      listOfCheckboxes.push(labelEnd);
      this.renderTemplates.push(listOfCheckboxes);
    } else {
      const theContent = html` ${this.bVisible
        ? html` <div class="check-box-form">
            ${bHideLabel === true ? nothing : html`${this.label}`}
            ${html` <lion-checkbox
              id=${this.theComponentId}
              ?checked=${this.isChecked}
              dataTestId=${this.testId}
              .fieldName=${this.label}
              .validators=${this.lionValidatorsArray}
              .feedbackCondition=${this.requiredFeedbackCondition.bind(this)}
              ?readonly=${this.bReadonly}
              ?disabled=${this.bDisabled}
              .model-value=${{ value: this.caption, checked: this.isChecked }}
              @blur=${this.fieldOnBlur}
              @change=${this.fieldOnChange}
            >
              <span slot="label">${this.caption}</span>
            </lion-checkbox>`}
          </div>`
        : nothing}`;
      this.renderTemplates.push(theContent);
    }

    // this.renderTemplates.push( theContent );

    // There shouldn't be any chidren
    // this.addChildTemplates();

    return this.renderTemplates;
  }
}

export default CheckBox;
