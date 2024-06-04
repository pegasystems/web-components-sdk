import { html, customElement, property, LitElement } from '@lion/core';
import { SdkConfigAccess } from '@pega/auth/lib/sdk-auth-manager';
import '../../../components/RootContainer';
// NOTE: you need to import ANY component you may render.

// import the component's styles as HTML with <style>
import { tradeStyles } from './trade-styles';

// Declare that PCore will be defined when this code is run
declare var PCore: any;
declare var myLoadMashup: any;

@customElement('trade-component')
class Trade extends LitElement {

  @property( {attribute: false, type: Object } ) pConn; 
  
  showTradeIn = true;
  showPega: boolean = false;
  showResolution = false;

  // NOTE: MashupMainScreen is NOT derived from BridgeBase; just derived from LitElement
  constructor() {
    super();

  }

  connectedCallback() {
    super.connectedCallback();

    if (this.pConn) {
      this.pConn = this.pConn.getPConnect();
    }

    // this.cableInfo = "assets/img/cableinfo.png";

    PCore.getPubSubUtils().subscribe(
      PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL,
      () => { this.cancelAssignment() },
      "cancelAssignment"
    );

    PCore.getPubSubUtils().subscribe(
      "assignmentFinished",
      () => { this.assignmentFinished() },
      "assignmentFinished"
    );


  }


  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();

    PCore.getPubSubUtils().unsubscribe(
      PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL,
      "cancelAssignment"
    );

    PCore.getPubSubUtils().unsubscribe(
      "assignmentFinished",
      "assignmentFinished"
    );


  }

  cancelAssignment() {
    this.showTradeIn = true;
    this.showPega = false;
  }

  assignmentFinished() {
    //if(PCore.getEnvironmentInfo().getApplicationLabel() !== 'UplusAuto'){
      this.showResolution = true;
      this.showPega = false;
      this.requestUpdate();
    //}
  }

  getStarted() {
    this.showPega = true;
    this.showTradeIn = false;
    // let event = new CustomEvent('TradeInService', {
      
    // });

    // this.dispatchEvent(event);
    PCore.getMashupApi().createCase("O533RU-UplusAuto-Work-TradeIn",this.pConn.getContextName()).then(
      ()=>{
        console.log('case created');
        // this.requestUpdate();
    }
    );
    this.requestUpdate();
    // <mashup-main-screen-component .pConn=${this.props}></mashup-main-screen-component>
  }

  getMashupMainScreenHtml() : any {

    let mMSHtml;
    if(this.showResolution){
      mMSHtml = html `
      <div class="cc-resolution">
        <div class="cc-body-uplus">
          Congrats on your trade in offer!
        </div>
      </div>
    `;
    }else{

      mMSHtml = html `
      ${this.showTradeIn ? html `
      <div class="cc-main-div">
          <div style="width: 31rem;margin-right: 4rem;">
            <div>
              <h3>We’re interested in your car!</h3>
              <div>With our quick and easy trade in process, you will get an instant offer that is good for 30 days.</div>
            </div>
            <div style="display: flex;width: 29rem;" class="card">
              <div>
                <img src="assets/img/service.png" class="cc-info-image">
              </div>
              <div style="justify-content: center; flex-direction: column; display: flex;">
                <h5>Get started with your trade in</h5>
                <div style="color: grey;font-size: 12px;">Ready to get going with your trade in? The process only takes a few minutes.</div>
                <button  class="get-started-button" mat-raised-button color="primary"  jsAction="delete" @click="${this.getStarted}" >Get started</button>
              </div>
            </div>
          </div>
          <div style="flex-direction: column;
          display: flex; align-items:center; gap: 2rem; width: 16rem">
            <h3>How it works</h3>
            <div><img src="assets/img/handshake.png"></div>
            <h4 class="text-align">Get your instant online guaranteed offer</h4>
            <div class=vl></div>
            <div><img src="assets/img/tow-truck.png"></div>
            <h4 class="text-align">We will pick up your car at your convenience</h4>
            <div class=vl></div>
            <div><img src="assets/img/dollar-sign.png"></div>
            <h4 class="text-align">Get a check or credit toward a new purchase</h4>
          </div>
      </div>
      `: html `
        <div>
          <div class="cc-info">
              <div class="uplus-info-pega">
                  <root-container .pConn="${this.pConn}" ?displayOnlyFA="${true}" ?isMashup="${true}"></root-container>
              </div>
          </div>

        </div>
      `}`;
    }

    // const mMSHtml = html `
    
    // <div class="cc-main-div">
    // ${this.showPega?
    // html`
    //     <div style="width: 31rem;margin-right: 4rem;">
    //       <div>
    //         <h3>We’re interested in your car!</h3>
    //         <div>With our quick and easy trade in process, you will get an instant offer that is good for 30 days.</div>
    //       </div>
    //       <div style="display: flex;width: 29rem;" class="card">
    //         <div>
    //           <img src="assets/img/service.png" class="cc-info-image">
    //         </div>
    //         <div style="justify-content: center; flex-direction: column; display: flex;">
    //           <h5>Get started with your trade in</h5>
    //           <div style="color: grey;font-size: 12px;">Ready to get going with your trade in? The process only takes a few minutes.</div>
    //           <button  class="get-started-button" mat-raised-button color="primary"  jsAction="delete" @click="${this.getStarted}" >Get started</button>
    //         </div>
    //       </div>
    //     </div>
    //     <div style="flex-direction: column;
    //     display: flex; align-items:center; gap: 2rem; width: 16rem">
    //       <h3>How it works</h3>
    //       <div><img src="assets/img/handshake.png"></div>
    //       <h4 class="text-align">Get your instant online guaranteed offer</h4>
    //       <div class=vl></div>
    //       <div><img src="assets/img/tow-truck.png"></div>
    //       <h4 class="text-align">We will pick up your car at your convenience</h4>
    //       <div class=vl></div>
    //       <div><img src="assets/img/dollar-sign.png"></div>
    //       <h4 class="text-align">Get a check or credit toward a new purchase</h4>
    //     </div>
    // </div>` : html `
    //   <mashup-main-screen-component .pConn=${this.pConn} .showPega=${this.showPega}></mashup-main-screen-component>
    // `}`

  


    return mMSHtml;
  }


  render(){

    const sContent = this.getMashupMainScreenHtml();
    const locBootstrap = SdkConfigAccess.getSdkConfigBootstrapCSS();

    let arHtml: Array<any> = [];

    // MashupMainScreen not derived from BridgeBase, so we need to load Bootstrap CSS
    arHtml.push( html`<link rel='stylesheet' href='${locBootstrap}'>`);

    arHtml.push(tradeStyles);
    arHtml.push(sContent);

    return arHtml;

  }


//   _onShopNow(e: any) {

//     let sLevel = e.target.labelLevel;

//     this.showTriplePlayOptions = false;
//     this.showPega = true;

//     let actionsApi = this.pConn.getActionsApi();
//     let createWork = actionsApi.createWork.bind(actionsApi);
//     let sFlowType = "pyStartCase";


    
//     //
//     // NOTE:  Below, can remove case statement when 8.6.1 and pyCreate
//     //        works with mashup and can default to MediaCo


//     let actionInfo;
   
//     const caseTypes = PCore.getEnvironmentInfo().environmentInfoObject.pyCaseTypeList;
//     let mashupCaseType = caseTypes[0].pyWorkTypeImplementationClassName;

//     switch (PCore.getEnvironmentInfo().getApplicationLabel()) {
//       case "CableCo" :
//         actionInfo = {
//           containerName: "primary",
//           flowType: sFlowType ? sFlowType : "pyStartCase",
//           caseInfo: {
//             content : {
//               "Package" : sLevel
//             }
//           }
//         };

//         createWork("CableC-CableCon-Work-Service", actionInfo);
//         break;
//       case "MediaCo" :

//         actionInfo = {
//           containerName: "primary",
//           flowType: sFlowType ? sFlowType : "pyStartCase",
//           caseInfo: {
//             content : {
//               "Package" : sLevel
//             }
//           }
//         };

//         createWork("DIXL-MediaCo-Work-NewService", actionInfo);
//         break;
//         case "UplusAuto" :

//           actionInfo = {
//             pageName: 'pyEmbedAssignment'
//             // flowType: sFlowType ? sFlowType : "pyStartCase",
//             // caseInfo: {
//             //   content : {
//             //     "Package" : ''
//             //   }
//             // }
//           };
  
//           // createWork("O533RU-UplusAuto-Work-ScheduleMaintenanceVisit", actionInfo);
//           PCore.getMashupApi().createCase("O533RU-UplusAuto-Work-ScheduleMaintenanceVisit",this.pConn.getContextName()).then(
//             ()=>{console.log('case created');}
//           );
//           break;
//           case "U+Auto" :

//           actionInfo = {
//             pageName: 'pyEmbedAssignment'
//             //flowType: sFlowType ? sFlowType : "pyStartCase",
//             // caseInfo: {
//             //   content : {
//             //     "Package" : ''
//             //   }
//             // }
//           };
  
//           PCore.getMashupApi().createCase(mashupCaseType,this.pConn.getContextName()).then(
//             ()=>{console.log('case created');}
//           );
//           // createWork("O533RU-UplusAuto-Work-ScheduleMaintenanceVisit", actionInfo);
//           break;
        
//     }


//   }



}

export default Trade;