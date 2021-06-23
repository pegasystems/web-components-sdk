import { html, customElement, property } from '@lion/core';
import { BridgeBase } from '../../../bridge/BridgeBase';
// NOTE: you need to import ANY component you may render.
import '../../Region';

// import the component's styles as HTML with <style>
import { detailsTwoColumnStyles } from './details-two-column-styles';

import '../../designSystemExtension/DetailsFields';

// Declare that PCore will be defined when this code is run
declare var PCore: any;


@customElement('details-two-column-component')
class DetailsTwoColumn extends BridgeBase {
  @property( {attribute: false} ) viewName = null;

  arFields: Array<any> = [];
  arFields2: Array<any> = [];
  arFields3: Array<any> = [];

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
    this.theComponentStyleTemplate = detailsTwoColumnStyles;

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

  
 
    for( let prop in ['viewName']) {
      if( this[prop] != undefined ) {
        this[prop] = theConfigProps[prop];
      }
    }



    for (let kid of this.children) {
      let pKid = kid.getPConnect();
      let pKidData = pKid.resolveConfigProps(pKid.getRawMetadata());
      if (this.children.indexOf(kid) == 0) {
        this.arFields = pKidData.children;
      }
      else {
        this.arFields2 = pKidData.children;
      }
      
    }



  
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

    const {viewName} = this;

    // Title
    if( viewName !== null && viewName !== "" ) {
      const title = html`<text-form value=${viewName}></text-form>`;
      this.renderTemplates.push( title );
    }

    // React version uses <Grid container={cols, gap:2, aslignItems:'start'} with Flex child element
    //  <Flex conainer={direction:"column", itemGap: 1}>{buildReadonlyRegion}</Flex>

    // Opted not to use formatted-text-form as would have to emit each web component separately.  Better to have a
    //  a single component with a single set of styles defined for the entire list

    const theContent = html`
      <details-fields-extension .arFields="${this.arFields}" .arFields2="${this.arFields2}"></details-fields-extension>
    `;
    this.renderTemplates.push(theContent);

    return this.renderTemplates;

  }


}

export default DetailsTwoColumn;