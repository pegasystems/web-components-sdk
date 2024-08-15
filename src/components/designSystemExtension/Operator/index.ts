import { LitElement, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { SdkConfigAccess } from "@pega/auth/lib/sdk-auth-manager";
import { Utils } from "../../../helpers/utils";

// NOTE: you need to import ANY component you may render.

// import the component's styles as HTML with <style>
import { operatorStyles } from "./operator-styles";

// Declare that PCore will be defined when this code is run
declare var PCore: any;

@customElement("operator-extension")
class Operator extends LitElement {
  @property({ attribute: true, type: Object }) caseOpConfig; // the config object of the CaseOperator to be displayed
  @property({ attribute: true, type: String }) label: String = "";
  @property({ attribute: true, type: String }) name: String = "";
  @property({ attribute: false, type: String }) theDateTime = "";
  @property({ attribute: true, type: String }) theId: String = "";
  @property({ attribute: false, type: Array }) fields: any = [];
  @property({ attribute: false, type: Boolean }) bShowPopover: Boolean = false;

  theComponentName = "Operator";
  bDebug: Boolean = false;
  bLogging: Boolean = false;

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.bLogging) {
      console.log(`${this.theComponentName}: connectedCallback`);
    }
    if (this.bDebug) {
      debugger;
    }

    // Get associated info out of the caseOpConfig that's passed in
    //  CaseOperator is a special case where the config that's passed in has both
    //  Create and Update operator info and we need to use the "label" to determine
    //  which is being requested.
    let theRealOperator: any = {};
    let theRealTime: string = "";

    const theLowerCaseLabel = this.caseOpConfig?.label.toLowerCase();

    switch (theLowerCaseLabel) {
      case "create operator":
        theRealOperator = this.caseOpConfig.createOperator;
        theRealTime = this.caseOpConfig.createDateTime;
        break;

      case "update operator":
        theRealOperator = this.caseOpConfig.updateOperator;
        theRealTime = this.caseOpConfig.updateDateTime;
        break;
    }

    this.name = theRealOperator.userName;
    this.theId = theRealOperator.userId;
    this.theDateTime = theRealTime;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.bLogging) {
      console.log(`${this.theComponentName}: disconnectedCallback`);
    }
    if (this.bDebug) {
      debugger;
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

  hideOperator() {
    if (this.bDebug) {
      debugger;
    }

    this.bShowPopover = false;

    // remove clickAway listener
    window.removeEventListener("mouseup", this._clickAway.bind(this));
  }

  showOperator() {
    if (this.bDebug) {
      debugger;
    }

    // Hide when clicked and already shown...
    if (this.bShowPopover) {
      this.hideOperator();
      return;
    }

    const operatorPreviewPromise = PCore.getUserApi().getOperatorDetails(
      this.theId,
    );

    operatorPreviewPromise.then((res) => {
      if (this.bDebug) {
        debugger;
      }
      const fillerString = "---";
      if (
        res.data &&
        res.data.pyOperatorInfo &&
        res.data.pyOperatorInfo.pyUserName
      ) {
        this.fields = [
          {
            id: "pyPosition",
            name: "Position",
            value: res.data.pyOperatorInfo.pyPosition
              ? res.data.pyOperatorInfo.pyPosition
              : fillerString,
          },
          {
            id: "pyOrganization",
            name: "Organization",
            value: res.data.pyOperatorInfo.pyOrganization
              ? res.data.pyOperatorInfo.pyOrganization
              : fillerString,
          },
          {
            id: "ReportToUserName",
            name: "Reports to",
            value: res.data.pyOperatorInfo.pyReportToUserName
              ? res.data.pyOperatorInfo.pyReportToUserName
              : fillerString,
          },
          {
            id: "pyTelephone",
            name: "Telephone",
            value: res.data.pyOperatorInfo.pyTelephone
              ? res.data.pyOperatorInfo.pyTelephone
              : fillerString,
          },
          {
            id: "pyEmailAddress",
            name: "Email address",
            value: res.data.pyOperatorInfo.pyEmailAddress
              ? res.data.pyOperatorInfo.pyEmailAddress
              : fillerString,
          },
        ];
      } else {
        if (this.bDebug) {
          debugger;
        }
        if (this.bDebug) {
          console.log(
            `CaseOperator: PCore.getUserApi().getOperatorDetails(${this.theId}); returned empty res.data.pyOperatorInfo.pyUserName - adding default`,
          );
        }
        this.fields = [
          {
            id: "pyPosition",
            name: "Position",
            value: fillerString,
          },
          {
            id: "pyOrganization",
            name: "Organization",
            value: fillerString,
          },
          {
            id: "ReportToUserName",
            name: "Reports to",
            value: fillerString,
          },
          {
            id: "pyTelephone",
            name: "Telephone",
            value: fillerString,
          },
          {
            id: "pyEmailAddress",
            name: "Email address",
            value: fillerString,
          },
        ];
      }

      this.bShowPopover = true;

      // add clickAway listener
      window.addEventListener("mouseup", this._clickAway.bind(this));
    });
  }

  theRenderedDiv() {
    return html`
      <div>
        ${this.label
          ? html`
        <div class="psdk-single psdk-top-pad">${this.label}</div>
          <span class="btn-link" type="button" color="primary" @click="${this.showOperator}">${this.name}</span>
          ${Utils.generateDateTime(this.theDateTime, "DateTime-Since")}
          </div>
        </div>
        `
          : html`
              <span
                class="btn-link"
                type="button"
                color="primary"
                @click="${this.showOperator}"
                >${this.name}</span
              >
              ${Utils.generateDateTime(this.theDateTime, "DateTime-Since")}
            `}
        ${this.bShowPopover
          ? html`
              <div class="psdk-operator-popover">
                <dl>
                  ${this.fields.map(
                    (field) => html`
                      <div>
                        <dt
                          class="psdk-operator-name text-muted small"
                          [ngStyle]="{'grid-row-start': i+1}"
                        >
                          ${field.name}
                        </dt>
                        <dd
                          class="psdk-operator-value"
                          [ngStyle]="{'grid-row-start': i+1}"
                        >
                          ${field.value}
                        </dd>
                      </div>
                    `,
                  )}
                </dl>
              </div>
            `
          : nothing}
      </div>
    `;
  }

  render() {
    if (this.bLogging) {
      console.log(`${this.theComponentName}: render`);
    }
    if (this.bDebug) {
      debugger;
    }

    const locBootstrap = SdkConfigAccess.getSdkConfigBootstrapCSS();
    let arHtml: Array<any> = [];

    // Operator not derived from BridgeBase, so we need to load Bootstrap CSS
    arHtml.push(html`<link rel="stylesheet" href="${locBootstrap}" />`);

    arHtml.push(operatorStyles);
    arHtml.push(this.theRenderedDiv());

    return arHtml;
  }

  _clickAway(event: any) {
    var bInMenu = false;

    //run through list of elements in path, if menu not in th path, then want to
    // hide (toggle) the menu
    for (let i in event.path) {
      if (
        event.path[i].className == "psdk-operator-popover" ||
        event.path[i].className == "btn-link"
      ) {
        bInMenu = true;
        break;
      }
    }
    if (!bInMenu) {
      this.hideOperator();
    }
  }
}

export default Operator;
