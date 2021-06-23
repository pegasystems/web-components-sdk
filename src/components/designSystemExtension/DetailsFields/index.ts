import { html, customElement, property, LitElement } from '@lion/core';
import { SdkConfigAccess } from '../../../helpers/config_access';
import { format } from '../../../helpers/formatters/';

// NOTE: you need to import ANY component you may render.

// import the component's styles as HTML with <style>
import { detailsFieldsStyles } from './details-fields-styles';

// Declare that PCore will be defined when this code is run
declare var PCore: any;

@customElement('details-fields-extension')
class DetailsFields extends LitElement {

  @property ( {attribute: true, type: Array} ) arFields: Array<any> = [];
  @property ( {attribute: true, type: Array} ) arFields2: Array<any> = [];
  @property ( {attribute: true, type: Array} ) arFields3: Array<any> = [];

  settingsSvgIcon: string = "";

  imagePath: string = "";

  elMenu: any = null;



 // NOTE: DetailsFields is NOT derived from BridgeBase; just derived from LitElement
  constructor() {
    super();


  }



  connectedCallback() {
    super.connectedCallback();

    //this.updateFields();

  }


  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();


  }

  getFieldLabel(field: any) {
    switch(field.type.toLowerCase()) {
      default:
        return field.config.label;
    }
  }

  getFieldValue(field: any): any {

    if (field.config.value == null || field.config.value == "") {
      switch(field.type.toLowerCase()) {
        case "caseoperator" :
          return html ``;
        default: 
          return html`<span class="psdk-details-text-style">---</span>`;
      }
    }

    switch(field.type.toLowerCase()) {
      case "textinput" :
        return html`<span class="psdk-details-text-style">${field.config.value}</span>`;
      case "status" :
        return html`<span class="psdk-details-status-style">${field.config.value}</span>`;
      case "phone":
        return html`<a as="a" href="tel: ${field.config.value}">${field.config.value}</a>`;
      case "email":
        return html`<a href="mailto: ${field.config.value}">${field.config.value}</a>`;
      case "date":
        return html`<span class="psdk-details-text-style">${format(field.config.value, field.type)}</span>`;
      case "caseoperator":
        return html ``;
      default:
        return html`<span class="psdk-details-text-style">${field.config.value}</span>`;

    }
    
    
  }

  getFieldsHtml(arFields) : any {
    let arFHtml: any[] = [];

    for (let field of arFields) {
      arFHtml.push( html`
        <div class="psdk-details-fields-single">
          <dt class="psdk-details-fields-label">
          ${this.getFieldLabel(field)}
          </dt>
          <dd class="psdk-csf-primary-field-value">
            ${this.getFieldValue(field)}
          </dd>
        </div>
      `);

    }

    return arFHtml;
  }



  getDetailsFieldsHtml() : any {

    let arDetailsHtml = html`
      <div class="psdk-details-group">
        <div class="psdk-details-fields">
          <dl class="psdk-details-fields-primary">
          ${this.getFieldsHtml(this.arFields)}
          </dl>
        </div>
        <div class="psdk-details-fields">
          <dl class="psdk-details-fields-primary">
          ${this.getFieldsHtml(this.arFields2)}
          </dl>
        </div>
        <div class="psdk-details-fields">
          <dl class="psdk-details-fields-primary">
          ${this.getFieldsHtml(this.arFields3)}
          </dl>
        </div>
     </div>
    `;


    return arDetailsHtml;
    
  }






  render(){


    const sContent = html`${this.getDetailsFieldsHtml()}`;
    const locBootstrap = SdkConfigAccess.getSdkConfigBootstrapCSS();

    let arHtml: any[] = [];

    // DetailsFields not derived from BridgeBase, so we need to load Bootstrap CSS
    arHtml.push( html`<link rel='stylesheet' href='${locBootstrap}'>`);

    arHtml.push(detailsFieldsStyles);
    arHtml.push(sContent);


    return arHtml;

  }




}

export default DetailsFields;