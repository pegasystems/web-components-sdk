import { html, customElement, property } from '@lion/core';
import { BridgeBase } from '../../../bridge/BridgeBase';
// NOTE: you need to import ANY component you may render.
import '../../Region';

// import the component's styles as HTML with <style>
import { twoColumnStyles } from './two-column-styles';


// Declare that PCore will be defined when this code is run
declare var PCore: any;

// NOTE: this is just a boilerplate component definition intended
//  to be used as a starting point for any new components as they're built out
@customElement('two-column')
class TwoColumn extends BridgeBase {

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
    this.theComponentStyleTemplate = twoColumnStyles;

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

  render(){
    if (this.bLogging) { console.log(`${this.theComponentName}: render with pConn: ${JSON.stringify(this.pConn)}`); }
    if (this.bDebug){ debugger; }

    // To prevent accumulation (and extra rendering) of previous renders, begin each the render
    //  of any component that's a child of BridgeBase with a call to this.prepareForRender();
    this.prepareForRender();

    // We take care of the children in theChildTemplateArray
    const theChildTemplateArray: Array<Object> = [];

    for (var child of this.children) {
      const theMetadataName: string = child.getPConnect().getRawMetadata()['name']?.toLowerCase();
      let theClassName: String = "";
      
      switch (theMetadataName) {
        case "left":
          theClassName = "psdk-two-column-left";
          break;

        case "right":
          theClassName = "psdk-two-column-right";
          break;

        case "a":
        case "b":
          theClassName = "psdk-two-column-column";
          break;

        default:
          theClassName = "class-unknown";
          break;
      }

      theChildTemplateArray.push( html`<region-component class="${theClassName}" .pConn=${child.getPConnect()}></region-component>` );

    }

    const theTemplate = html`
      <div class="psdk-two-column">
        ${theChildTemplateArray}
      </div>    
    `;

    this.renderTemplates.push(theTemplate);

    return this.renderTemplates;

  }


}

export default TwoColumn;