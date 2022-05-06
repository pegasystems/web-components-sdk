import { html, customElement, property } from '@lion/core';
import { BridgeBase } from '../../../bridge/BridgeBase';
// NOTE: you need to import ANY component you may render.

// import the component's styles as HTML with <style>
import { simpleTableSelectStyles } from './simple-table-select-styles';


// Declare that PCore will be defined when this code is run
declare var PCore: any;

// NOTE: this is just a boilerplate component definition intended
//  to be used as a starting point for any new components as they're built out
@customElement('simple-table-select')
class SimpleTableSelect extends BridgeBase {
  @property( {attribute: true, type: String} ) value = "";

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
    this.theComponentStyleTemplate = simpleTableSelectStyles;

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

  getSimpleTableSelectHtml() : any {
    const dataRefHtml = html `
      <div><strong></string>${this.theComponentName}</strong>: component in progress
        <br /><br />
        theComponentProps:
        <br /><br />
        ${JSON.stringify(this.theComponentProps)}
        <br /><br />
        with ${this.thePConn.getChildren() ? this.thePConn.getChildren().length : 0} children.
        <br /><br />
        ${this.thePConn.getChildren()?.map((child, index) => {
          return html`child ${index} component type: ${child.getPConnect().getComponentName()} <br />`;
        })}
        <br />
      </div>
    `;

    return dataRefHtml;

  }

  render(){
    if (this.bLogging) { console.log(`${this.theComponentName}: render with pConn: ${JSON.stringify(this.pConn)}`); }
    if (this.bDebug){ debugger; }

    // To prevent accumulation (and extra rendering) of previous renders, begin each the render
    //  of any component that's a child of BridgeBase with a call to this.prepareForRender();
    this.prepareForRender();

    // For test purposes, add some more content to be rendered
    //  This isn't the best way to add inner content. Just here to see that the style's
    //  be loaded and can be applied to some inner content.
    this.prepareForRender();

    const sContent = html`${this.getSimpleTableSelectHtml()}`;

    this.renderTemplates.push( sContent );
    // and now add any children to renderTemplates
    this.addChildTemplates();

    return this.renderTemplates;

  }

}

export default SimpleTableSelect;