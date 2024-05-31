import { html, customElement, property, LitElement } from '@lion/core';
import { SdkConfigAccess } from '@pega/auth/lib/sdk-auth-manager';

import '@lion/button/define';
import '@lion/textarea/define';

import '../MashupBundleSwatch';
import '../MashupResolutionScreen';

// NOTE: you need to import ANY component you may render.

// import the component's styles as HTML with <style>
import { mashupMainScreenStyles } from './mashup-main-screen-styles';

// Declare that PCore will be defined when this code is run
declare var PCore: any;
declare var myLoadMashup: any;

@customElement('mashup-main-screen-component')
class MashupMainScreen extends LitElement {

  @property( {attribute: false, type: Object } ) pConn; 


  firstConfig: any;
  secondConfig: any;
  thirdConfig: any;

  @property( {attribute: false, type: Boolean} ) showTriplePlayOptions = true;
  @property( {attribute: false, type: Boolean} ) showPega = false;
  @property( {attribute: false, type: Boolean} ) showResolution = false;

  cableInfo: string = "";

  // NOTE: MashupMainScreen is NOT derived from BridgeBase; just derived from LitElement
  constructor() {
    super();

  }

  connectedCallback() {
    super.connectedCallback();

    if (this.pConn) {
      this.pConn = this.pConn.getPConnect();
    }

    this.cableInfo = "assets/img/cableinfo.png";

    this.firstConfig = { 
      "play" : "Triple Play",
      "level" : "Basic",
      "channels": "100+",
      "channels_full" : "100+ (Basic +)",
      "banner" : "Value package",
      "price": "99.00",
      "internetSpeed" : "100 Mbps",
      "calling": "",
    };

    // second
    this.secondConfig = { 
      "play" : "Triple Play",
      "level" : "Silver",
      "channels" : "125+",
      "channels_full" : "125+ (Deluxe)",
      "banner" : "Most popular",
      "price": "120.00",
      "internetSpeed" : "300 Mbps",
      "calling": ""
    };

    // third
    this.thirdConfig = { 
      "play" : "Triple Play",
      "level" : "Gold",
      "channels" : "175+",
      "channels_full" : "175+ (Premium)",
      "banner" : "All the channels you want",
      "price": "150.00",
      "internetSpeed" : "1 Gbps",
      "calling": " & International"
    };

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
    this.showTriplePlayOptions = true;
    this.showPega = false;
  }

  assignmentFinished() {
    // this.showResolution = true;
    // this.showPega = false;
  }

  

  getMashupMainScreenHtml() : any {

    const mMSHtml = html `
    
    <div class="cc-main-div">
    ${this.showTriplePlayOptions? 
    html`
      <div class="cc-main-screen">
        <div class="cc-banner">
            <h1>Hi Ava,</h1>
            How can we help you today?
        </div>
    
        <div>
            <mashup-bundle-swatch-component .swatchConfig="${this.firstConfig}" @ShopNowButtonClick="${this._onShopNow}"></mashup-bundle-swatch-component>
            <!-- <mashup-bundle-swatch-component .swatchConfig="${this.secondConfig}" @ShopNowButtonClick="${this._onShopNow}"></mashup-bundle-swatch-component>
            <mashup-bundle-swatch-component .swatchConfig="${this.thirdConfig}" @ShopNowButtonClick="${this._onShopNow}"></mashup-bundle-swatch-component> -->
        </div>


      </div>
    `
    :
    html``}

    ${this.showPega?
    html`
      <div>
        <div class="cc-info">
            <div class="cc-info-pega">
                <root-container .pConn="${this.pConn}" ?displayOnlyFA="${true}" ?isMashup="${true}"></root-container>
                <!-- <br>
                <div style="padding-left: 50px;"> * - required fields</div>-->
            </div>
            <!-- <div class="cc-info-banner">
                <div class="cc-info-banner-text">
                    We need to gather a little information about you.
                </div>
                <div>
                    <img src="assets/img/cableinfo.png" class="cc-info-image">
                </div>
                
            </div> -->
        </div>
        
      </div>
    `
    :
    html``}

    ${this.showResolution?
    html`
      <div>
        <mashup-resolution-screen-component></mashup-resolution-screen-component>
      </div>
      `
    :
    html``
    }
  </div>
  `;



  


    return mMSHtml;
  }


  render(){

    const sContent = this.getMashupMainScreenHtml();
    const locBootstrap = SdkConfigAccess.getSdkConfigBootstrapCSS();

    let arHtml: Array<any> = [];

    // MashupMainScreen not derived from BridgeBase, so we need to load Bootstrap CSS
    arHtml.push( html`<link rel='stylesheet' href='${locBootstrap}'>`);

    arHtml.push(mashupMainScreenStyles);
    arHtml.push(sContent);

    return arHtml;

  }


  _onShopNow(e: any) {

    let sLevel = e.target.labelLevel;

    this.showTriplePlayOptions = false;
    this.showPega = true;

    let actionsApi = this.pConn.getActionsApi();
    let createWork = actionsApi.createWork.bind(actionsApi);
    let sFlowType = "pyStartCase";


    
    //
    // NOTE:  Below, can remove case statement when 8.6.1 and pyCreate
    //        works with mashup and can default to MediaCo


    let actionInfo;
   
    const caseTypes = PCore.getEnvironmentInfo().environmentInfoObject.pyCaseTypeList;
    let mashupCaseType = caseTypes[0].pyWorkTypeImplementationClassName;

    switch (PCore.getEnvironmentInfo().getApplicationLabel()) {
      case "CableCo" :
        actionInfo = {
          containerName: "primary",
          flowType: sFlowType ? sFlowType : "pyStartCase",
          caseInfo: {
            content : {
              "Package" : sLevel
            }
          }
        };

        createWork("CableC-CableCon-Work-Service", actionInfo);
        break;
      case "MediaCo" :

        actionInfo = {
          containerName: "primary",
          flowType: sFlowType ? sFlowType : "pyStartCase",
          caseInfo: {
            content : {
              "Package" : sLevel
            }
          }
        };

        createWork("DIXL-MediaCo-Work-NewService", actionInfo);
        break;
        case "UplusAuto" :

          actionInfo = {
            pageName: 'pyEmbedAssignment'
            // flowType: sFlowType ? sFlowType : "pyStartCase",
            // caseInfo: {
            //   content : {
            //     "Package" : ''
            //   }
            // }
          };
  
          // createWork("O533RU-UplusAuto-Work-ScheduleMaintenanceVisit", actionInfo);
          PCore.getMashupApi().createCase("O533RU-UplusAuto-Work-ScheduleMaintenanceVisit",this.pConn.getContextName()).then(
            ()=>{console.log('case created');}
          );
          break;
          case "U+Auto" :

          actionInfo = {
            pageName: 'pyEmbedAssignment'
            //flowType: sFlowType ? sFlowType : "pyStartCase",
            // caseInfo: {
            //   content : {
            //     "Package" : ''
            //   }
            // }
          };
  
          PCore.getMashupApi().createCase(mashupCaseType,this.pConn.getContextName()).then(
            ()=>{console.log('case created');}
          );
          // createWork("O533RU-UplusAuto-Work-ScheduleMaintenanceVisit", actionInfo);
          break;
        
    }


  }



}

export default MashupMainScreen;