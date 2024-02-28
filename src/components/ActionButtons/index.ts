import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { bootstrapStyles } from '../../bridge/BridgeBase/bootstrap-styles'

// NOTE: you need to import ANY component you may render.

// import the component's styles as HTML with <style>
import { actionButtonsStyles } from './action-buttons-styles';


// Declare that PCore will be defined when this code is run
declare var PCore: any;

@customElement('action-buttons-component')
class ActionButtons extends LitElement {
  static get styles() {
    return bootstrapStyles;
  }

  @property({ attribute: false, type: Array }) arMainButtons = [];
  @property({ attribute: false, type: Array }) arSecondaryButtons = [];

  // NOTE: ActionButtons is NOT derived from BridgeBase; just derived from LitElement
  constructor() {
    super();

  }



  mainButtons(): any {
    const arButtonHtml: Array<any> = [];
    // arStagesHtml.push(html`<div class="psdk-stages">`);
    // arStagesHtml.push(html`<div class="psdk-stages-div">`);


    if (this.arMainButtons != null) {
      for (let aButton of this.arMainButtons) {
        let name: string = aButton["name"];
        let jsAction: string = aButton["jsAction"];

        arButtonHtml.push(html`<button class="btn btn-primary" jsAction=${jsAction} buttonType="primary" @click="${this._buttonClick}" >${name}</button>`);

        // add a space between buttons
        if (this.arMainButtons.indexOf(aButton) < this.arMainButtons.length - 1) {
          arButtonHtml.push(html`&nbsp;`);
        }

      }
    }


    return arButtonHtml;
  }

  secondaryButtons(): any {
    const arButtonHtml: Array<any> = [];
    // arStagesHtml.push(html`<div class="psdk-stages">`);
    // arStagesHtml.push(html`<div class="psdk-stages-div">`);

    if (this.arSecondaryButtons != null) {
      for (let aButton of this.arSecondaryButtons) {
        let name: string = aButton["name"];
        let jsAction: string = aButton["jsAction"];

        arButtonHtml.push(html`<button class="btn btn-secondary" jsAction=${jsAction} buttonType="secondary" @click="${this._buttonClick}" >${name}</button>`);

        // add a space between buttons
        if (this.arSecondaryButtons.indexOf(aButton) < this.arSecondaryButtons.length - 1) {
          arButtonHtml.push(html`&nbsp;`);
        }

      }
    }



    return arButtonHtml;
  }

  aButtonsHtml(): any {

    const aBHtml = html`
      <div class="nq_button_grid">
        <div>${this.secondaryButtons()}</div>
        <div>${this.mainButtons()}</div>
      </div>
    `;

    return aBHtml;

  }

  render() {


    const sContent = html`${this.aButtonsHtml()}`;

    let arHtml: Array<any> = [];

    arHtml.push(actionButtonsStyles);
    arHtml.push(sContent);


    return arHtml;

  }


  _buttonClick(e) {
    let target = e.target;
    let buttonData = {};

    buttonData["action"] = target.getAttribute("jsAction");
    buttonData["buttonType"] = target.getAttribute("buttonType");

    let event = new CustomEvent('ActionButtonClick', {
      detail: { data: buttonData }
    });

    this.dispatchEvent(event);


  }

}

export default ActionButtons;
