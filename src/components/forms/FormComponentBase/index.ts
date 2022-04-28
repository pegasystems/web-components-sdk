import { html, property, nothing, css } from '@lion/core';
import { BridgeBase } from '../../../bridge/BridgeBase';
import { Utils } from '../../../helpers/utils';
// FormComponentBase needs to add some styling to the BridgeBase default styles
//  so we import both and combine them in our override for static styles
import { bootstrapStyles } from '../../../bridge/BridgeBase/bootstrap-styles';
import { formComponentStyles } from './form-component-styles';

// NOTE: you need to import ANY component you may render.
import { Required } from '@lion/form-core';
import { loadDefaultFeedbackMessages } from '@lion/validate-messages';
import ValidateMessageValidator from './validateMessageValidator.js';


// NOTE: FormComponentBase is an intermediate base class that is intended
//  to extend BridgeBase (to get the Web Component Bridge functionality)
//  and then be extended by the "leaf" Form Components.
//  Ex: TextInput extends FormComponentBase extends BridgeBase

export class FormComponentBase extends BridgeBase {
  static styles = [
    bootstrapStyles,
    formComponentStyles
  ];

  @property( {attribute: false, type: String} ) componentBaseComponentName = "FormComponentBase"; // Name of this particular component
  
  @property( {attribute: false, type: Boolean} ) bDisabled = false;
  @property( {attribute: false, type: Boolean} ) bReadonly= false;
  @property( {attribute: false, type: Boolean} ) bRequired = false;
  @property( {attribute: false, type: Boolean} ) bVisible = true;

  @property( {attribute: false, type: Array} ) lionValidatorsArray:Array<Object> = [];

  // Note: Lion validators use the .fieldName specifier to show the label in any validation messages.
  //  Since components derived from FormComponentBase can put a modified label in annotatedLabel (see below)
  //  which we put into the "label" slot for proper display in the Lion component "label", we then set
  //  a Lion component's .fieldName=${this.label} to get the plain, unannotated label in validation messages
  @property( {attribute: false, type: String} ) label = "default label";
  @property( {attribute: false} ) value = "default value";
  @property( {attribute: false} ) controlName = false;
  @property( {attribute: false, type: Object} ) annotatedLabel; // is likely a lit-html CSS object
  
  constructor(inDebug = false, inLogging = false) {
    //  Note: BridgeBase constructor has 2 optional args:
    //  1st: inDebug - sets this.bLogging: false if not provided
    //  2nd: inLogging - sets this.bLogging: false if not provided.
    //  To get started, we set both to true here. Set to false if you don't need debugger or logging, respectively.
    super(inDebug, inLogging);
    if (this.bLogging) { console.log(`${this.theComponentName}: constructor`); }
    if (this.bDebug){ debugger; }

    this.pConn = {};
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.bLogging) { console.log(`${this.theComponentName}: connectedCallback`); }
    if (this.bDebug){ debugger; }

    // bind the change events to this
    this.fieldOnChange = this.fieldOnChange.bind(this);
    this.fieldOnClick = this.fieldOnClick.bind(this);
    this.fieldOnBlur = this.fieldOnBlur.bind(this);

    // load default feedback (Lion validation) messages
    loadDefaultFeedbackMessages();

    //NOTE: Need to bind the callback to 'this' so it has this element's context when it's called.
    this.registerAndSubscribeComponent(this.onStateChange.bind(this));

    // Do an initial updateSelf - is this always necessary?
    this.updateSelf();
    
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
    if (this.bDebug){ debugger; }

    // Reset to defaults so any (possibly stale) values aren't used
    this.bDisabled = false;
    this.bReadonly = false;
    this.bRequired = false;
    this.bVisible = true;
    this.label = "default label";
    this.annotatedLabel = this.label;

    const theConfigProps = this.thePConn.getConfigProps();

    // Clear out validators so they don't accumulate (since we're going to add them back below)
    this.lionValidatorsArray.length = 0;

    if (theConfigProps["value"] != undefined) {
      this.value = theConfigProps["value"];
    }
  
    this.label = theConfigProps["label"];

    if (theConfigProps["required"] != null) {
      this.bRequired = Utils.getBooleanValue(theConfigProps["required"]);
    }

    // If field is required...
    if (this.bRequired) {
      // Add asterisk to annotatedLabel
      this.annotatedLabel = html`<span>${this.label} <super style="color: var(--app-warning-color-dark); font-weight: var(--font-weight-bold)">*</super></span>`;
      // add Lion Required validator
      this.lionValidatorsArray.push( new Required() );
    } else {
      this.annotatedLabel = this.label;
    }

    // Always push a ValidateMessageValidator to the set of validators. This is how
    //  we get messages from "validatemessage" into the Lion validation process.
    const checkValidateMessage = this.getComponentProp.bind(this);
    this.lionValidatorsArray.push (new ValidateMessageValidator({ getCompPropFn: checkValidateMessage}) );


    if (theConfigProps["visibility"] != null) {
      this.bVisible = Utils.getBooleanValue(theConfigProps["visibility"]);
    }

    // disabled
    if (theConfigProps["disabled"] != undefined) {
      this.bDisabled =  Utils.getBooleanValue(theConfigProps["disabled"]);
    }

    // readOnly is now a component property (as in each component's config.json); not using !isEditable() any more
    if (theConfigProps["readOnly"] !== undefined) {
      this.bReadonly = theConfigProps["readOnly"];  
    }

    if (this.bLogging) {
      console.log(`--> ${this.componentBaseComponentName}:${this.theComponentName} : value: ${this.value} label: ${this.label} bRequired: ${this.bRequired} 
        bVisible: ${this.bVisible} bDisabled: ${this.bDisabled} bReadonly: ${this.bReadonly}`);
    }

    // if there's a validatemessage Component Property, the Constellation JS Engine has signaled a validation
    //  error that we should show or deal with...
    //  We add styling to the Lion-based component in the shadowRoot
    const theLionComponent: any = this.shadowRoot?.getElementById(this.theComponentId.toString());

    if (theLionComponent) {
      if (this.getComponentProp("validatemessage") !== undefined) {
        // set CSS class to show that it needs attention
        theLionComponent.classList.add("field-needs-attention");
        // Mark as touched to force underlying component feedbackCondition (validation) call
        theLionComponent.touched = true;
      } else {
        // Remove any styling that a previous validatemessage may have put on the Lion element
        theLionComponent.classList.remove("field-needs-attention");
        // Mark as untouched to prevent any unnecessary feedback (ex: first entering a control)
        theLionComponent.touched = false;
      }
    } else {
      if (this.bLogging) {
        // This isn't usually a problem. But can be helpful when debugging if you expect to find a shadowRoot
        //  that styling can/should use.
        console.log( `    ---> Form component - ${this.theComponentName} - did not find shadowRoot component!`);
      }
    }

    // Is this really necessary? We should try to find out why if it is...
    this.requestUpdate();
 
  }

  /**
   * The `onStateChange()` method will be called when the state is updated.
   *  Override this method in each class that extends BridgeBase.
   *  This implementation can be used for common code that should be done for
   *  all components that are derived from BridgeBase
   */
  onStateChange() {
    if (this.bLogging) { console.log(`${this.theComponentName}: onStateChange`); }
    if (this.bDebug){ debugger; }

    const bShouldUpdate = super.shouldComponentUpdate();

    if (bShouldUpdate) {
      this.updateSelf();
    }
  }

  fieldOnChange(event: any) {
    if (this.bDebug){ debugger; }
 
    if (this.bLogging) { console.log( `--> fieldOnChange: ${this.componentBaseComponentName} for ${this.theComponentName}`) }

    if ((event?.type === 'model-value-changed') && (event?.target?.value === 'Select')) {
      let value = '';
      this.actions.onChange(this.thePConn, { value });
    } else {
      this.actions.onChange(this.thePConn, event);
    }
  }

  // eslint-disable-next-line no-unused-vars
  fieldOnClick(event: any) {
    if (this.bDebug){ debugger; }
    // currently a no-op

    if (this.bLogging) { console.log( `--> fieldOnClick: ${this.componentBaseComponentName} for ${this.theComponentName}`) }

  }

  fieldOnBlur(event: any) {
    if (this.bDebug){ debugger; }  // PConnect wants to use eventHandler for onBlur

    if (this.bLogging) { console.log( `--> fieldOnBlur: ${this.componentBaseComponentName} for ${this.theComponentName}`) }
    this.actions.onBlur(this.thePConn, event);
  }

  // Default Lion behavior for showing "required" feedback is when field is "touched" AND "dirty"
  //  https://lion-web.netlify.app/docs/systems/form/interaction-states/#when-is-feedback-shown-to-the-user
  //  which doesn't show the message if the user tabs out of an empty field without typing. But we want that
  //  behavior to show the message (and not wait for Submit). So, we override the default semantics here.
  // Return: true --> validation feedback should be shown
  // Return: false --> validation feedback is not shown
  requiredFeedbackCondition(type, meta, originalCondition) {
    if (this.bLogging) { console.log( `${this.theComponentName} label: ${this.label} meta.modelValue: ${meta.modelValue} | requiredFeedbackCondition: type: ${type} originalCondition would return: ${originalCondition(type, meta)}`); }    
    if (this.bDebug) { debugger; }

    let bRet = false;

    // Special treatment for presence of "validatemessage" which indicates a validation
    //  failure (typically when the use has pressed the Submit button with incorrect/incomplete fields)
    if (this.getComponentProp("validatemessage") !== undefined) {
      if (meta.el.hasFeedbackFor.length > 0) {
        // The component has validation feedback, add styling and exit now.
        //  Don't run rest of the checks
        meta.el.classList.add("field-needs-attention");
        bRet = true;
        return bRet;
      } else {
        // don't have feedback, but do have valdiate message, so return true to show the red outline
        // need to be able to send in the validate message to display, don't know how to do it yet.
        bRet = true;
        return bRet;
      }
    }

    // Remove any styling that may have beenput on invalid field.
    meta.el.classList.remove("field-needs-attention");      
    
    // Continue through the rest of the processing...    
    if (this.bRequired && meta.touched && (meta.modelValue === "")) {
      // Required and touched but still no value... return true (to indicate validation error and show message)
      bRet = true;
    } else if (meta.modelValue.type === "unparseable") {
      // Show message is user enters  unparseable data (ex: letters in a number field)
      bRet = true;
    } else if (meta.el.hasFeedbackFor.includes("error") && !this.bRequired && meta.touched && meta.dirty) {
      // Retain check for an item that (a) has error feedback, (b) '=is not required but has been touched and is dirty
      //  and unfocused (so we only show when the user has tabbed out of the field - don't show while typing)
      bRet = true;
    } else {
      // The default implementation of "originalCondition" is _showFeedbackConditionFor which is:
      //  return (meta.touched && meta.dirty) || meta.prefilled || meta.submitted
      // But this caused weird results when meta.submitted was undefined. So treat undefined as false
      // Above, we covered the "required" condition we want.
      // Our fields may be shown as prefilled but we only want to show the message when it's
      //  required AND prefilled. So, we'll modify that here and keep the default meta.submitted.
      // This will prevent the unnecessary showing of validation messages
      // was: return originalCondition(type, meta);
      if ((this.bRequired && meta.prefilled) || meta.submitted) {
        bRet = true;
      }
    }

    if (this.bLogging) { console.log( `requiredFeedbackCondition: ${this.theComponentName} label: ${this.label} meta.modelValue: ${meta.modelValue} about to return ${bRet}`); }
    return bRet;
  }

}
