import { html, customElement, property } from '@lion/core';
import { SdkConfigAccess } from '@pega/auth/lib/sdk-auth-manager';
import { BridgeBase } from '../../../bridge/BridgeBase';
// NOTE: you need to import ANY component you may render.

import '../../forms/AutoComplete';
import '../../forms/Checkbox';
import '../../forms/Currency';
import '../../forms/Date';
import '../../forms/DateTime';
import '../../forms/Decimal';
import '../../forms/Dropdown';
import '../../forms/Email';
import '../../forms/FormattedText';
import '../../forms/Integer';
import '../../forms/Percentage';
import '../../forms/Phone';
import '../../forms/RadioButtons';
import '../../forms/Text';
import '../../forms/TextArea';
import '../../forms/TextContent';
import '../../forms/TextInput';
import '../../forms/Time';
import '../../forms/URL';
import '../../forms/UserReference';
import '../../templates/Details';
import '../../templates/DetailsTwoColumn';
import '../../Attachment';


// import the component's styles as HTML with <style>
import { defaultFormStyles } from './default-form-styles';


// Declare that PCore will be defined when this code is run
declare var PCore: any;

@customElement('default-form-component')
class DefaultForm extends BridgeBase {

  constructor() {
    //  Note: BridgeBase constructor has 2 optional args:
    //  1st: inDebug - sets this.bLogging: false if not provided
    //  2nd: inLogging - sets this.bLogging: false if not provided.
    //  To get started, we set both to true here. Set to false if you don't need debugger or logging, respectively.
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
    this.theComponentStyleTemplate = defaultFormStyles;

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

  getKidsHtml(): any {

  }


  getDefaultFormHtml() : any {
    
    let configProps = this.thePConn.getConfigProps();


    let numCols = configProps.NumCols ? configProps.NumCols : "1";
    let divClass = "";
    switch (numCols) {
      case "1" :
        divClass = "psdk-default-form-one-column";
        break;
      case "2" :
        divClass = "psdk-default-form-two-column";
        break;
      case "3" :
        divClass = "psdk-default-form-three-column";
        break;
      default :
        divClass = "psdk-default-form-one-column";
        break;
    }

    // repoint children before getting templateArray
    this.children = this.children[0].getPConnect().getChildren();

    const dFHtml = html`
      <div class="${divClass}">
      ${this.getChildTemplateArray()}
      </div>
    `;


    return dFHtml;

  }


  render(){
    const sContent = html`${this.getDefaultFormHtml()}`;
    const locBootstrap = SdkConfigAccess.getSdkConfigBootstrapCSS();
    
    let arHtml: Array<any> = [];

    // DefaultForm not derived from BridgeBase, so we need to load Bootstrap CSS
    arHtml.push( html`<link rel='stylesheet' href='${locBootstrap}'>`);

    arHtml.push(defaultFormStyles);
    arHtml.push(sContent);


    return arHtml;

  }

}

export default DefaultForm;