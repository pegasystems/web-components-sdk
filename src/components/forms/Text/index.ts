import { html, customElement, property, nothing } from '@lion/core';
import { BridgeBase } from '../../../bridge/BridgeBase';
import { Utils } from '../../../helpers/utils';
import { format } from '../../../helpers/formatters/';

// NOTE: you need to import ANY component you may render.
import '@lion/input/define';

// import the component's styles as HTML with <style>
import { textStyles } from './text-styles';


// Declare that PCore will be defined when this code is run
declare var PCore: any;

// TODO: Support formatType values and figure out where exactly this component might be utilized from
//  I don't see this being invoked from CableConnect app using either rep or tech experience
@customElement('text-form')
class Text extends BridgeBase {
  @property( {attribute: true} ) label = "";
  @property( {attribute: false, type: Boolean} ) hideLabel = false;
  @property( {attribute: false} ) formatType = "none";
  @property( {attribute: true} ) value = undefined;
  @property( {attribute: true} ) customFormat = "";
  @property( {attribute: true, type: Object} ) additionalProps = {};
  @property( {attribute: true} ) decorator = "";
  @property( {attribute: true} ) displayAs = "";
  @property( {attribute: false, type: Boolean} ) bVisible = true;


  // Properties specific to one or more formatTypes
  @property( {attribute: true} ) symbol="";
  @property( {attribute: true} ) symbolPosition="";
  @property( {attribute: true} ) decimalPrecision="0";
 
  constructor() {
    //  Note: BridgeBase constructor has 2 optional args:
    //  1st: inDebug - sets this.bLogging: false if not provided
    //  2nd: inLogging - sets this.bLogging: false if not provided.
    //  To get started, we set Debug to false and Logging to true here. Set to your preferred value during development.
    super(false, false);
    if (this.bLogging) { console.log(`${this.theComponentName}: constructor`); }
    if (this.bDebug){ debugger; }

    this.pConn = {};
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.bLogging) { console.log(`${this.theComponentName}: connectedCallback`); }
    if (this.bDebug){ debugger; }

    // setup this component's styling...
    this.theComponentStyleTemplate = textStyles;

    //NOTE: Need to bind the callback to 'this' so it has this element's context when it's called.
    this.registerAndSubscribeComponent(this.onStateChange.bind(this));
    
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
    const theConfigProps = this.thePConn.getConfigProps();

    if (theConfigProps["visibility"] != null) {
      this.bVisible = Utils.getBooleanValue(theConfigProps["visibility"]);
    }
    
    // Boolean props
    for( let prop in ['hideLabel']) {
      if( this[prop] != undefined ) {
        this[prop] = Utils.getBooleanValue(theConfigProps[prop]);
      }
    }
    for( let prop in ['label','formatType','value','customFormat','additionalProps','decorator','displayAs','symbol','symbolPosition','decimalPrecision']) {
      if( this[prop] != undefined ) {
        this[prop] = theConfigProps[prop];
      }
    }
  }

  formatNumber(text) {
    const { symbol, symbolPosition, displayAs, decimalPrecision } = this;
    let decPlaces = parseInt(decimalPrecision, 10);
  
    if (displayAs === "pxNumber") decPlaces = 0;
    else if (decimalPrecision === undefined || decimalPrecision === "-999") {
      if (symbol === "currency") decPlaces = 2;
      else decPlaces = 3;
    }
  
    if (symbol === "none") return format(text, "decimal", { decPlaces });
    return format(text, "currency", {
      position: symbolPosition === "right" ? "after" : "before",
      decPlaces
    });
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
  
  render(){
    if (this.bLogging) { console.log(`${this.theComponentName}: render with pConn: ${JSON.stringify(this.pConn)}`); }
    if (this.bDebug){ debugger; }

    // To prevent accumulation (and extra rendering) of previous renders, begin each the render
    //  of any component that's a child of BridgeBase with a call to this.prepareForRender();
    this.prepareForRender();

    const {formatType, customFormat, label, hideLabel} = this;

    let text = this.value;
    const noLabel = this.additionalProps && this.additionalProps["noLabel"];
    if( text ) {
      if (formatType === "datetime" || formatType == "date") {
        text = format(text, formatType, {format: customFormat || (formatType === "date" ? "LL" : "LLL")});
      } else if (formatType === "number") {
        text = this.formatNumber(text);
      }
    }

    if( formatType === "boolean" ) {
      text = format(text, formatType);
    }

    let theContent: any = nothing;

    if (this.bVisible) {
      theContent = (label !== undefined && !noLabel && text !== undefined) ?
      html`<div class="form-group"><lion-input .modelValue=${text} label=${label} readonly></lion-input></div>` :
        (label !== undefined && text === undefined ?
          html`<label class="form-control-plaintext">${label}</label>` :
          html`<div class="form-control-plaintext ml-3">
              <label>${text}</label>
            </div>`);
    }




      this.renderTemplates.push( theContent );

    // There shouldn't be any children (but leave for now)
    // this.addChildTemplates();

    return this.renderTemplates;

  }

}

export default Text;