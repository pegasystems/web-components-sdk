import { html, customElement, property } from '@lion/core';
import { BridgeBase } from '../../bridge/BridgeBase';
// NOTE: you need to import ANY component you may render.

// import the component's styles as HTML with <style>
import { assignmentStyles } from './assignment-styles';

import '../MultiStep';
import '../AssignmentCard';
import 'lit-toast/lit-toast';


// Declare that PCore will be defined when this code is run
declare var PCore: any;


@customElement('assignment-component')
class Assignment extends BridgeBase {

  @property( {attribute: true} ) itemKey = "";
  @property( {attribute: false, type: Array} ) arChildren : Array<any> = [];
  @property( {attribute: false, type: Boolean}) bHasNavigation = false;
  @property( {attribute: false, type: Boolean}) bIsVertical = false;
  // navigation
  
  arCurrentStepIndicies: Array<number> = new Array();
  arNavigationSteps: Array<any> = new Array();


  // buttons
  arMainButtons: Array<any> = new Array();
  arSecondaryButtons: Array<any> = new Array();


  bReInit:boolean = false;

  bInit: boolean = false;
  actionsAPI: any;
  finishAssignment: any;
  navigateToStep: any;
  cancelAssignment: any;
  showPage: any;
  bCancelPressed: boolean = false;

  configProps: Object = {};


  containerName: string = "";
  workID: string = "";
  currentCaseID: string = "";


  templateName: string = "";


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
    this.theComponentStyleTemplate = assignmentStyles;

    //NOTE: Need to bind the callback to 'this' so it has this element's context when it's called.
    this.registerAndSubscribeComponent(this.onStateChange.bind(this));

    this.initComponent();
    
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

    this.requestUpdate();

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

  assignmentHtml(): any {

    const aHtml = html`
        ${this.bHasNavigation?
          html`
            <div class="psdk-stepper">
            <multi-step-component .pConn=${this.pConn} .arChildren=${this.arChildren} itemKey=${this.itemKey}
                .arMainButtons=${this.arMainButtons} .arSecondaryButtons=${this.arSecondaryButtons}
                .bIsVertical=${this.bIsVertical} .arCurrentStepIndicies=${this.arCurrentStepIndicies}
                .arNavigationSteps=${this.arNavigationSteps}
                @MultiStepActionButtonClick="${this._onActionButtonClick}">
            </multi-step-component>
            <lit-toast></lit-toast>
            </div>` 
            :
          html`
            <div>
                <assignment-card-component .pConn=${this.pConn} .arChildren=${this.arChildren} itemKey=${this.itemKey}
                  .arMainButtons=${this.arMainButtons} .arSecondaryButtons=${this.arSecondaryButtons}
                  @AssignmentActionButtonClick="${this._onActionButtonClick}">
                </assignment-card-component>
                <lit-toast></lit-toast>
            </div>`}
    `;

    return aHtml;

  }



  render(){
    if (this.bLogging) { console.log(`${this.theComponentName}: render with pConn: ${JSON.stringify(this.pConn)}`); }
    if (this.bDebug){ debugger; }

    this.createButtons();

    // To prevent accumulation (and extra rendering) of previous renders, begin each the render
    //  of any component that's a child of BridgeBase with a call to this.prepareForRender();
    this.prepareForRender();

    // For test purposes, add some more content to be rendered
    //  This isn't the best way to add inner content. Just here to see that the style's
    //  be loaded and can be applied to some inner content.
    // const sampleContent = html`<div class='boilerplate-class'>Generic boilerplate text.</div>`;
    // this.renderTemplates.push( sampleContent );

    // this.addChildTemplates();

    const sContent = html`${this.assignmentHtml()}`;

    this.renderTemplates.push( sContent );

    return this.renderTemplates;

  }


  initComponent() {


    // prevent re-intializing with flowContainer update unless an action is taken
    this.bReInit = false;
    this.bHasNavigation = false;


    this.configProps = this.thePConn.resolveConfigProps(this.thePConn.getConfigProps());

    // when true, update arChildren from pConn, otherwise, arChilren will be updated in updateSelf()

   
    

    let activeActionLabel: string = "";
    //let { getPConnect } = this.arChildren[0].getPConnect();
    //let { getPConnect } = this.arChildren[0].getPConnect();

    this.templateName = this.configProps["template"];
    
    // create pointers to functions
    let containerMgr = this.thePConn.getContainerManager();
    let actionsAPI = this.thePConn.getActionsApi();
    let baseContext = this.thePConn.getContextName();
    let acName = this.thePConn.getContainerName();

    // for now, in general this should be overridden by updateSelf(), and not be blank
    if (this.itemKey === "") {
      this.itemKey = baseContext.concat("/").concat(acName);
    }
    

    this.thePConn.isBoundToState();

    this.bInit = false;

    // store off bound functions to above pointers
    this.finishAssignment = actionsAPI.finishAssignment.bind(actionsAPI);
    this.navigateToStep = actionsAPI.navigateToStep.bind(actionsAPI);
    this.cancelAssignment = actionsAPI.cancelAssignment.bind(actionsAPI);
    this.showPage = actionsAPI.showPage.bind(actionsAPI);


    this.createButtons();


    

  }

  createButtons() {

    this.bHasNavigation = false;

    let oData = this.thePConn.getDataObject();

    // inside
    // get fist kid, get the name and displa
    // pass first kid to a view container, which will disperse it to a view which will use one column, two column, etc.
    let oWorkItem = this.arChildren[0].getPConnect();
    let oWorkMeta = oWorkItem.getRawMetadata();
    let oWorkData = oWorkItem.getDataObject();

    if (oWorkData) {

      this.actionsAPI = oWorkItem.getActionsApi();
  
      this.containerName = oWorkData.caseInfo.assignments[0].name;
  
      // get caseInfo
      let oCaseInfo = oData.caseInfo;
  
      if (oCaseInfo && oCaseInfo.actionButtons) {
  
        if (this.bLogging) { console.log("assignment container buttons"); }
  
        this.arMainButtons = oCaseInfo.actionButtons.main;
        this.arSecondaryButtons = oCaseInfo.actionButtons.secondary;
  
      }
  
      if (oCaseInfo.navigation != null) {
  
        this.bHasNavigation = true;
  
        if (oCaseInfo.navigation.template && oCaseInfo.navigation.template.toLowerCase() === "standard") {
          this.bHasNavigation = false;
        }
        else if (oCaseInfo.navigation.template && oCaseInfo.navigation.template.toLowerCase() === "vertical") {
          this.bIsVertical = true;
        }
        else {
          this.bIsVertical = false;
        }
  
  
        // iterate through steps to find current one(s)
        // immutable, so we want to change the local copy, so need to make a copy
  
  
        // what comes back now in configObject is the children of the flowContainer
        this.arNavigationSteps = JSON.parse(JSON.stringify(oCaseInfo.navigation.steps));
        this.arCurrentStepIndicies = new Array();
        this.arCurrentStepIndicies = this.findCurrentIndicies(this.arNavigationSteps, this.arCurrentStepIndicies, 0);
  
  
  
  
      }

    }

 
  }


  findCurrentIndicies(arStepperSteps: Array<any>, arIndicies: Array<number>, depth: number) : Array<number> {

    let count = 0;
    arStepperSteps.forEach( (step) => {
      if (step.visited_status == "current") {
        arIndicies[depth] = count;

        // add in
        step["step_status"] = "";
      }
      else if (step.visited_status == "success") {
        count++
        step.step_status = "completed"
      }
      else {
        count++;
        step.step_status = "";
      }

      if (step.steps) {
        arIndicies = this.findCurrentIndicies(step.steps, arIndicies, depth + 1)
      }
    });

    return arIndicies;
  }



  _onActionButtonClick(e: any) {
    this.buttonClick(e.detail.data.action, e.detail.data.buttonType);
  }
  
  buttonClick(sAction: string, sButtonType: string) {

    
    // right now, done on an individual basis, setting bReInit to true
    // upon the next flow container state change, will cause the flow container
    // to re-initialize
    // this.bReInit =true;


    let baseContext = this.thePConn.getContextName();
    let acName = this.thePConn.getContainerName();
    let itemID = baseContext.concat("/").concat(acName);


    if (sButtonType == "secondary") {
      let dispatchInfo = {
        context: this.itemKey,
        semanticURL: ""
      };

      let stepID = ""; // ???

      // need to handle cancel as this.cancel(dispatchInfo)
      //this.actionsAPI[sAction](dispatchInfo);
      switch (sAction) {
        case "navigateToStep" :
          if (this.formValid()) {
            this.bReInit =true;

            //this.psService.sendMessage(true);
            let navigatePromise = this.navigateToStep( "previous", this.itemKey );
          
            navigatePromise
              .then(() => {
                //this.psService.sendMessage(false);
              })
              .catch(() => {
                this.showToast( `Navigation failed!`, 3000);
                //this.psService.sendMessage(false);
              });

          }
          break;
        case "cancelAssignment":
          this.bReInit =true;
          this.bCancelPressed = true;
          //this.psService.sendMessage(true);

          // eslint-disable-next-line no-case-declarations
          let cancelPromise = this.cancelAssignment(dispatchInfo.context);

          cancelPromise
            .then(() => {
              //this.psService.sendMessage(false);
              //this.rpcService.sendMessage(true, "cancel");

              PCore.getPubSubUtils().publish(
                PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL);
              })
            .catch(() => {
              this.showToast( `Cancel failed!`, 3000);
              //this.psService.sendMessage(false);
             });

          break;
        default: 
          break;
      }
      

    }
    else if (sButtonType == "primary") {

      if (this.bLogging) { console.log("press submit"); }

      switch (sAction) {
        case "finishAssignment" :
          if (this.formValid()) {
            this.bReInit =true;
            
            //this.psService.sendMessage(true);
            let finishPromise = this.finishAssignment(this.itemKey);

            finishPromise
              .then(() => {
                //this.psService.sendMessage(false);
              })
              .catch(() => {
                this.showToast( `Submit failed!`, 3000);
                //this.psService.sendMessage(false);
              });
          }
          else {

            //let snackBarRef = this.snackBar.open("Please fix errors on form.",  "Ok");
            //this.erService.sendMessage("show", "Please fix errors on form.");

          }
          break;
        default: 
          break;
      }

    }


  }


  formValid() : boolean {
    return true;
  }

  showToast(message: String, duration: Number) {
    console.error(`${this.theComponentName}: ${message}`);
    const theToast : any = this.shadowRoot?.querySelector('lit-toast');
    if (theToast) {
      theToast.show(message, duration);
    }
  }

}







export default Assignment;