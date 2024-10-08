import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { BridgeBase } from '../../bridge/BridgeBase';
// NOTE: you need to import ANY component you may render.

// import the component's styles as HTML with <style>
import { multiStepStyles } from './multi-step-styles';

@customElement('multi-step-component')
class MultiStep extends BridgeBase {
  @property({ type: Boolean }) bIsVertical = false;
  @property({ type: Array }) arCurrentStepIndicies = [];
  @property({ type: Array }) arMainButtons = [];
  @property({ type: Array }) arSecondaryButtons = [];
  @property({ type: Array }) arChildren: any[] = [];
  @property({ type: Array }) arNavigationSteps: any[] = [];

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
    this.theComponentStyleTemplate = multiStepStyles;

    // NOTE: Need to bind the callback to 'this' so it has this element's context when it's called.
    this.registerAndSubscribeComponent(this.onStateChange.bind(this));
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

  updated(changedProperties) {
    for (const key of changedProperties.keys()) {
      // check if property changes, if so, normalize and render
      if (key == 'arNavigationSteps' || key == 'arCurrentStepIndicies') {
        this.requestUpdate();
      }
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

  assignmentCardHtml(): any {
    return html`
      <div>
        <assignment-card-component
          .pConn=${this.pConn}
          .arChildren=${this.arChildren}
          .arMainButtons=${this.arMainButtons}
          .arSecondaryButtons=${this.arSecondaryButtons}
          @AssignmentActionButtonClick="${this._onActionButtonClick}"
        >
        </assignment-card-component>
      </div>
    `;
  }

  getStepVerticalMarkerStyle(step: any, bSubStep: boolean = false): string {
    let sStyle = '';
    switch (step.visited_status) {
      case 'success':
        if (bSubStep) {
          sStyle = 'psdk-vertical-marker v-success v-sub';
        } else {
          sStyle = 'psdk-vertical-marker v-success';
        }
        break;
      case 'current':
        if (bSubStep) {
          sStyle = 'psdk-vertical-marker v-current v-sub';
        } else {
          sStyle = 'psdk-vertical-marker v-current';
        }
        break;
      case 'future':
        if (bSubStep) {
          sStyle = 'psdk-vertical-marker v-future v-sub';
        } else {
          sStyle = 'psdk-vertical-marker v-future';
        }
        break;
      default:
        break;
    }

    return sStyle;
  }

  getStepHorizontallMarkerStyle(step: any, type): string {
    let sStyle = '';
    switch (type) {
      case 'label':
        if (step.visited_status === 'current') {
          sStyle = 'psdk-horizontal-step-label-selected';
        } else {
          sStyle = 'psdk-horizontal-step-label';
        }
        break;
      case 'icon':
        if (step.visited_status === 'current') {
          sStyle = 'psdk-horizontal-step-icon-selected';
        } else {
          sStyle = 'psdk-horizontal-step-icon';
        }
        break;
      default:
        break;
    }
    return sStyle;
  }

  _showHLine(index: number): boolean {
    return index < this.arNavigationSteps.length - 1;
  }

  getStepMarkerStyle(step: any, bSubStep: boolean = false): string {
    if (this.bIsVertical) {
      return this.getStepVerticalMarkerStyle(step, bSubStep);
    }

    return this.getStepHorizontallMarkerStyle(step, bSubStep);
  }

  verticalMultiStep(): any {
    const arVerticalSteps: any[] = [];

    for (const step of this.arNavigationSteps) {
      if (step.steps) {
        for (const sStep of step.steps) {
          const stepMarkerStyle = this.getStepMarkerStyle(sStep, true);
          arVerticalSteps.push(html`
            <div class="psdk-vertical-step">
              <header class="psdk-vertical-header-step">
                <div class="${stepMarkerStyle}"></div>
                <div class="psdk-vertical-step-name">${sStep.name}</div>
              </header>
            </div>
          `);

          if (sStep.visited_status == 'current') {
            arVerticalSteps.push(html`${this.assignmentCardHtml()}`);
          }
        }
      } else {
        const stepMarkerStyle = this.getStepMarkerStyle(step, false);
        arVerticalSteps.push(html`
          <div class="psdk-vertical-step">
            <header class="psdk-vertical-header-step">
              <div class="${stepMarkerStyle}"></div>
              <div class="psdk-vertical-step-name">${step.name}</div>
            </header>
            ${step.visited_status == 'current' ? html` <div class="psdk-vertical-assignment">${this.assignmentCardHtml()}</div>` : html``}
          </div>
        `);
      }
    }

    return html` <div class="psdk-vertical-steps">${arVerticalSteps}</div> `;
  }

  horizontalMultiStep(): any {
    const arHorizontalSteps: any[] = [];

    let count = 0;
    for (const step of this.arNavigationSteps) {
      if (step.steps) {
        for (const sStep of step.steps) {
          arHorizontalSteps.push(html`
            <div class="psdk-horizontal-step-header">
              <div class="${this.getStepHorizontallMarkerStyle(sStep, 'icon')}">
                <div class="psdk-horizontal-step-icon-content">
                  <span>${count + 1}</span>
                </div>
              </div>
              <div class="${this.getStepHorizontallMarkerStyle(sStep, 'label')}">
                <div class="psdk-horizontal-step-text-label" id="selected-label">${sStep.name}</div>
              </div>
            </div>
            ${this._showHLine(count) ? html`<div class="psdk-horizontal-step-line" /> ` : html``}
          `);
        }
      } else {
        arHorizontalSteps.push(html`
          <div class="psdk-horizontal-step-header">
            <div class="${this.getStepHorizontallMarkerStyle(step, 'icon')}">
              <div class="psdk-horizontal-step-icon-content">
                <span>${count + 1}</span>
              </div>
            </div>
            <div class="${this.getStepHorizontallMarkerStyle(step, 'label')}">
              <div class="psdk-horizontal-step-text-label" id="selected-label">${step.name}</div>
            </div>
          </div>
          ${this._showHLine(count) ? html`<div class="psdk-horizontal-step-line" /> ` : html``}
        `);
      }
      count++;
    }

    return html`
      <div class="psdk-horizontal-progress">
        <div class="psdk-horizontal-steps">${arHorizontalSteps}</div>
      </div>
      <div>${this.assignmentCardHtml()}</div>
    `;
  }

  multiStepHtml(): any {
    // const currentStep = this.arNavigationSteps[this.arCurrentStepIndicies[0]];
    return this.bIsVertical ? html`${this.verticalMultiStep()}` : html`${this.horizontalMultiStep()}`;
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

    const sContent = html`${this.multiStepHtml()}`;

    this.renderTemplates.push(sContent);

    return this.renderTemplates;
  }

  _onActionButtonClick(e: any) {
    const event = new CustomEvent('MultiStepActionButtonClick', {
      detail: { data: e.detail.data }
    });

    this.dispatchEvent(event);
  }
}

export default MultiStep;
