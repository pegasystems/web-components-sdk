import { LitElement, html  } from "lit";
import { customElement, property } from "lit/decorators.js";

import { SdkConfigAccess } from '@pega/auth/lib/sdk-auth-manager';
import { format } from '../../../helpers/formatters/';

// NOTE: you need to import ANY component you may render.
import '../Operator';

// import the component's styles as HTML with <style>
import { caseSummaryFieldsStyles } from './case-summary-fields-styles';


import '@lion/button/define';

// Declare that PCore will be defined when this code is run
declare var PCore: any;

@customElement('case-summary-fields-extension')
class SummaryItem extends LitElement {

 

  @property ( {attribute: true, type: String} ) status = "";
  @property ( {attribute: true, type: Boolean} ) bShowStatus: boolean = false;

  @property ( {attribute: false, type: Array} ) arPrimaryFields: Array<any> = [];
  @property ( {attribute: false, type: Array} ) arSecondaryFields: Array<any> = [];

  // local, so that when changed, will cause render
  @property ( {attribute: false, type: Array} ) arPrimaryFieldsWithStatus: Array<any> = [];

  settingsSvgIcon: string = "";

  imagePath: string = "";


  elMenu: any = null;



 // NOTE: SummaryItem is NOT derived from BridgeBase; just derived from LitElement
  constructor() {
    super();


  }



  connectedCallback() {
    super.connectedCallback();

    this.updatePrimaryWithStatus();

    
  }


  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();


  }

  willUpdate(changedProperties: any) {
    for (let key of changedProperties.keys()) {
  
      // check for property changes, if so, normalize and render
      if (key == "arPrimaryFields") {

        this.updatePrimaryWithStatus(); 

      }
    }
  }

  updatePrimaryWithStatus() {
    this.arPrimaryFieldsWithStatus = [];
    for (let prim of this.arPrimaryFields) {
      this.arPrimaryFieldsWithStatus.push(prim);
    }

    if (this.bShowStatus) {
      const oStatus = { type: "status", config: { value: this.status, label: "Status" }};

      const count = this.arPrimaryFieldsWithStatus.length;
      if (count < 2) {
        this.arPrimaryFieldsWithStatus.push(oStatus);
      }
      else {
        this.arPrimaryFieldsWithStatus.splice(1, 0, oStatus);
      }
    }
  }

  getFieldLabel(field: any) {
    const theLabel = field.config.label;
    const theLowerCaseLabel =theLabel.toLowerCase();

    switch(field.type.toLowerCase()) {
      case "caseoperator":
        // CaseOperator is a special case since info for created and updated is passed in
        //  and we use the "Label" to see which we're supposed to display

        if (theLowerCaseLabel === "create operator") {
          return field.config.createLabel;
        } else if (theLowerCaseLabel === "update operator") {
          return field.config.updateLabel;
        } else {
          return theLabel;
        }
        break;

      default:
        return field.config.label;
    }
  }

  getFieldValue(field: any): any {

    if (field.config.value == null || field.config.value == "") {
      switch(field.type.toLowerCase()) {
        case "caseoperator" :
          return html `<operator-extension .caseOpConfig=${field.config}></operator-extension>`;
        default: 
          return html`<span class="psdk-csf-text-style">---</span>`;
      }
    }

    switch(field.type.toLowerCase()) {
      case "textinput" :
        return html`<span class="psdk-csf-text-style">${field.config.value}</span>`;
      case "status" :
        return html`<span class="psdk-csf-status-style">${field.config.value}</span>`;
      case "phone":
        return html`<a as="a" href="tel: ${field.config.value}">${field.config.value}</a>`;
      case "email":
        return html`<a href="mailto: ${field.config.value}">${field.config.value}</a>`;
      case "date":
        return html`<span class="psdk-csf-text-style">${format(field.config.value, field.type)}</span>`;
      case "caseoperator":
        return html `<operator-extension .caseOpConfig=${field.config}></operator-extension>`
      default:
        return html`<span class="psdk-csf-text-style">${field.config.value}</span>`;

    }
    
    
  }

  getPrimaryFieldsHtml() : any {
    let pFHtml: Array<any> = [];

    for (let field of this.arPrimaryFieldsWithStatus) {
      pFHtml.push( html`
        <div class="psdk-csf-primary-field">
          <dt class="psdk-csf-primary-field-header">
          ${this.getFieldLabel(field)}
          </dt>
          <dd class="psdk-csf-primary-field-data">
            ${this.getFieldValue(field)}
          </dd>
        </div>
      `);

    }

    return pFHtml;
  }


  getSecondaryFieldsHtml() : any {

    let sFHtml: Array<any> = [];

    for (let field of this.arSecondaryFields) {
      sFHtml.push( html`
        <div class="psdk-csf-secondary-field">
          <dt class="psdk-csf-secondary-field-header">
          ${this.getFieldLabel(field)}
          </dt>
          <dd class="psdk-csf-secondary-field-data">
            ${this.getFieldValue(field)}
          </dd>
        </div>
      `);

    }

    return sFHtml;
  }
 

  getCaseSummaryFieldsHtml() : any {

    let cSFHtml = html`
      <div class="psdk-case-summary-fields">
        <dl class="psdk-case-summary-fields-primary">
        ${this.getPrimaryFieldsHtml()}
        </dl>
      </div>
      <div class="psdk-case-summary-fields">
        <dl class="psdk-case-summary-fields-secondary">
        ${this.getSecondaryFieldsHtml()}
        </dl>
      </div>
    `;


    return cSFHtml;
    
  }






  render(){


    const sContent = html`${this.getCaseSummaryFieldsHtml()}`;
    const locBootstrap = SdkConfigAccess.getSdkConfigBootstrapCSS();

    let arHtml: Array<any> = [];

    // SummaryItem not derived from BridgeBase, so we need to load Bootstrap CSS
    arHtml.push( html`<link rel='stylesheet' href='${locBootstrap}'>`);

    arHtml.push(caseSummaryFieldsStyles);
    arHtml.push(sContent);


    return arHtml;

  }




}

export default SummaryItem;
