import { html, customElement, property } from '@lion/core';
import { BridgeBase } from '../../../bridge/BridgeBase';
// NOTE: you need to import ANY component you may render.

// import the component's styles as HTML with <style>
import { semanticLinkStyles } from './semantic-link-styles'

@customElement('semantic-link')
class SemanticLink extends BridgeBase {
  @property( {attribute: false, type: Object } ) pConn; 

  value: string = '';
  displayMode;
  label;
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
    this.theComponentStyleTemplate = semanticLinkStyles;
    //NOTE: Need to bind the callback to 'this' so it has this element's context when it's called.
    this.registerAndSubscribeComponent(this.onStateChange.bind(this));
    const theConfigProps = this.pConn.getConfigProps();
    this.value = theConfigProps.text ||  "---";
    this.displayMode = theConfigProps.displayMode;
    this.label = theConfigProps.label;
    
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

  getSingleReferenceHtml(): any {
    if (this.displayMode === 'LABELS_LEFT' || (!this.displayMode && this.label !== undefined)) {
        const semanticHtml = html`<div>
            <div class="psdk-grid-filter" id="semantic-link-grid">
                <div class="psdk-field-label">${this.label}</div>
                <div class="psdk-value">${this.value}</div>
            </div>
        </div>`
        return semanticHtml;
    }
  }

  render(){
    if (this.bLogging) { console.log(`${this.theComponentName}: render with pConn: ${JSON.stringify(this.pConn)}`); }
    if (this.bDebug){ debugger; }

    // To prevent accumulation (and extra rendering) of previous renders, begin each the render
    //  of any component that's a child of BridgeBase with a call to this.prepareForRender();
    this.prepareForRender();
    const sContent = html`${this.getSingleReferenceHtml()}`;

    this.renderTemplates.push(sContent);
    
    return this.renderTemplates;

  }

}

export default SemanticLink;