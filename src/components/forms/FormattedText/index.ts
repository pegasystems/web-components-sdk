import { html, customElement, property, nothing } from '@lion/core';
import { BridgeBase } from '../../../bridge/BridgeBase';
import { Utils } from '../../../helpers/utils';
import { format } from '../../../helpers/formatters/';

// NOTE: you need to import ANY component you may render.

// import the component's styles as HTML with <style>
import { formattedTextStyles } from './formatted-text-styles';


// Declare that PCore will be defined when this code is run
declare var PCore: any;

// TODO: Support formatType values and figure out where exactly this component might be utilized from
//  I don't see this being invoked from CableConnect app using either rep or tech experience
@customElement('formatted-text-form')
class FormattedText extends BridgeBase {
    @property( {attribute: true} ) formatType = "none";
    @property( {attribute: true} ) label = "";
    @property( {attribute: true} ) value = undefined;
    @property( {attribute: true, type: Boolean} ) hideLabel = false;
    @property( {attribute: true} ) variant = "stacked"; // stacked or inline
    @property( {attribute: true, type: Object} ) additionalProps = {};
    @property( {attribute: false, type: Boolean} ) bVisible = true;
  
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
    this.theComponentStyleTemplate = formattedTextStyles;

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
    for( let prop in ['formatType','label','value','variant','additionalProps']) {
      if( this[prop] != undefined ) {
        this[prop] = theConfigProps[prop];
      }
    }
  }
  
  render(){
    if (this.bLogging) { console.log(`${this.theComponentName}: render with pConn: ${JSON.stringify(this.pConn)}`); }
    if (this.bDebug){ debugger; }

    // To prevent accumulation (and extra rendering) of previous renders, begin each the render
    //  of any component that's a child of BridgeBase with a call to this.prepareForRender();
    this.prepareForRender();

    const {formatType, label, value, hideLabel, variant, additionalProps} = this;
    let text = value;

    text = format(text, formatType, additionalProps);

    const fields = [
        {
            id: label.toLowerCase(),
            name: hideLabel ? "" : label,
            value: text
        }
    ];

    // This simulates the React "stacked" variant which uses a FieldValueList
    const theContent = html`${ this.bVisible ?
      html`
      <div>
        <dt>${fields[0].name}</dt>
        <dd>
          <div style="height:fit-content; overflow:hidden;">
            <div>
            <span class="form-control-plaintext">${fields[0].value}</span>
            </div>
          </div>
        </dd>
      </div>`
      :
      nothing
      }`;
    this.renderTemplates.push( theContent );

    // There shouldn't be any children
    // this.addChildTemplates();

    return this.renderTemplates;

  }

}

export default FormattedText;