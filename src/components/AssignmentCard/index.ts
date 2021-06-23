import { html, customElement, property } from '@lion/core';
import { BridgeBase } from '../../bridge/BridgeBase';

import '../ActionButtons';
import '../View';
import '../CaseCreateStage';

// NOTE: you need to import ANY component you may render.

// import the component's styles as HTML with <style>
import { assignmentCardStyles } from './assignment-card-styles';


// Declare that PCore will be defined when this code is run
declare var PCore: any;


@customElement('assignment-card-component')
class AssignmentCard extends BridgeBase {

  @property( {attribute: false, type: Array} ) arMainButtons = [];
  @property( {attribute: false, type: Array} ) arSecondaryButtons = [];
  @property( {attribute: false, type: Array} ) arChildren : Array<any> = [];

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
    this.theComponentStyleTemplate = assignmentCardStyles;

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

  assignmentKids() : any {
    let arKidHtml: Array<Object> = [];


    for (let kid of this.arChildren) {
      let kidPConn = kid.getPConnect();
      switch (kid.getPConnect().getComponentName()) {
        case "View" :
          arKidHtml.push(html`<view-component .pConn=${kidPConn}></view-component>`);
          break;
        case "CaseCreateStage" :
          arKidHtml.push(html`<case-create-stage-component .pConn=${kidPConn}></case-create-stage-component>`);
          break;
        default :
          break;
      }
    }

    return arKidHtml;

  }

  getAssignmentCardHtml() : any {


    const kidHtml = html`${this.assignmentKids()}`;
    //const  kidHtml = html`${this.getChildTemplateArray()}`;

    const aCHtml = html`
      <form>
        <div>${kidHtml}</div>
      </form>

      <div>
        <br>
        <div class="psdk-case-view-divider"></div>
        
        <action-buttons-component .arMainButtons="${this.arMainButtons}" .arSecondaryButtons="${this.arSecondaryButtons}"
          @ActionButtonClick="${this._onActionButtonClick}">
        </action-buttons-component>

      </div>
    `;

    return aCHtml;

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
    // const sampleContent = html`<div class='boilerplate-class'>Generic boilerplate text.</div>`;
    // this.renderTemplates.push( sampleContent );

    // this.addChildTemplates();

    const sContent = html`${this.getAssignmentCardHtml()}`;

    this.renderTemplates.push( sContent );

    return this.renderTemplates;

  }

  _onActionButtonClick(e: any) {

    let event = new CustomEvent('AssignmentActionButtonClick', {
      detail: { data: e.detail.data }
    });

    this.dispatchEvent(event);
  }
  

}

export default AssignmentCard;