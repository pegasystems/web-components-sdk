import { html, customElement, property, nothing } from '@lion/core';
import { BridgeBase } from '../../bridge/BridgeBase';
import { Utils } from '../../helpers/utils';
import { addContainerItem, getToDoAssignments } from './helpers';
import '../Assignment';
import '../ToDo';

// NOTE: you need to import ANY component you may render.

// import the component's styles as HTML with <style>
import { flowContainerStyles } from './flow-container-styles';


// Declare that PCore will be defined when this code is run
declare var PCore: any;

//
// WARNING:  It is not expected that this file should be modified.  It is part of infrastructure code that works with 
// Redux and creation/update of Redux containers and PConnect.  Modifying this code could have undesireable results and
// is totally at your own risk.
//

@customElement('flow-container')
class FlowContainer extends BridgeBase {


  buildName: string= "";
  containerName: string = "";
  instructionText: string = "";
  itemKey: string = "";
  configProps : Object = {};

  arNewChildren: Array<any> = [];

  //todo

  @property( {attribute: false, type: Boolean} ) todo_showTodo = false;
  @property( {attribute: false} ) todo_caseInfoID = "";
  @property( {attribute: false, type: Boolean} ) todo_showTodoList = false;
  @property( {attribute: false, type: Object} ) todo_datasource;
  @property( {attribute: false} ) todo_headerText = "To do";
  @property( {attribute: false} ) todo_type = "";
  @property( {attribute: false} ) todo_context = "";

  // messages
  caseMessages: string = "";
  bHasCaseMessages: boolean = false;
  checkSvg: string = "";

  svgCurrent: string = "";
  svgNotCurrent: string = "";

  newConfig: Object = {};


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
    super.connectedCallback()
    if (this.bLogging) { console.log(`${this.theComponentName}: connectedCallback`); }
    if (this.bDebug){ debugger; }

    // setup this component's styling...
    this.theComponentStyleTemplate = flowContainerStyles;

    //NOTE: Need to bind the callback to 'this' so it has this element's context when it's called.
    this.registerAndSubscribeComponent(this.onStateChange.bind(this));

    //with init, force children to be loaded of global pConn
    this.initComponent(true);

    // do init/add containers
    this.initContainer();
    
  }


  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();
    if (this.bLogging) { console.log(`${this.theComponentName}: disconnectedCallback`); }
    if (this.bDebug){ debugger; }

  }


  getBuildName(): string {
  
    // let { getPConnect, name } = this.pConn$.pConn;
    let context = this.thePConn.getContextName();
    let viewContainerName = this.thePConn.getContainerName();

    if (!viewContainerName) viewContainerName = "";
    return `${context.toUpperCase()}/${viewContainerName.toUpperCase()}`;
  }

  initContainer() {
    let containerMgr = this.thePConn.getContainerManager();
    let baseContext = this.thePConn.getContextName();
    const containerName = this.thePConn.getContainerName();
    const containerType = "single";

    const flowContainerTarget = `${baseContext}/${containerName}`;
    const isContainerItemAvailable = PCore.getContainerUtils().getActiveContainerItemName(
      flowContainerTarget
    );

    window.sessionStorage.setItem("okToInitFlowContainer", "false");

    if (!isContainerItemAvailable) {
      containerMgr.initializeContainers({
        type: containerType
      });

      // updated for 8.7 - 31-Mar-2022
      addContainerItem(this.thePConn);

    }
  }


  hasAssignments() {

    let hasAssignments = false;
    const assignmentsList = this.thePConn.getValue("caseInfo.assignments");
    const thisOperator = PCore.getEnvironmentInfo().getOperatorIdentifier();
    // 8.7 includes assignments in Assignments List that may be assigned to
    //  a different operator. So, see if there are any assignments for
    //  the current operator
    let bAssignmentsForThisOperator = false;

    // Bail if there is no assignmentsList
    if (!assignmentsList) {
      return hasAssignments;
    }

    for (const assignment of assignmentsList) {
      if (assignment["assigneeInfo"]["ID"] === thisOperator) {
        bAssignmentsForThisOperator = true;
      }
    }

    const hasChildCaseAssignments = this.hasChildCaseAssignments();

    if (
      bAssignmentsForThisOperator ||
      hasChildCaseAssignments ||
      this.isCaseWideLocalAction()
    ) {
      hasAssignments = true;
    }

    return hasAssignments;
  }

  isCaseWideLocalAction() {
    const actionID = this.thePConn.getValue("caseInfo.activeActionID");
    const caseActions = this.thePConn.getValue("caseInfo.availableActions");
    let bCaseWideAction = false;
    if (caseActions && actionID) {
      const actionObj = caseActions.find(
        (caseAction) => caseAction.ID === actionID
      );
      if (actionObj) {
        bCaseWideAction = actionObj.type === "Case";
      }
    }
    return bCaseWideAction;
  }

  hasChildCaseAssignments() {

    const childCases = this.thePConn.getValue("caseInfo.childCases");
    let allAssignments = [];
    if (childCases && childCases.length > 0) {
      return true;
    }
    return false;
  }

 

  getActiveViewLabel() {
    let activeActionLabel = "";


    const { CASE_INFO: CASE_CONSTS, CONTAINER_TYPE } = PCore.getConstants();

    const caseActions = this.thePConn.getValue(CASE_CONSTS.CASE_INFO_ACTIONS);
    const activeActionID = this.thePConn.getValue(CASE_CONSTS.ACTIVE_ACTION_ID);
    const activeAction = caseActions.find(
      (action) => action.ID === activeActionID
    );
    if (activeAction) {
      activeActionLabel = activeAction.name;
    }
    return activeActionLabel;
  }
  
  /**
   * updateSelf
   */
  updateSelf() {
    if (this.bLogging) { console.log(`${this.theComponentName}: updateSelf`); }
    if (this.bDebug){ debugger; }

    let { getPConnect } = this.arNewChildren[0].getPConnect();
    let localPConn = this.arNewChildren[0].getPConnect();

    this.buildName = this.getBuildName();

    // routingInfo was added as component prop in populateAdditionalProps
    let routingInfo = this.getComponentProp("routingInfo");

    let loadingInfo: any;
    try {
      loadingInfo = this.thePConn.getLoadingStatus();
    } 
    catch (ex) {
      console.error(`${this.theComponentName}: loadingInfo catch block`);
    }


    let configProps = this.thePConn.resolveConfigProps(this.thePConn.getConfigProps());


    if (!loadingInfo) {
      // turn off spinner
      //this.psService.sendMessage(false);
    }

    const caseViewMode = this.thePConn.getValue("context_data.caseViewMode");

    const { CASE_INFO: CASE_CONSTS, CONTAINER_TYPE } = PCore.getConstants();

    
    if (caseViewMode && caseViewMode == "review") {

        // updated for 8.7 - 30-Mar-2022
        const todoAssignments = getToDoAssignments(this.thePConn);

        if (todoAssignments && todoAssignments.length > 0) {
          this.todo_caseInfoID = this.thePConn.getValue(CASE_CONSTS.CASE_INFO_ID);
          this.todo_datasource = { source: todoAssignments };
        }

        this.todo_showTodo = true;
        this.todo_showTodoList = false;



      // in React, when cancel is called, somehow the constructor for flowContainer is called which
      // does init/add of containers.  This mimics that
      this.initContainer();

     }
     else if (caseViewMode && caseViewMode == "perform") {
      // perform
      this.todo_showTodo = false; 

      // this is different than Angular SDK, as we need to initContainer if root container reloaded
      if (window.sessionStorage.getItem("okToInitFlowContainer") == "true") {
          this.initContainer();
      }
    }

    // if have caseMessage show message and end
    this.caseMessages = this.thePConn.getValue("caseMessages");

    if (this.caseMessages || !this.hasAssignments()) {
      this.bHasCaseMessages = true;

      // Temp fix for 8.7 change: confirmationNote no longer coming through in caseMessages$.
      // So, if we get here and caseMessages$ is empty, use default value in DX API response
       if (!this.caseMessages) {
        if(PCore.getEnvironmentInfo().getApplicationLabel() === 'UplusAuto'){
          console.log('in flowcontainer if uplus');
          this.caseMessages = "Congratulations! Your appointment has been scheduled";
        }else{
          this.caseMessages = "Thank you! The next step in this case has been routed appropriately.";
          console.log('in flowcontainer else no uplus');
        }
      }


      // publish this "assignmentFinished" for mashup, need to get approved as a standard
      PCore.getPubSubUtils().publish(
        "assignmentFinished");

      
      this.checkSvg = Utils.getImageSrc("check", Utils.getSDKStaticContentUrl());
      return;
    }
    else {
      this.bHasCaseMessages = false;
    }


    // this check in routingInfo, mimic React to check and get the internals of the 
    // flowContainer and force updates to pConnect/redux
    if (routingInfo && loadingInfo != undefined) {

      if (this.bLogging) { console.log(`${this.theComponentName}: >>routingInfo: JSON.stringify(routingInfo)` ); }

      let currentOrder = routingInfo.accessedOrder;
      let currentItems = routingInfo.items;
      let type = routingInfo.type;
      if (currentOrder && currentItems) {       // JA - making more similar to React version
        let key = currentOrder[currentOrder.length - 1];

        // save off itemKey to be used for finishAssignment, etc.
        this.itemKey = key;     

        if (currentOrder.length > 0) {

          if (currentItems[key] &&
              currentItems[key].view &&
              type === "single" &&
              Object.keys(currentItems[key].view).length > 0 ) {
                let currentItem = currentItems[key];
                let rootView = currentItem.view;
                let { context } = rootView.config;
                let config = { meta: rootView };

                config["options"] = {
                  context: currentItem.context,
                  pageReference: context || localPConn.getPageReference(),
                  hasForm: true,
                  isFlowContainer: true,
                  containerName: localPConn.getContainerName(),
                  containerItemName: key,
                  parentPageReference: localPConn.getPageReference()
                };

                let configObject = PCore.createPConnect(config);
              
                // keep track of these changes
                this.arNewChildren = new Array();
                this.arNewChildren.push(configObject);

                let oWorkItem = this.arNewChildren[0].getPConnect();
                let oWorkData = oWorkItem.getDataObject();
            
            
                // check if have oWorkData, there are times due to timing of state change, when this 
                // may not be available
                if (oWorkData) { 
                  this.containerName = this.getActiveViewLabel() || oWorkData.caseInfo.assignments[0].name;
                  this.instructionText = oWorkData.caseInfo.assignments[0].instructions;
                }

                //this.render();
          }
        }
      }

    }

     this.requestUpdate();

  


  }


  initComponent( bLoadChildren: boolean) {


    this.configProps = this.thePConn.resolveConfigProps(this.thePConn.getConfigProps());

    // when true, update arChildren from pConn, otherwise, arChilren will be updated in updateSelf()
    if (bLoadChildren) {
      this.arNewChildren = this.thePConn.getChildren();
    }
   

    if (this.bLogging) { console.log(`${this.theComponentName}: children update for main draw`); }

    let oData = this.thePConn.getDataObject();

    let activeActionLabel: string = "";
    let { getPConnect } = this.arNewChildren[0].getPConnect();

    // this.templateName$ = this.configProps$["template"];

    this.todo_showTodo = this.getTodoVisibilty();
    
    // create pointers to functions
    let containerMgr = this.thePConn.getContainerManager();
    let actionsAPI = this.thePConn.getActionsApi();
    let baseContext = this.thePConn.getContextName();
    let acName = this.thePConn.getContainerName();

    //for now, in general this should be overridden by updateSelf(), and not be blank
    if (this.itemKey === "") {
      this.itemKey= baseContext.concat("/").concat(acName);
    }
    

    this.thePConn.isBoundToState();


    // inside
    // get fist kid, get the name and displa
    // pass first kid to a view container, which will disperse it to a view which will use one column, two column, etc.
    let oWorkItem = this.arNewChildren[0].getPConnect();
    let oWorkData = oWorkItem.getDataObject();

    if (bLoadChildren && oWorkData) { 
      this.containerName = oWorkData.caseInfo.assignments?.[0].name;
      this.instructionText = oWorkData.caseInfo.assignments?.[0].instructions;
    }
  

    this.buildName = this.getBuildName();

  
  }  

  getTodoVisibilty() {
    const caseViewMode = this.thePConn.getValue("context_data.caseViewMode");
    if (caseViewMode && caseViewMode === "review") {
      return true;
    }
    if (caseViewMode && caseViewMode === "perform") {
      return false;
    }

    return true;
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


  flowContainerHtml(): any {

    const fCHtml = html`
    <div style="text-align: left;" id="${this.buildName}" class="psdk-flow-container-top">

    ${!this.bHasCaseMessages? 
      html`
      </div>
        ${!this.todo_showTodo?
          html`
          <h4>${this.containerName}</h4>
          ${(this.instructionText !== "") ? html`<div class="psdk-instruction-text">${this.instructionText}</div>` : nothing }
          <div style="margin-top: 2rem">
            <assignment-component .pConn=${this.thePConn} .arChildren=${this.arNewChildren} itemKey=${this.itemKey}></assignment-component>
          </div>
          `
          :
          html`
          <div>
           <todo-component .pConn=${this.thePConn} caseInfoID=${this.todo_caseInfoID} .datasource=${this.todo_datasource}
              .showTodoList=${this.todo_showTodoList} headerText=${this.todo_headerText} type=${this.todo_type} 
              context=${this.todo_context} itemKey=${this.itemKey}></todo-component>
          </div>
          `
        }
      <div>
        ` 
        :
      html`
        <div class="psdk-message-card">
        <div style="display: flex; flex-direction: row;">
          <!-- <div><img  class="psdk-icon" src="${this.checkSvg}" ></div> --> 
          <div class="psdk-message">Congratulations! Your appointment has been scheduled</div>
        </div>
    
      </div>
      `}
    </div>`;

    return fCHtml;

  }

  render(){
    if (this.bLogging) { console.log(`${this.theComponentName}: render with pConn: ${JSON.stringify(this.pConn)}`); }
    if (this.bDebug){ debugger; }


    // To prevent accumulation (and extra rendering) of previous renders, begin each the render
    //  of any component that's a child of BridgeBase with a call to this.prepareForRender();
    this.prepareForRender();

  
    const sContent = html`${this.flowContainerHtml()}`;

    this.renderTemplates.push( sContent );


    return this.renderTemplates;

  }

}

export default FlowContainer;