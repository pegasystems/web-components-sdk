import { html, css, customElement, property, nothing } from '@lion/core';
import { FormComponentBase } from '../FormComponentBase';
import { Utils } from '../../../helpers/utils';
import { formComponentStyles } from '../FormComponentBase/form-component-styles';


// NOTE: you need to import ANY component you may render.
import '@lion/radio-group/define';

// import the component's styles as HTML with <style>
import { radioButtonStyles } from './radio-buttons-styles';


// Declare that PCore will be defined when this code is run
declare var PCore: any;

// NOTE: this is just a boilerplate component definition intended
//  to be used as a starting point for any new components as they're built out
@customElement('radio-buttons-form')
class RadioButtons extends FormComponentBase {
  // NOTE: we override (and replace) the BridgeBase default styles() that is our
  //  Bootstrap CSS since Bootstrap CSS interferes with the default use of "form-control"
  //  and other class use that comes with the @lion/checkbox
  //  But need to keep formComponentStyles...
  static styles = [ formComponentStyles ];

  @property( {attribute: false, type: Array} ) options;

  constructor() {
    //  Note: BridgeBase constructor has 2 optional args:
    //  1st: inDebug - sets this.bLogging: false if not provided
    //  2nd: inLogging - sets this.bLogging: false if not provided.
    //  To get started, we set Debug to false and Logging to true here. Set to your preferred value during development.
    super(false, false);
    if (this.bLogging) { console.log(`${this.theComponentName}: constructor`); }
    if (this.bDebug){ debugger; }

    this.options = [];
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.bLogging) { console.log(`${this.theComponentName}: connectedCallback`); }
    if (this.bDebug){ debugger; }

    // setup this component's styling...
    this.theComponentStyleTemplate = radioButtonStyles;
    
  }


  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();
    if (this.bLogging) { console.log(`${this.theComponentName}: disconnectedCallback`); }
    if (this.bDebug){ debugger; }

  }
  
  /**
   * updateSelf
   */
  updateSelf() {
    if (this.bLogging) { console.log(`${this.theComponentName}: updateSelf`); }
    if (this.bDebug) { debugger; }

    super.updateSelf();

    // Some additional processing
    const theConfigProps = this.thePConn.getConfigProps();

    this.options = Utils.getOptionList(theConfigProps, this.thePConn.getDataObject());

  }


  // The original implementation of fieldOnChange before we switched to using the super class implementation
  //  had this comment
    // NOTE: for lion-radio-group, the clicked button will be in event.target.modelValue
    //  See https://lion-web-components.netlify.app/?path=/docs/forms-radio-group--main


  isSelected(buttonValue:string): boolean {

    if (this.value === buttonValue) {
      return true;
    }

    return false;
  }


  getErrorMessage() {

    const tempError = `${this.theComponentName}: getErrorMessage needs to have a field control implemented.`
    let errMessage : string = tempError;

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


  render(){
    if (this.bLogging) { console.log(`${this.theComponentName}: render with pConn: ${JSON.stringify(this.pConn)}`); }
    if (this.bDebug){ debugger; }

    // To prevent accumulation (and extra rendering) of previous renders, begin each the render
    //  of any component that's a child of BridgeBase with a call to this.prepareForRender();
    this.prepareForRender();

    // Handle and return if read only rendering
    if (this.bReadonly) {
      return html`
        <text-form .pConn=${this.thePConn} ?disabled=${this.bDisabled} ?visible=${this.bVisible} label=${this.label} value=${this.value} testId=${this.testId}>
        </text-form>
      `;
    }

    const theContent = html`
        <div>
          ${ this.bVisible ?
            html`
                <div class="mat-form-field-infix radio-group-form">
                  <lion-radio-group
                    id=${this.theComponentId}
                    class="psdk-radio-vertical"
                    dataTestId=${this.testId}
                    .fieldName=${this.label} 
                    .modelValue=${this.value}
                    .validators = ${this.lionValidatorsArray}
                    ?readonly=${this.bReadonly} 
                    ?disabled=${this.bDisabled} 
                    .feedbackCondition=${this.requiredFeedbackCondition.bind(this)}
                    @click=${this.fieldOnChange} @blur=${this.fieldOnBlur} @change=${this.fieldOnChange}>
                  <span slot="label" class="radio-group-label">${this.annotatedLabel}</span>
                    ${ this.options.map((option: any) => { 
                      return html`
                        ${option.key === this.value?
                        html`
                      <lion-radio class="psdk-radio-button" checked
                        label=${option.value} .choiceValue=${option.key}></lion-radio>`
                        :
                        html`
                        <lion-radio class="psdk-radio-button" 
                        label=${option.value} .choiceValue=${option.key}></lion-radio>`
                        }
                        `
                          })}
  
                  </lion-radio-group>
                </div>
              `
            : nothing
          }
  
        </div>`;

    this.renderTemplates.push( theContent );

    // this.addChildTemplates();

    return this.renderTemplates;

  }

}

export default RadioButtons;