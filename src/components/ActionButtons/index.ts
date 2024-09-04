import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { bootstrapStyles } from '../../bridge/BridgeBase/bootstrap-styles';

// NOTE: you need to import ANY component you may render.

// import the component's styles as HTML with <style>
import { actionButtonsStyles } from './action-buttons-styles';

@customElement('action-buttons-component')
class ActionButtons extends LitElement {
  static get styles() {
    return bootstrapStyles;
  }

  @property({ attribute: false, type: Array }) arMainButtons: any = [];
  @property({ attribute: false, type: Array }) arSecondaryButtons: any = [];

  // NOTE: ActionButtons is NOT derived from BridgeBase; just derived from LitElement
  constructor() {
    super();
  }

  mainButtons(): any {
    const arButtonHtml: any[] = [];
    // arStagesHtml.push(html`<div class="psdk-stages">`);
    // arStagesHtml.push(html`<div class="psdk-stages-div">`);

    if (this.arMainButtons != null) {
      for (const aButton of this.arMainButtons) {
        const name: string = aButton.name;
        const jsAction: string = aButton.jsAction;

        arButtonHtml.push(
          html`<button class="btn btn-primary" jsAction=${jsAction} buttonType="primary" @click="${this._buttonClick}">${name}</button>`
        );

        // add a space between buttons
        if (this.arMainButtons.indexOf(aButton) < this.arMainButtons.length - 1) {
          arButtonHtml.push(html`&nbsp;`);
        }
      }
    }

    return arButtonHtml;
  }

  secondaryButtons(): any {
    const arButtonHtml: any[] = [];
    // arStagesHtml.push(html`<div class="psdk-stages">`);
    // arStagesHtml.push(html`<div class="psdk-stages-div">`);

    if (this.arSecondaryButtons != null) {
      for (const aButton of this.arSecondaryButtons) {
        const name: string = aButton.name;
        const jsAction: string = aButton.jsAction;

        arButtonHtml.push(
          html`<button class="btn btn-secondary" jsAction=${jsAction} buttonType="secondary" @click="${this._buttonClick}">${name}</button>`
        );

        // add a space between buttons
        if (this.arSecondaryButtons.indexOf(aButton) < this.arSecondaryButtons.length - 1) {
          arButtonHtml.push(html`&nbsp;`);
        }
      }
    }

    return arButtonHtml;
  }

  aButtonsHtml(): any {
    return html`
      <div class="nq_button_grid">
        <div>${this.secondaryButtons()}</div>
        <div>${this.mainButtons()}</div>
      </div>
    `;
  }

  render() {
    const sContent = html`${this.aButtonsHtml()}`;

    const arHtml: any[] = [];

    arHtml.push(actionButtonsStyles);
    arHtml.push(sContent);

    return arHtml;
  }

  _buttonClick(e) {
    const target = e.target;
    const buttonData: any = {};

    buttonData.action = target.getAttribute('jsAction');
    buttonData.buttonType = target.getAttribute('buttonType');

    const event = new CustomEvent('ActionButtonClick', {
      detail: { data: buttonData }
    });

    this.dispatchEvent(event);
  }
}

export default ActionButtons;
