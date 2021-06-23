import { html, customElement, property, nothing } from '@lion/core';
import { BridgeBase } from '../../../bridge/BridgeBase';
// NOTE: you need to import ANY component you may render.

// import the component's styles as HTML with <style>
import { caseOperatorStyles } from './case-operator-styles'



// Declare that PCore will be defined when this code is run
declare var PCore: any;


@customElement('case-operator-widget')
class CaseOperator extends BridgeBase {
  @property( { attribute: true, type: String }) label: String = "default label";
  @property( { attribute: true, type: String }) name: String = "default name";
  @property( { attribute: true, type: String }) helperText: String = "";
  @property( { attribute: true, type: String }) theId: String = "";
  @property( { attribute: false, type: Array }) fields: any = [];
  @property( { attribute: false, type: Boolean}) bShowPopover: Boolean = false;


  constructor() {
    //  Note: BridgeBase constructor has 2 optional args:
    //  1st: inDebug - sets this.bLogging: false if not provided
    //  2nd: inLogging - sets this.bLogging: false if not provided.
    //  To get started, we set both to true here. Set to false if you don't need debugger or logging, respectively.
    super(false, false);
    if (this.bLogging) { console.log(`${this.theComponentName}: constructor`); }
    if (this.bDebug){ debugger; }

    this.pConn = {};
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.bLogging) { console.log(`${this.theComponentName}: connectedCallback`); }
    if (this.bDebug){ debugger; }

    // setup this component's styling...
    this.theComponentStyleTemplate = caseOperatorStyles;

    //NOTE: Need to bind the callback to 'this' so it has this element's context when it's called.
    this.registerAndSubscribeComponent(this.onStateChange.bind(this));
    
  }


  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();
    if (this.bLogging) { console.log(`${this.theComponentName}: disconnectedCallback`); }
    if (this.bDebug){ debugger; }

  }
  
  /**
   * updateSelf
   */
  updateSelf() {
    if (this.bLogging) { console.log(`${this.theComponentName}: updateSelf`); }
    if (this.bDebug){ debugger; }

  }

  /**
   * The `onStateChange()` method will be called when the state is updated.
   *  Override this method in each class that extends BridgeBase.
   *  This implementation can be used for common code that should be done for
   *  all components that are derived from BridgeBase
   */
  onStateChange() {
    if (this.bLogging) { console.log(`${this.theComponentName}: onStateChange`); }
    if (this.bDebug){ debugger; }

    const bShouldUpdate = super.shouldComponentUpdate();

    if (bShouldUpdate) {
      this.updateSelf();
    }
  }

  hideOperator() {
    if (this.bDebug) { debugger; }

    this.bShowPopover = false;
  }

  showOperator() {
    if (this.bDebug) { debugger; }

    // Hide when clicked and already shown...
    if (this.bShowPopover) {
      this.hideOperator();
      return;
    }

    const operatorPreviewPromise = PCore.getUserApi().getOperatorDetails(this.theId);

    operatorPreviewPromise.then((res) => {
      if (this.bDebug) { debugger; }
      if (
        res.data &&
        res.data.pyOperatorInfo &&
        res.data.pyOperatorInfo.pyUserName
      ) {
        let imgPath = "";
        if (this.thePConn && res.data.pyOperatorInfo.pyImageInsKey) {
          imgPath = this.thePConn.getImagePath(
            res.data.pyOperatorInfo.pyImageInsKey
          );
        }
        this.fields = [
          {
            id: "pyPosition",
            name: "Position",
            value: res.data.pyOperatorInfo.pyPosition
          },
          {
            id: "pyOrganization",
            name: "Organization",
            value: res.data.pyOperatorInfo.pyOrganization
          },
          {
            id: "ReportToUserName",
            name: "Reports to",
            value: res.data.pyOperatorInfo.pyReportToUserName
          },
          {
            id: "pyTelephone",
            name: "Telephone",
            value: res.data.pyOperatorInfo.pyTelephone
          },
          {
            id: "pyEmailAddress",
            name: "Email address",
            value: res.data.pyOperatorInfo.pyEmailAddress
          }
        ];
      } else {
        if (this.bDebug) { debugger; }
        if (this.bDebug) { console.log(`CaseOperator: PCore.getUserApi().getOperatorDetails(${this.theId}); returned empty res.data.pyOperatorInfo.pyUserName - adding default`); }
        const fillerString = "unknown";
        this.fields = [
          {
            id: "pyPosition",
            name: "Position",
            value: fillerString
          },
          {
            id: "pyOrganization",
            name: "Organization",
            value: fillerString
          },
          {
            id: "ReportToUserName",
            name: "Reports to",
            value: fillerString
          },
          {
            id: "pyTelephone",
            name: "Telephone",
            value: fillerString
          },
          {
            id: "pyEmailAddress",
            name: "Email address",
            value: fillerString
          }
        ];

      }

      this.bShowPopover = true;

    });
  }


  theRenderedDiv() {
    return html`
      <div class="form-group psdk-operator psdk-double">
        <div class="psdk-single psdk-top-pad">${this.label}</div>
        <div class="psdk-double">
          <button class="btn btn-light" color="primary" style="text-decoration: underline;" @click="${ this.showOperator }">${this.name}</button>
        </div>
      </div>

      ${ (this.bShowPopover) ?
        html`
          <div class="psdk-operator-popover">
            <dl>
              ${this.fields.map((field) => html`
                <div>
                  <dt class="psdk-operator-name" [ngStyle]="{'grid-row-start': i+1}">${field.name}</dt>
                  <dd class="psdk-operator-value" [ngStyle]="{'grid-row-start': i+1}">${field.value}</dd>

                </div>
              `)}
            </dl>
        </div>
        `
         :
         nothing }
    `;  
  }

  render(){
    if (this.bLogging) { console.log(`${this.theComponentName}: render with pConn: ${JSON.stringify(this.pConn)}`); }
    if (this.bDebug){ debugger; }

    // To prevent accumulation (and extra rendering) of previous renders, begin each the render
    //  of any component that's a child of BridgeBase with a call to this.prepareForRender();
    this.prepareForRender();

    // this.addChildTemplates();

    this.renderTemplates.push( this.theRenderedDiv() );

    return this.renderTemplates;

  }

}

export default CaseOperator;