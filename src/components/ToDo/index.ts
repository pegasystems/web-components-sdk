import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BridgeBase } from '../../bridge/BridgeBase';
import { Utils } from '../../helpers/utils';
// NOTE: you need to import ANY component you may render.

// import the component's styles
import { todoStyles } from './todo-styles';

interface ToDoProps {
  // If any, enter additional props that only exist on this component
  datasource?: any;
  headerText?: string;
  myWorkList?: any;
  label?: string;
  readOnly?: boolean;
}

const fetchMyWorkList = (datapage, fields, numberOfRecords, includeTotalCount, context) => {
  return PCore.getDataPageUtils()
    .getDataAsync(
      datapage,
      context,
      {},
      {
        pageNumber: 1,
        pageSize: numberOfRecords
      },
      {
        select: Object.keys(fields).map(key => ({ field: PCore.getAnnotationUtils().getPropertyName(fields[key]) })),
        sortBy: [
          { field: 'pxUrgencyAssign', type: 'DESC' },
          { field: 'pxDeadlineTime', type: 'ASC' },
          { field: 'pxCreateDateTime', type: 'DESC' }
        ]
      },
      {
        invalidateCache: true,
        additionalApiParams: {
          includeTotalCount
        }
      }
    )
    .then(response => {
      return {
        ...response,
        data: (Array.isArray(response?.data) ? response.data : []).map(row =>
          Object.keys(fields).reduce((obj, key) => {
            obj[key] = row[PCore.getAnnotationUtils().getPropertyName(fields[key])];
            return obj;
          }, {})
        )
      };
    });
};

// NOTE: this is just a boilerplate component definition intended
//  to be used as a starting point for any new components as they're built out
@customElement('todo-component')
class ToDo extends BridgeBase {
  @property({ attribute: true }) caseInfoID;
  @property({ attribute: true, type: Object }) datasource;
  @property({ attribute: true }) headerText;
  @property({ attribute: true }) itemKey;
  @property({ attribute: true, type: Boolean }) showTodoList = true;
  @property({ attribute: false }) target;
  @property({ attribute: false }) type = 'worklist';
  @property({ attribute: true }) context;
  @property({ attribute: true, type: Object }) myWorkList;

  @property({ attribute: false, type: Object }) configProps;
  @property({ attribute: false }) currentUser;
  @property({ attribute: false }) currentUserInitials = '--';

  @property({ attribute: false, type: Number }) assignmentCount;

  @property({ attribute: false, type: Array }) arAssignments;

  @property({ attribute: true, type: Object }) assignmentsSource;

  bShowMore = true;
  count;
  localizedVal: Function = () => {};
  localeCategory = 'Todo';
  showlessLocalizedValue = '';
  showMoreLocalizedValue = '';
  constructor() {
    //  Note: BridgeBase constructor has 2 optional args:
    //  1st: inDebug - sets this.bLogging: false if not provided
    //  2nd: inLogging - sets this.bLogging: false if not provided.
    //  To get started, we set both to true here. Set to false if you don't need debugger or logging, respectively.
    super(false, false);
    if (this.bLogging) {
      console.log(`${this.theComponentName}: constructor`);
    }
    if (this.bDebug) {
      debugger;
    }

    // this.pConn = {};
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.bLogging) {
      console.log(`${this.theComponentName}: connectedCallback`);
    }
    if (this.bDebug) {
      debugger;
    }

    // Add this component's styles to the array of templates to render
    this.theComponentStyleTemplate = todoStyles;

    // NOTE: Need to bind the callback to 'this' so it has this element's context when it's called.
    this.registerAndSubscribeComponent(this.onStateChange.bind(this));

    PCore.getPubSubUtils().subscribe(
      PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL,
      () => {
        this.updateToDo();
      },
      'updateToDo'
    );

    this.updateToDo();
  }

  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();
    if (this.bLogging) {
      console.log(`${this.theComponentName}: disconnectedCallback`);
    }
    if (this.bDebug) {
      debugger;
    }

    PCore.getPubSubUtils().unsubscribe(PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL, 'updateToDo');
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

  /**
   * The `onStateChange()` method will be called when the state is updated.
   *  Override this method in each class that extends BridgeBase.
   *  This implementation can be used for common code that should be done for
   *  all components that are derived from BridgeBase
   */
  onStateChange() {
    if (this.bLogging) {
      console.log(`${this.theComponentName}: onStateChange`);
    }
    if (this.bDebug) {
      debugger;
    }

    const bShouldUpdate = super.shouldComponentUpdate();

    if (bShouldUpdate) {
      this.updateSelf();
    }
  }

  updateToDo() {
    if (this.bDebug) {
      debugger;
    }

    this.configProps = this.thePConn.getConfigProps() as ToDoProps;

    if (this.headerText === undefined) {
      this.headerText = this.configProps.headerText;
    }

    if (this.datasource === undefined) {
      this.datasource = this.configProps.datasource;
    }

    if (this.myWorkList === undefined) {
      this.myWorkList = this.configProps.myWorkList;
    }

    this.assignmentsSource = this.datasource?.source || this.myWorkList.source;
    this.localizedVal = PCore.getLocaleUtils().getLocaleValue;
    this.showlessLocalizedValue = this.localizedVal('show_less', 'CosmosFields');
    this.showMoreLocalizedValue = this.localizedVal('show_more', 'CosmosFields');
    if (this.showTodoList) {
      if (this.assignmentsSource) {
        this.count = this.assignmentsSource != null ? this.assignmentsSource.length : 0;
        this.arAssignments = this.topThreeAssignments(this.assignmentsSource);
      } else if (this.myWorkList.datapage) {
        fetchMyWorkList(this.myWorkList.datapage, this.thePConn.getComponentConfig()?.myWorkList.fields, 3, true, this.context).then(responseData => {
          this.deferLoadWorklistItems(responseData);
        });
      } else {
        this.arAssignments = [];
      }
    } else {
      // get caseInfoId assignment.
      // eslint-disable-next-line no-lonely-if
      if (this.caseInfoID != undefined) {
        this.arAssignments = this.getCaseInfoAssignment(this.assignmentsSource, this.caseInfoID);
      }
    }

    this.currentUser = PCore.getEnvironmentInfo().getOperatorName();
    this.currentUserInitials = Utils.getInitials(this.currentUser);
  }

  deferLoadWorklistItems(responseData) {
    this.count = responseData.totalCount;
    this.arAssignments = responseData.data;
  }

  getID(assignment: any) {
    let sID = '';
    if (assignment.value) {
      const refKey = assignment.value;
      sID = refKey.substring(refKey.lastIndexOf(' ') + 1);
    } else {
      const refKey = assignment.ID;
      const arKeys = refKey.split('!')[0].split(' ');

      sID = arKeys[2];
    }

    return sID;
  }

  topThreeAssignments(arList: any[]) {
    const arList3: any[] = new Array<any>();

    if (arList && typeof arList === 'object') {
      let len = arList.length;
      if (len > 3) len = 3;

      for (let i = 0; i < len; i++) {
        arList3.push(arList[i]);
      }
    }

    return arList3;
  }

  getCaseInfoAssignment(arList: any[], caseInfoID: string) {
    const arList1: any[] = new Array<any>();
    // eslint-disable-next-line no-restricted-syntax
    for (const aIndex in arList) {
      if (arList[aIndex].ID.indexOf(caseInfoID) >= 0) {
        const listRow = JSON.parse(JSON.stringify(arList[aIndex]));

        // urgency becomes priority
        if (listRow.urgency) {
          listRow.priority = listRow.urgency;
        }

        if (listRow.ID) {
          // mimic regular list
          listRow.id = listRow.ID;
        }

        arList1.push(listRow);
        break;
      }
    }

    return arList1;
  }

  clickGo(inAssignmentArray: any) {
    if (this.bDebug) {
      debugger;
    }

    // eslint-disable-next-line prefer-const
    let { id, classname = '' } = inAssignmentArray[0];

    const sTarget = this.thePConn.getContainerName();
    const sTargetContainerName = sTarget;

    const options: any = { containerName: sTargetContainerName };

    if (classname == null || classname == '') {
      classname = this.thePConn.getCaseInfo().getClassName();
    }

    if (sTarget === 'workarea') {
      options.isActionFromToDoList = true;
      options.target = '';
      options.context = null;
      options.isChild = undefined;
    } else {
      options.isActionFromToDoList = false;
      options.target = sTarget;
    }

    this.thePConn
      .getActionsApi()
      .openAssignment(id, classname, options)
      .then(() => {
        if (this.bLogging) {
          console.log(`openAssignment completed`);
        }
      })
      .catch(() => {
        return html`<p>Submit failed!</p>`;
      });
  }

  _showMore() {
    this.bShowMore = false;
    const { WORKLIST } = PCore.getConstants();

    if (this.type === WORKLIST && this.count && this.count > this.arAssignments.length && !this.assignmentsSource) {
      fetchMyWorkList(this.myWorkList.datapage, this.thePConn.getComponentConfig()?.myWorkList.fields, this.count, false, this.context).then(
        response => {
          this.arAssignments = response.data;
        }
      );
    } else {
      this.arAssignments = this.assignmentsSource;
    }

    this.requestUpdate();
  }

  _showLess() {
    this.bShowMore = true;
    const { WORKLIST } = PCore.getConstants();

    this.arAssignments = this.type === WORKLIST ? this.arAssignments.slice(0, 3) : this.topThreeAssignments(this.assignmentsSource);
    this.requestUpdate();
  }

  render() {
    if (this.bLogging) {
      console.log(`${this.theComponentName}: render with pConn: ${JSON.stringify(this.pConn)}`);
    }
    if (this.bDebug) {
      debugger;
    }

    // To prevent accumulation (and extra rendering) of previous renders, begin each the render
    //  of any component that's a child of BridgeBase with a call to this.prepareForRender();
    this.prepareForRender();

    // Don't expect ToDo component to have children.
    // this.addChildTemplates();

    const theTemplate = html`
      <div class="psdk-todo">
        <div class="psdk-todo-header">
          ${this.showTodoList ? html`<div class="psdk-avatar">${this.currentUserInitials}</div>` : nothing}
          <div class="psdk-todo-text " id="header-text">${this.headerText}</div>
          ${this.showTodoList ? html`<div class="psdk-assignment-count">${this.count}</div>` : nothing}
        </div>
        <br /><br />
        ${this.showTodoList ? html`<div class="psdk-display-divider"></div>` : nothing}

        <div class="psdk-todo-assignments">
          ${this.arAssignments?.map(
            assignment => html`
              <div class="psdk-todo-assignment">
                <div class="psdk-avatar">${this.currentUserInitials}</div>
                <div class="psdk-todo-card">
                  <div class="psdk-todo-assignment-title">${assignment.stepName}</div>
                  <div class="psdk-todo-assignment-data">
                    <div class="psdk-todo-assignment-task">
                      ${this.localizedVal('Task in', this.localeCategory)}
                      <span
                        class="psdk-todo-id"
                        @click=${() => {
                          this.clickGo([assignment]);
                        }}
                        >${assignment.name} ${this.getID(assignment)}</span
                      >
                      <span *ngIf="assignment.status != undefined">
                        &bull; <span class="psdk-todo-assignment-status">${assignment?.status}</span>
                      </span>
                      &bull; ${this.localizedVal('Urgency', this.localeCategory)} ${assignment?.priority}
                    </div>
                  </div>
                </div>
                <div class="psdk-todo-assignment-action">
                  <button
                    class="btn btn-primary"
                    @click=${() => {
                      this.clickGo([assignment]);
                    }}
                  >
                    ${this.localizedVal('Go', this.localeCategory)}
                  </button>
                </div>
              </div>
              <div class="psdk-display-divider"></div>
            `
          )}
        </div>

        ${this.showTodoList && this.count > 3
          ? html`
              ${this.bShowMore
                ? html`
                    <div class="psdk-todo-show-more">
                      <lion-button btn btn-link @click="${this._showMore}"
                        >${this.showMoreLocalizedValue === 'show_more' ? 'Show more' : this.showMoreLocalizedValue}</lion-button
                      >
                    </div>
                  `
                : html`
                    <div class="psdk-todo-show-more">
                      <lion-button btn btn-link @click="${this._showLess}"
                        >${this.showlessLocalizedValue === 'show_less' ? 'Show less' : this.showlessLocalizedValue}</lion-button
                      >
                    </div>
                  `}
            `
          : html``}
      </div>
    `;

    this.renderTemplates.push(theTemplate);

    return this.renderTemplates;
  }
}

export default ToDo;
