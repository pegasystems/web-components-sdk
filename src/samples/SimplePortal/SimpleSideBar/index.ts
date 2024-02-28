import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { SdkConfigAccess } from '../../../helpers/config_access';

import '@lion/button/define';
import '@lion/textarea/define';

// NOTE: you need to import ANY component you may render.

// import the component's styles as HTML with <style>
import { simpleSideBarStyles } from './simple-side-bar-styles';




// Declare that PCore will be defined when this code is run
declare var PCore: any;
declare var myLoadMashup: any;

@customElement('simple-side-bar-component')
class SimpleSideBar extends LitElement {


  @property({ attribute: false, type: Object }) pConn;
  @property({ attribute: false, type: Array }) arButtons: Array<any> = [];
  @property({ attribute: false, type: Array }) arWorkItems: Array<any> = [];

  // NOTE: SimpleSideBar is NOT derived from BridgeBase; just derived from LitElement
  constructor() {
    super();

  }

  connectedCallback() {
    super.connectedCallback();

    if (this.pConn) {
      this.pConn = this.pConn.getPConnect();
    }

  }


  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();


  }

  updated(changedProperties) {
    for (let key of changedProperties.keys()) {

      // check for property changes, if so, normalize and render
      if (key == "pConn") {
        if (this.pConn && this.pConn.getPConnect != null) {
          this.pConn = this.pConn.getPConnect();
        }
      }
    }
  }


  getCaseTypes() {
    const sCTHtml: Array<any> = [];

    for (let caseTypeButton of this.arButtons) {
      sCTHtml.push(html`
        <div class="psdk-create-work-button">
          <button class="btn btn-primary" @click=${() => { this.buttonClick([caseTypeButton]) }}>${caseTypeButton["caption"]}</button>
        </div>
      `);
    }

    return sCTHtml;

  }

  getWorkItems() {
    const sWIHtml: Array<any> = [];

    for (let workItem of this.arWorkItems) {
      sWIHtml.push(html`
        <div class="psdk-open-work-button">
          <button class="btn btn-light psdk-btn-text" color="primary" @click=${() => { this.workButtonClick([workItem]) }}>${workItem["caption"]}</button>
        </div>
      `);
    }

    return sWIHtml;
  }


  getSimpleSideBarHtml(): any {

    const sSBHtml: Array<any> = [];

    sSBHtml.push(html`<h2>Create Work</h2>`);
    sSBHtml.push(html`<div class="psdk-create-work">${this.getCaseTypes()}</div>`);
    sSBHtml.push(html`<div class="psdk-worklist">${this.getWorkItems()}</div>`);

    return sSBHtml;
  }


  render() {

    const sContent = this.getSimpleSideBarHtml();
    const locBootstrap = SdkConfigAccess.getSdkConfigBootstrapCSS();

    let arHtml: Array<any> = [];

    // SimpleSideBar not derived from BridgeBase, so we need to load Bootstrap CSS
    arHtml.push(html`<link rel='stylesheet' href='${locBootstrap}'>`);

    arHtml.push(simpleSideBarStyles);
    arHtml.push(sContent);


    return arHtml;

  }

  buttonClick(oButtonData: any) {
    oButtonData = oButtonData[0];
    let actionsApi = this.pConn.getActionsApi();
    let createWork = actionsApi.createWork.bind(actionsApi);
    let sFlowType = "pyStartCase";

    const actionInfo = {
      containerName: "primary",
      flowType: sFlowType ? sFlowType : "pyStartCase"
    };


    PCore.getPubSubUtils().publish(
      "showWork");

    createWork(oButtonData.caseTypeID, actionInfo);
  }

  workButtonClick(oButtonData: any) {
    oButtonData = oButtonData[0];
    let actionsApi = this.pConn.getActionsApi();
    let openAssignment = actionsApi.openAssignment.bind(actionsApi);


    //let sKey = oButtonData.pzInsKey
    const { pxRefObjectClass, pzInsKey } = oButtonData;
    let sTarget = this.pConn.getContainerName();


    let options = { "containerName": sTarget };

    PCore.getPubSubUtils().publish(
      "showWork");


    openAssignment(pzInsKey, pxRefObjectClass, options);
  }






}

export default SimpleSideBar;
