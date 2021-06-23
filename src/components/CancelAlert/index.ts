import { html, customElement, property } from '@lion/core';
import { BridgeBase } from '../../bridge/BridgeBase';
// NOTE: you need to import ANY component you may render.

// import the component's styles as HTML with <style>
import { cancelAlertStyles } from './cancel-alert-styles';


// Declare that PCore will be defined when this code is run
declare var PCore: any;

// NOTE: this is just a boilerplate component definition intended
//  to be used as a starting point for any new components as they're built out
@customElement('cancel-alert-component')
class CancelAlert extends BridgeBase {
  @property( {attribute: true, type: String} ) value = "";

  @property({ attribute: false, type: Boolean}) bShowAlert = false;

  heading: string = "";
  body1: string = "";
  body2: string = "";
  itemKey: string = "";

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
    this.theComponentStyleTemplate = cancelAlertStyles;

    //NOTE: Need to bind the callback to 'this' so it has this element's context when it's called.
    this.registerAndSubscribeComponent(this.onStateChange.bind(this));
    
  }


  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();
    if (this.bLogging) { console.log(`${this.theComponentName}: disconnectedCallback`); }
    if (this.bDebug){ debugger; }

  }

  updated(changedProperties) {
    if (this.bShowAlert) {
      //this.psService.sendMessage(false);

      const contextName = this.thePConn.getContextName();
      const caseInfo = this.thePConn.getCaseInfo();
      const caseName = caseInfo.getName();
      const ID = caseInfo.getID();
  
      this.itemKey = contextName;
      this.heading = "Delete " + caseName + " (" + ID + ")";
      this.body1 = "Are you sure you want to delete " + caseName + " (" + ID + ")?";
      this.body2 = "Alternatively, you can continue working or save your work for later.";

      //this.onAlertState$.emit(true);
      let event = new CustomEvent('AlertState', {
        detail: { data: true }
      });
  
      this.dispatchEvent(event);
  
    }
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

  getCancelAlertHtml() : any {

    const cAHtml = html`
      ${this.bShowAlert ? 
        html`
        <div class="psdk-cancel-alert-background ">
        <div class="psdk-cancel-alert-top">
            ${this.heading != "" ?
            html`<h3>${this.heading}</h3>`
            :
            html``}
            <div>
                <p>${this.body1}</p>
                <p>${this.body2}</p>
            </div>
            <mat-grid-list cols="2" rowHeight="6.25rem">
                <mat-grid-tile>
                  <button  mat-raised-button color="secondary" jsAction="save" @click="${this._buttonClick}" >Save for later</button>
                </mat-grid-tile>
                <mat-grid-tile>
                  <button  mat-raised-button color="secondary" jsAction="continue" @click="${this._buttonClick}" >Continue working</button>
                  <button  mat-raised-button color="primary"  jsAction="delete" @click="${this._buttonClick}" >Delete</button>
                </mat-grid-tile>
            </mat-grid-list>
        </div>`
        :
        html``}
    
`;

    return cAHtml;

  }

  render(){
    if (this.bLogging) { console.log(`${this.theComponentName}: render with pConn: ${JSON.stringify(this.pConn)}`); }
    if (this.bDebug){ debugger; }

    // To prevent accumulation (and extra rendering) of previous renders, begin each the render
    //  of any component that's a child of BridgeBase with a call to this.prepareForRender();
    this.prepareForRender();

    // For test purposes, add some more content to be rendered
    //  This isn't the best way to add inner content. Just here to see that the style's
    //  be loaded and can be applied to some inner content.
    const sampleContent = html`<div class='boilerplate-class'>boilerplate-component: ${this.value}</div>`;
    this.renderTemplates.push( sampleContent );

    this.addChildTemplates();

    return this.renderTemplates;

  }


  dismissAlert() {
    this.bShowAlert = false;

    //this.onAlertState$.emit(false);

    let event = new CustomEvent('AlertState', {
      detail: { data: false }
    });

    this.dispatchEvent(event);

  }

  sendMessage(sMessage: string) {
    //this.snackBarRef = this.snackBar.open(sMessage,"Ok", { duration: 3000});
    //this.erService.sendMessage("show", sMessage);
    alert(sMessage);
  }


  _buttonClick(e: any) {
    let target = e.target;
    this.buttonClick(target.getAttribute("jsAction"))

  }
  
  buttonClick(sAction: string) {

    const actionsAPI = this.thePConn.getActionsApi();

    switch(sAction) {
      case "save":
        // eslint-disable-next-line no-case-declarations
        const savePromise = actionsAPI.saveAndClose(this.itemKey);
        savePromise
          .then(() => {
            // toasterCtx.push({
            //   content: "Successfully saved!"
            // });
            // dismiss();
            this.dismissAlert();
          
            this.sendMessage("Sucessfully saved!");
            //this.erservice.sendMessage("show", "Successfully saved!");
            // let timer = interval(1500).subscribe(() => {
            //   timer.unsubscribe();
            //   this.erservice.sendMessage("show", "Successfully saved!");
            //   });

            PCore.getPubSubUtils().publish(
              PCore.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.CASE_CREATED
            );
          })
          .catch(() => {
            // toasterCtx.push({
            //   content: "Save failed."
            // });
            //this.erservice.sendMessage("show", "Save failed.");
            // let timer = interval(1500).subscribe(() => {
            //   timer.unsubscribe();
            //   this.erservice.sendMessage("show", "Save failed.");
            //   });
            this.sendMessage("Save failed");

          });
        break;
      case "continue" :
        this.dismissAlert();
        break;
      case "delete" :
        // eslint-disable-next-line no-case-declarations
        const deletePromise = actionsAPI.deleteCaseInCreateStage(this.itemKey);

        deletePromise
        .then(() => {
          this.dismissAlert();
          PCore.getPubSubUtils().publish(
            PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL
          );
        })
        .catch(() => {
          // let timer = interval(1500).subscribe(() => {
          //   timer.unsubscribe();
          //   this.erservice.sendMessage("show", "Delete failed.");
          //   });
          this.sendMessage("Delete failed.");
        });
        break;
    }
  }

}

export default CancelAlert;