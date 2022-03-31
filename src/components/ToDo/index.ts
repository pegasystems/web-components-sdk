import { html, customElement, property, nothing } from '@lion/core';
import { BridgeBase } from '../../bridge/BridgeBase';
import { Utils } from '../../helpers/utils';
// NOTE: you need to import ANY component you may render.

// import the component's styles
import { todoStyles } from './todo-styles';


// Declare that PCore will be defined when this code is run
declare var PCore: any;


// NOTE: this is just a boilerplate component definition intended
//  to be used as a starting point for any new components as they're built out
@customElement('todo-component')
class ToDo extends BridgeBase {
  @property( {attribute: true} ) caseInfoID;
  @property( {attribute: true, type: Object} ) datasource;
  @property( {attribute: true} ) headerText;
  @property( {attribute: true} ) itemKey;
  @property( {attribute: true, type: Boolean} ) showTodoList = true;
  @property( {attribute: false} ) target;
  @property( {attribute: false} ) type = "worklist";
  @property( {attribute: true} ) context;

  @property( {attribute: false, type: Object} ) configProps;
  @property( {attribute: false} ) currentUser;
  @property( {attribute: false} ) currentUserInitials = "--";

  @property( {attribute: false, type: Number} ) assignmentCount;

  @property( {attribute: false, type: Array}) arAssignments;

  bShowMore: boolean = true;


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

    // Add this component's styles to the array of templates to render
    this.theComponentStyleTemplate = todoStyles;


    //NOTE: Need to bind the callback to 'this' so it has this element's context when it's called.
    this.registerAndSubscribeComponent(this.onStateChange.bind(this));

    PCore.getPubSubUtils().subscribe(
      PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL,
      () => { this.updateToDo() },
      "updateToDo"
    );

    this.updateToDo();
    
  }


  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();
    if (this.bLogging) { console.log(`${this.theComponentName}: disconnectedCallback`); }
    if (this.bDebug){ debugger; }

    PCore.getPubSubUtils().unsubscribe(
      PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL,
      "updateToDo"
    );

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


  updateToDo() {
    if (this.bDebug){ debugger; }

    this.configProps = this.thePConn.getConfigProps();

    if (this.headerText === undefined) {
      this.headerText = this.configProps["headerText"];
    }

    if (this.datasource === undefined) {
      this.datasource = this.configProps["datasource"];
    }

    if (this.showTodoList) {
      if (this.datasource) {
        this.assignmentCount = (this.datasource.source != null) ? this.datasource.source.length : 0;
        this.arAssignments = this.topThreeAssignments(this.datasource.source);
      }
      else {
        // turn off todolist
        this.arAssignments = [];
      }

    }
    else {
      // get caseInfoId assignment.
      if (this.caseInfoID != undefined) {
        this.arAssignments = this.getCaseInfoAssignment(this.datasource.source, this.caseInfoID);
      }

    }
    
    this.currentUser = PCore.getEnvironmentInfo().getOperatorName();
    this.currentUserInitials = Utils.getInitials(this.currentUser);
    
  }

  getID(assignment: any) {
    let sID = "";
    if (assignment.value) {
      let refKey = assignment.value;
      sID = refKey.substring(refKey.lastIndexOf(" ") + 1);
    }
    else {
      let refKey = assignment.ID;
      let arKeys = refKey.split("!")[0].split(" ");

      sID = arKeys[2];
    }

    return sID;

  }

  topThreeAssignments(arList: Array<any>) {
    let arList3: Array<any> = new Array<any>();

    if (arList && typeof(arList) == "object") {
      let len = arList.length;
      if (len > 3) len = 3;
  
      for (let i =0; i < len; i++) {
        arList3.push(arList[i]);
      }
    }


    return arList3;
  }

  getCaseInfoAssignment(arList: Array<any>, caseInfoID: string) {
    let arList1: Array<any> = new Array<any>();
    for ( var aIndex in arList) {
      if (arList[aIndex].ID.indexOf(caseInfoID) >= 0) {

        let listRow = JSON.parse(JSON.stringify(arList[aIndex]));

        // urgency becomes priority
        if (listRow.urgency) {
          listRow["priority"] = listRow.urgency;
        }

        if (listRow.ID) {
          // mimic regular list
          listRow["id"] = listRow["ID"];
        }
        
        arList1.push(listRow);
        break;
      }
    }

    return arList1;
  }



  clickGo(inAssignmentArray: any) {
    if (this.bDebug){ debugger; }

    let { id, classname='' } = inAssignmentArray[0];
    
    let sTarget = this.thePConn.getContainerName();
    let sTargetContainerName = sTarget;

    let options = { "containerName": sTargetContainerName};

    if (classname == null || classname == "") {
      classname = this.thePConn.getCaseInfo().getClassName();
    }

    if (sTarget === "workarea") {
      options["isActionFromToDoList"] = true;
      options["target"] = "";
      options["context"] = null;
      options["isChild"] = undefined;
    }
    else {
      options["isActionFromToDoList"] = false;
      options["target"] = sTarget;
    }

    this.thePConn.getActionsApi().openAssignment(id, classname, options).then(() => {
      if (this.bLogging) { console.log(`openAssignment completed`); }
    });

  }


  _showMore() {
    this.bShowMore = false;

    this.arAssignments = this.datasource.source;
    this.requestUpdate();
  }

  _showLess() {
    this.bShowMore = false;

    this.arAssignments = this.topThreeAssignments(this.datasource.source);
    this.requestUpdate();
  }


  render(){
    if (this.bLogging) { console.log(`${this.theComponentName}: render with pConn: ${JSON.stringify(this.pConn)}`); }
    if (this.bDebug){ debugger; }

    // To prevent accumulation (and extra rendering) of previous renders, begin each the render
    //  of any component that's a child of BridgeBase with a call to this.prepareForRender();
    this.prepareForRender();

    // Don't expect ToDo component to have children.
    // this.addChildTemplates();

    const theTemplate = html`
        <div class="psdk-todo">
          <div class="psdk-todo-header">
              ${ this.showTodoList? html`<div class='psdk-avatar'>${this.currentUserInitials}</div>` : nothing }
              <div class="psdk-todo-text ">${this.headerText}</div>
              ${ this.showTodoList? html`<div class='psdk-assignment-count'>${this.assignmentCount}</div>` : nothing }
          </div>
          <br><br>
          ${ this.showTodoList? html`<div class='psdk-display-divider'></div>` : nothing }
          
          <div class="psdk-todo-assignments">
            ${this.arAssignments.map((assignment) => 
                html`
                  <div class="psdk-todo-assignment">
                      <div class="psdk-avatar">${this.currentUserInitials}</div>
                      <div class="psdk-todo-card">
                          <div class="psdk-todo-assignment-title">${ assignment.stepName }</div>
                          <div class="psdk-todo-assignment-data">
                              <div class="psdk-todo-assignment-task">Task 
                                in <span class="psdk-todo-id" @click=${() => { this.clickGo([assignment]) }}>${ assignment.name } ${this.getID(assignment)}</span>
                                  <span *ngIf="assignment.status != undefined">
                                      &bull; <span class="psdk-todo-assignment-status">${assignment?.status}</span> 
                                  </span>
                                  &bull; Priority ${assignment?.priority}
                              </div>
                          </div>
                      </div>
                      <div class="psdk-todo-assignment-action">
                          <button class="btn btn-primary" @click=${() => { this.clickGo([assignment]) }}>Go</button>
                      </div>
                  </div>
                  <div class="psdk-display-divider"></div>
                `)}
          </div>

          ${ this.showTodoList?
          html`
            ${this.bShowMore ? 
            html`
              <div class="psdk-todo-show-more">
                <lion-button btn btn-link @click="${this._showMore}">Show more</lion-button>
              </div>
            `
            :
            html`
              <div class="psdk-todo-show-more">
                <lion-button btn btn-link @click="${this._showLess}">Show less</lion-button>
              </div>
            `
            }
          `
          :
          html``
          }
          
          

    `;

    this.renderTemplates.push( theTemplate );

    return this.renderTemplates;

  }

}

export default ToDo;