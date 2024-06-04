import { html, customElement, property, LitElement } from '@lion/core';
import { SdkConfigAccess } from '@pega/auth/lib/sdk-auth-manager';

import '@lion/button/define';
import '@lion/textarea/define';


// NOTE: you need to import ANY component you may render.

// import the component's styles as HTML with <style>
import { mashupUplusUconnectStyles } from './mashup-uplus-uconnect-styles';

// Declare that PCore will be defined when this code is run
declare var PCore: any;



@customElement('mashup-uplus-uconnect-component')
class MashupUplusUconnect extends LitElement {

  @property( {attribute: false, type: Object} ) swatchConfig; 


  // NOTE: MashupBundleSwatch is NOT derived from BridgeBase; just derived from LitElement
  constructor() {
    super();

  }

  connectedCallback() {
    super.connectedCallback();

  }


  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();


  }


  


  getButtonSwatchHtml() : any {

    const bSHtml = html`
    <div style="display: table; width: 100%">
      <div style="display: flex; flex-direction: column; justify-content: space-between; width:30%; margin-left: 1%; float:left">
        <button class="card" @click=${() => { this._schedule() }}>
          <div style="width:20%; text-align:center">
            <img src="./assets/img/service.png" style="width:65%">
          </div>
          <div style="margin-left: 2%; width:80%; text-align:left">
            <div class="cc-swatch-banner">
              Schedule Service Appointment
            </div>
            <div style="font-size: smaller; color: grey; margin-top: 10px;">
            Whether you need to get a simple oil change or need to repair extensive damages, we've got you covered.
            </div>
            <div style="font-size: smaller; color: var(--app-primary-dark-color); margin-top: 10px;">
              Get started
            </div>
          </div>
        </button>
        <button class="card">
          <div style="width:20%; text-align:center">
            <img src="./assets/img/download.png" style="width:65%">
          </div>
          <div style="margin-left: 2%; width:80%; text-align:left">
            <div class="cc-swatch-banner">
              Download User's Manual
            </div>
            <div style="font-size: smaller; color: grey; margin-top: 10px;">
            Find your user manual, and other documents, available for download.
            </div>
            <div style="font-size: smaller; color: var(--app-primary-dark-color); margin-top: 10px;">
              Get started
            </div>
          </div>
        </button>
        <button class="card">
          <div style="width:20%; text-align:center">
            <img src="./assets/img/troubleshoot.png" style="width:65%">
          </div>
          <div style="margin-left: 2%; width:80%; text-align:left">
            <div class="cc-swatch-banner">
              Troubleshoot Infotainment Issue
            </div>
            <div style="font-size: smaller; color: grey; margin-top: 10px;">
            Whether you need to get a simple oil change or need to repair extensive damages, we've got you covered.
            </div>
            <div style="font-size: smaller; color: var(--app-primary-dark-color); margin-top: 10px;">
              Get started
            </div>
          </div>
        </button>
      </div>
      <div style ="display: flex; flex-direction: column; justify-content: space-between; width:66%; margin-left: 1%; float: left; margin-right: 2%">
        <div style="display: flex; flex-direction: row; justify-content: space-between; margin-bottom: 2%;">
          <div class="card-team" style="width:49%">
            <div class="cc-swatch-banner" style="margin-bottom:1%">
              Service Team
            </div>
            <table>
            <tr>
              <td style="width: 20%">
                <img src="./assets/img/Amy.png">
              </td>
              <td>
                <p style="margin-bottom: auto;">Amy billings</p>
                <p style="font-size:small; color:gray; margin-bottom: auto;">Service Advisor</p>
              </td>
            </tr>
            <tr>
              <td style="width: 20%">
                <img src="./assets/img/Luca.png">
              </td>
              <td>
                <p style="margin-bottom: auto;">Luca Lopez</p>
                <p style="font-size:small; color:gray; margin-bottom: auto;">Service Advisor</p>
              </td>
            </tr>
            </table>
          </div>
          <div class="card-team" style="width:49%">
            <div class="cc-swatch-banner" style="margin-bottom: 1%">
              Driver Profiles
            </div>
            <table>
            <tr>
              <td style="width: 20%">
                <img src="./assets/img/Avatars.png">
              </td>
              <td>
                <p style="margin-bottom: auto;">Ava</p>
                <p style="font-size:small; color:gray; margin-bottom: auto;">Primary driver</p>
              </td>
              <td style="align-content: end;">
                <p style="font-size: smaller; color: var(--app-primary-dark-color);">Edit</p>
              </td>
            </tr>
            <tr>
              <td style="width: 20%">
                <img src="./assets/img/Jeffery.png">
              </td>
              <td>
                <p style="margin-bottom: auto;">Jeffery</p>
                <p style="font-size:small; color:gray; margin-bottom: auto;">Additional driver</p>
              </td>
              <td style="align-content: end;">
                <p style="font-size: smaller; color: var(--app-primary-dark-color);">Edit</p>
              </td>
            </tr>
            </table>
          </div>
        </div>
        <div class="card-team">
          <div class="cc-swatch-banner" style="margin-bottom:1%">
            Your service history
          </div>
          <table>
            <tr>
              <td>
                <img src="./assets/img/table-wrench.png">
              </td>
              <td>
                <p style="margin-bottom: auto;">Scheduled maintenance</p>
                <p style="font-size:small; color:gray; margin-bottom: auto;">Oil Change, Tire rotation, Check fluids</p>
              </td>
              <td>
                <img src="./assets/img/table-arrow_right_24px.png">
              </td>
            </tr>
            <tr>
              <td>
                <img src="./assets/img/table-Recall.png">
              </td>
              <td>
                <p style="margin-bottom: auto;">Recall service</p>
                <p style="font-size:small; color:gray; margin-bottom: auto;">Performed Service Campaign #A12B3 - Faulty window motor</p>
              </td>
              <td>
                <img src="./assets/img/table-arrow_right_24px.png">
              </td>
            </tr>
            <tr>
              <td>
                <img src="./assets/img/table-wrench.png">
              </td>
              <td>
                <p style="margin-bottom: auto;">Service appointment</p>
                <p style="font-size:small; color:gray; margin-bottom: auto;">Replaced from left rotor and brake pads, windshield wipers, and investigated rattle near driver's side window</p>
              </td>
              <td>
                <img src="./assets/img/table-arrow_right_24px.png">
              </td>
            </tr>
            <tr>
              <td>
                <img src="./assets/img/table-troubleshoot.png">
              </td>
              <td>
                <p style="margin-bottom: auto;">Troubleshoot infotainment issue</p>
                <p style="font-size:small; color:gray; margin-bottom: auto;">Complaint of long screen load times</p>
              </td>
              <td>
                <img src="./assets/img/table-arrow_right_24px.png">
              </td>
            </tr>
            <tr>
              <td>
                <img src="./assets/img/table-wrench.png">
              </td>
              <td>
                <p style="margin-bottom: auto;">State inspection</p>
                <p style="font-size:small; color:gray; margin-bottom: auto;">Standard state inspection service</p>
              </td>
              <td>
                <img src="./assets/img/table-arrow_right_24px.png">
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>  
    `;


    return bSHtml;
  }

  render(){

    const sContent = this.getButtonSwatchHtml();
    const locBootstrap = SdkConfigAccess.getSdkConfigBootstrapCSS();

    let arHtml: Array<any> = [];

    // MashupBundleSwatch not derived from BridgeBase, so we need to load Bootstrap CSS
    arHtml.push( html`<link rel='stylesheet' href='${locBootstrap}'>`);

    arHtml.push(mashupUplusUconnectStyles);
    arHtml.push(sContent);

    return arHtml;

  }


  _schedule() {
 
    let event = new CustomEvent('ScheduleService', {
      
    });

    this.dispatchEvent(event);
  }

   


}

export default MashupUplusUconnect;