import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { BridgeBase } from '../../bridge/BridgeBase';
import { Utils } from '../../helpers/utils';

// NOTE: you need to import ANY component you may render.

// import the component's styles as HTML with <style>
import { stagesStyles } from './stages-styles';

@customElement('stages-component')
class Stages extends BridgeBase {
  checkSvgIcon = '';
  imagePath = '';

  constructor() {
    //  Note: BridgeBase constructor has 2 optional args:
    //  1st: inDebug - sets this.bLogging: false if not provided
    //  2nd: inLogging - sets this.bLogging: false if not provided.
    //  To get started, we set both to true here. Set to false if you don't need debugger or logging, respectively.
    super(false, false);
    if (this.bLogging) {
      console.log(`${this.theComponentName}: constructor`);
    }
    if (this.bDebug) {
      debugger;
    }

    this.pConn = {};
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.bLogging) {
      console.log(`${this.theComponentName}: connectedCallback`);
    }
    if (this.bDebug) {
      debugger;
    }

    // setup this component's styling...
    this.theComponentStyleTemplate = stagesStyles;

    // NOTE: Need to bind the callback to 'this' so it has this element's context when it's called.
    this.registerAndSubscribeComponent(this.onStateChange.bind(this));

    this.imagePath = Utils.getIconPath(Utils.getSDKStaticContentUrl());
    this.checkSvgIcon = Utils.getImageSrc('check', Utils.getSDKStaticContentUrl());
  }

  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();
    if (this.bLogging) {
      console.log(`${this.theComponentName}: disconnectedCallback`);
    }
    if (this.bDebug) {
      debugger;
    }
  }

  /**
   * updateSelf
   */
  updateSelf() {
    if (this.bLogging) {
      console.log(`${this.theComponentName}: updateSelf`);
    }
    if (this.bDebug) {
      debugger;
    }
  }

  /**
   * The `onStateChange()` method will be called when the state is updated.
   *  Override this method in each class that extends BridgeBase.
   *  This implementation can be used for common code that should be done for
   *  all components that are derived from BridgeBase
   */
  onStateChange() {
    if (this.bLogging) {
      console.log(`${this.theComponentName}: onStateChange`);
    }
    if (this.bDebug) {
      debugger;
    }

    const bShouldUpdate = super.shouldComponentUpdate();

    if (bShouldUpdate) {
      this.updateSelf();
    }
  }

  getStageInnerHtml(stage: any) {
    let sClass = '';
    let sIconHtml: any = html``;

    switch (stage.visited_status) {
      case 'completed':
        sClass = 'psdk-stages-inner-past';
        sIconHtml = html`<img class="psdk-stages-icon" src="${this.checkSvgIcon}" />`;
        break;
      case 'active':
        sClass = 'psdk-stages-inner-present';
        break;
      case 'future':
        sClass = 'psdk-stages-inner-future';
        break;
      default:
        break;
    }

    return html` <div class="${sClass}">${sIconHtml}${stage.name}</div> `;
  }

  getStageOuterHtml(stage: any) {
    return html` <div class="psdk-stages-chevron">${this.getStageInnerHtml(stage)}</div> `;
  }

  stagesHtml(): any {
    const arStages = super.getComponentProp('stages');
    let arStageResults: any[] = [];
    // let lastStage: any;

    if (arStages != null) {
      arStageResults = arStages;
      // lastStage = arStageResults[arStageResults.length - 1];
    }

    const arStagesHtml: any[] = [];

    for (const stage of arStageResults) {
      arStagesHtml.push(html`${this.getStageOuterHtml(stage)}`);
    }

    return html` <div class="psdk-stages-bar">${arStagesHtml}</div> `;
  }

  render() {
    if (this.bLogging) {
      console.log(`${this.theComponentName}: render with pConn: ${JSON.stringify(this.pConn)}`);
    }
    if (this.bDebug) {
      debugger;
    }

    // To prevent accumulation (and extra rendering) of previous renders, begin each the render
    //  of any component that's a child of BridgeBase with a call to this.prepareForRender();
    this.prepareForRender();

    const sContent = html`${this.stagesHtml()}`;

    this.renderTemplates.push(sContent);

    return this.renderTemplates;
  }
}

export default Stages;
