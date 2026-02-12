import { CSSResultGroup, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { getSdkConfig } from '@pega/auth/lib/sdk-auth-manager';

// NOTE: you need to import ANY component you may render.
import '../ShoppingOptionsCard';
import '../EmbeddedResolutionScreen';

// import the component's styles
import { mainScreenStyles } from './main-screen-styles';
import { shoppingOptions } from '../utils';

@customElement('embedded-main-screen-component')
class MainScreen extends LitElement {
  @property({ attribute: true, type: Object }) pConn;

  static styles?: CSSResultGroup = mainScreenStyles;

  @state()
  showTriplePlayOptions = true;

  @state()
  showPega = false;

  @state()
  showResolution = false;

  constructor() {
    super();
  }

  /**
   * Called when the component is connected to the DOM.
   */
  connectedCallback(): void {
    super.connectedCallback();

    // Subscribe to the EVENT_CANCEL event to handle the assignment cancellation
    PCore.getPubSubUtils().subscribe(PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL, () => this.cancelAssignment(), 'cancelAssignment');

    // Subscribe to the 'assignmentFinished' event to handle assignment completion
    PCore.getPubSubUtils().subscribe('assignmentFinished', () => this.assignmentFinished(), 'assignmentFinished');
  }

  /**
   * Called when the component is disconnected from the DOM.
   */
  disconnectedCallback(): void {
    super.disconnectedCallback();

    // unsubscribe to the events
    PCore.getPubSubUtils().unsubscribe(PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL, 'cancelAssignment');
    PCore.getPubSubUtils().unsubscribe('assignmentFinished', 'assignmentFinished');
  }

  cancelAssignment() {
    this.showTriplePlayOptions = true;
    this.showPega = false;
  }

  assignmentFinished() {
    this.showResolution = true;
    this.showPega = false;
  }

  /**
   * Handles the 'Shop Now' event by creating a new case using the mashup API.
   *
   * @param {Event} event - The event object triggered by the 'Shop Now' action.
   */
  async _onShopNow(event: CustomEvent) {
    const sLevel = event.detail?.value;

    // Update the UI state to show pega container
    this.showTriplePlayOptions = false;
    this.showPega = true;

    // Get the SDK configuration
    const sdkConfig = await getSdkConfig();
    let mashupCaseType = sdkConfig.serverConfig.appMashupCaseType;

    // If mashupCaseType is null or undefined, get the first case type from the environment info
    if (!mashupCaseType) {
      // @ts-ignore - Object is possibly 'null'
      const caseTypes: any = PCore.getEnvironmentInfo().environmentInfoObject.pyCaseTypeList;
      mashupCaseType = caseTypes[0].pyWorkTypeImplementationClassName;
    }

    // Create options object with default values
    const options: any = {
      pageName: 'pyEmbedAssignment',
      startingFields: {}
    };

    // If mashupCaseType is 'DIXL-MediaCo-Work-NewService', add Package field to startingFields
    if (mashupCaseType === 'DIXL-MediaCo-Work-NewService') {
      options.startingFields.Package = sLevel;
    }

    // Create a new case using the mashup API
    PCore.getMashupApi()
      .createCase(mashupCaseType, PCore.getConstants().APP.APP, options)
      .then(() => {
        console.log('createCase rendering is complete');
      });
  }

  getShoppingOptionCardsHTML() {
    return shoppingOptions.map(
      option => html`<shopping-options-card-component .option="${option}" @ShopNowButtonClick="${this._onShopNow}"></shopping-options-card-component>`
    );
  }

  protected render() {
    return html` <div class="cc-main-div">
      ${this.showTriplePlayOptions
        ? html`
            <div class="cc-main-screen">
              <div class="cc-banner">Combine TV, Internet, and Voice for the best deal</div>

              <div style="display: flex; justify-content: space-evenly;">${this.getShoppingOptionCardsHTML()}</div>
            </div>
          `
        : html``}
      ${this.showPega
        ? html`
            <div>
              <div class="cc-info">
                <div class="cc-info-pega">
                  <root-container .pConn="${this.pConn}" ?displayOnlyFA="${true}"></root-container>
                </div>
                <div class="cc-info-banner">
                  <div class="cc-info-banner-text">We need to gather a little information about you.</div>
                  <div>
                    <img src="assets/img/cableinfo.png" class="cc-info-image" />
                  </div>
                </div>
              </div>
            </div>
          `
        : html``}
      ${this.showResolution
        ? html`
            <div>
              <embedded-resolution-screen-component></embedded-resolution-screen-component>
            </div>
          `
        : html``}
    </div>`;
  }
}

export default MainScreen;
