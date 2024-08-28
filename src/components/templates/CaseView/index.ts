import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BridgeBase } from '../../../bridge/BridgeBase';
import { Utils } from '../../../helpers/utils';

// NOTE: you need to import ANY component you may render.
import '../../Region';
import '../../VerticalTabs';
import '../../Reference';

// import the component's styles as HTML with <style>
import { caseViewStyles } from './case-view-styles';

// NOTE: this is just a boilerplate component definition intended
//  to be used as a starting point for any new components as they're built out
@customElement('case-view')
class CaseView extends BridgeBase {
  @property({ attribute: true, type: Boolean }) displayOnlyFA = false;

  @property({ attribute: false }) heading;
  @property({ attribute: false }) caseClass;
  @property({ attribute: false }) id;
  @property({ attribute: false }) status;
  @property({ attribute: false }) svgCase;
  @property({ attribute: false }) tabData;
  @property({ attribute: false }) mainTabs;
  @property({ attribute: false }) mainTabData;

  arAvailableActions: any[] = [];
  arAvailableProcesses: any[] = [];

  caseTabs: any[] = [];

  elMenu: any = null;

  currentCaseID = '';

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

    this.pConn = {};
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.bLogging) {
      console.log(`${this.theComponentName}: connectedCallback`);
    }
    if (this.bDebug) {
      debugger;
    }

    // setup this component's styling...
    this.theComponentStyleTemplate = caseViewStyles;

    // NOTE: Need to bind the callback to 'this' so it has this element's context when it's called.
    this.registerAndSubscribeComponent(this.onStateChange.bind(this));

    // Initialize this.mainData, tabData,caseTabs etc. on initialization ONLY
    if (!this.displayOnlyFA) {
      for (const child of this.children) {
        const childPConn = child.getPConnect();
        if (childPConn.getRawMetadata().name === 'Tabs') {
          this.mainTabs = child;
          this.mainTabData = this.mainTabs.getPConnect().getChildren();
        }
      }

      this.mainTabs
        .getPConnect()
        .getChildren()
        ?.forEach((child, i) => {
          const config = child.getPConnect().resolveConfigProps(child.getPConnect().getRawMetadata()).config;
          // eslint-disable-next-line prefer-const
          let { label, inheritedProps, visibility } = config;

          if (!label) {
            inheritedProps.forEach(inProp => {
              if (inProp.prop === 'label') {
                label = inProp.value;
              }
            });
          }
          // We'll display the tabs when either visibility property doesn't exist or is true(if exists)
          if (visibility === undefined || visibility === true) {
            this.caseTabs.push({ name: label, id: i });
            // To make first visible tab display at the beginning
            if (!this.tabData) {
              this.tabData = { type: 'DeferLoad', config: child.getPConnect().getRawMetadata().config };
            }
          }
        });
    }
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

    const configProps = this.thePConn.getConfigProps();

    this.heading = configProps.header;
    this.id = configProps.subheader;
    this.status = this.thePConn.getValue('.pyStatusWork');

    this.svgCase = Utils.getImageSrc(configProps.icon, Utils.getSDKStaticContentUrl());

    // if id has changed, mark flow container needs to init container
    if (this.hasCaseIDChanged()) {
      window.sessionStorage.setItem('okToInitFlowContainer', 'true');
    }

    const caseInfo = this.thePConn.getDataObject().caseInfo;
    this.arAvailableActions = caseInfo?.availableActions ? caseInfo.availableActions : [];
    this.arAvailableProcesses = caseInfo?.availableProcesses ? caseInfo.availableProcesses : [];
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

  /**
   *
   * @param inName the metadata <em>name</em> that will cause a region to be returned
   */
  getChildRegionArray(inName: String): Object[] {
    if (this.bDebug) {
      debugger;
    }
    const theRetArray: Object[] = [];
    let iFound = 0;

    // if no children, return theRetArray since nothing will be added...
    if (!this.children) {
      return theRetArray;
    }

    for (const child of this.children) {
      const theMetadataType: string = child.getPConnect().getRawMetadata().type.toLowerCase();

      // Addition of Reference component results in 2 possible components to render...
      if (theMetadataType === 'region') {
        // If the type is a Reference, there will not be a 'name'
        const theMetadataName: string = child.getPConnect().getRawMetadata().name.toLowerCase();

        if (theMetadataName === inName) {
          iFound++;
          theRetArray.push(html`<region-component .pConn=${child.getPConnect()}></region-component>`);
        }
      } else if (theMetadataType === 'reference') {
        theRetArray.push(html`<reference-component .pConn=${child.getPConnect()}></reference-component>`);
      } else {
        console.error(`${this.theComponentName}: getChildRegionArray got unexpected: ${theMetadataType}`);
      }
    }

    if (this.bLogging) {
      console.log(`${this.theComponentName}: getChildRegionArray - looking for ${inName} found: ${iFound}`);
    }
    return theRetArray;
  }

  getActionButtonMenuHtml(availableActions: any[], availableProcesses: any[]) {
    const arButtonMenuHtml: any[] = [];

    for (const actionMenu of availableActions) {
      arButtonMenuHtml.push(html`
        <a
          @click=${() => {
            this._actionMenuActionsClick(actionMenu);
          }}
        >
          ${actionMenu.name}</a
        >
      `);
    }

    for (const actionMenu of availableProcesses) {
      arButtonMenuHtml.push(html`
        <a
          @click=${() => {
            this._actionMenuProcessesClick(actionMenu);
          }}
        >
          ${actionMenu.name}</a
        >
      `);
    }
    return arButtonMenuHtml;
  }

  getActionButtonsHtml(): any {
    return html`
      <div class="psdk-case-view-buttons">
        <lion-button class="btn btn-light" color="secondary" @click=${this._editClick}>Edit</lion-button>
        <lion-button class="btn btn-light" color="secondary" @click=${this._showActionMenu}>Actions...</lion-button>
        <div id="actionMenu" class="psdk-action-menu-content">
          ${this.getActionButtonMenuHtml(this.arAvailableActions, this.arAvailableProcesses)}
        </div>
      </div>
    `;
  }

  hasCaseIDChanged(): boolean {
    if (this.currentCaseID !== this.thePConn.getDataObject().caseInfo.ID) {
      this.currentCaseID = this.thePConn.getDataObject().caseInfo.ID;
      return true;
    }
    return false;
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
    this.prepareForRender(this.displayOnlyFA);

    const theContent = html`
      <div class="psdk-case-view" id="case-view">
        ${this.displayOnlyFA
          ? nothing
          : html`
              <div class="psdk-case-view-info">
                <div class="psdk-case-view-toolbar">
                  <div class="psdk-case-icon-div">
                    <img class="psdk-case-svg-icon" src="${this.svgCase}" />
                  </div>
                  <div class="psdk-case-view-heading">
                    <div id="current-caseID" hidden>${this.currentCaseID}</div>
                    <div class="psdk-case-view-heading-id" id="caseId">${this.id}</div>
                    <div class="psdk-case-view-heading-h1">${this.heading}</div>
                  </div>
                </div>

                ${this.getActionButtonsHtml()}

                <div class="psdk-case-view-divider"></div>

                <div class="psdk-case-view-summary">${this.getChildRegionArray('summary')}</div>

                ${this.caseTabs.length > 1
                  ? html`
                      <div>
                        <vertical-tabs-component .tabConfig=${this.caseTabs} @VerticalTabClick="${this._vTabClick}"></vertical-tabs-component>
                      </div>
                    `
                  : html``}
              </div>
            `}

        <div class="psdk-case-view-main">
          ${this.displayOnlyFA ? nothing : html` ${this.getChildRegionArray('stages')} `} ${this.getChildRegionArray('todo')}
          ${this.getChildRegionArray('main')}
          ${this.tabData && !this.displayOnlyFA
            ? html`
                <defer-load-component .pConn=${this.thePConn} .loadData=${this.tabData} .name=${this.tabData?.config?.name}></defer-load-component>
              `
            : nothing}
        </div>

        ${this.displayOnlyFA ? nothing : html` <div class="psdk-case-view-utilities">${this.getChildRegionArray('utilities')}</div> `}
      </div>
    `;

    this.renderTemplates.push(theContent);

    return this.renderTemplates;
  }

  _vTabClick(e: any) {
    const tabId = e.detail.data.tabId;

    this.tabData = this.mainTabData[tabId].getPConnect().getRawMetadata();

    this.requestUpdate();
  }

  _editClick() {
    const editAction = this.arAvailableActions.find(action => action.ID === 'pyUpdateCaseDetails');
    const actionsAPI = this.thePConn.getActionsApi();
    const openLocalAction = actionsAPI.openLocalAction.bind(actionsAPI);

    openLocalAction(editAction.ID, { ...editAction });
  }

  _actionMenuActionsClick(data) {
    const actionsAPI = this.thePConn.getActionsApi();
    const openLocalAction = actionsAPI.openLocalAction.bind(actionsAPI);

    openLocalAction(data.ID, { ...data });
  }

  _actionMenuProcessesClick(data) {
    const actionsAPI = this.thePConn.getActionsApi();
    const openProcessAction = actionsAPI.openProcessAction.bind(actionsAPI);

    openProcessAction(data.ID, { ...data });
  }

  _showActionMenu(event: any) {
    let el = event.target;
    while (el != null && el.className != 'psdk-case-view-buttons') {
      el = el.parentElement;
    }

    if (this.elMenu != null) {
      // one is already up, toggle that one first
      this.toggleActionMenu(this.elMenu);
    }

    this.toggleActionMenu(el);

    // add clickAway listener
    window.addEventListener('mouseup', this._clickAway.bind(this));
  }

  toggleActionMenu(el: any) {
    if (el != null) {
      this.elMenu = el;
      const actionMenu = el.getElementsByClassName('psdk-action-menu-content')[0];
      if (actionMenu != null) {
        actionMenu.classList.toggle('show');
      }
    }
  }

  _clickAway(event: any) {
    let bInMenu = false;

    // run through list of elements in path, if menu not in th path, then want to
    // hide (toggle) the menu
    // eslint-disable-next-line no-restricted-syntax
    for (const i in event.path) {
      if (event.path[i].className == 'psdk-utility-menu') {
        bInMenu = true;
        break;
      }
    }
    // eslint-disable-next-line sonarjs/no-collapsible-if
    if (!bInMenu) {
      if (this.elMenu != null) {
        this.toggleActionMenu(this.elMenu);
        this.elMenu = null;

        window.removeEventListener('mouseup', this._clickAway.bind(this));
      }
    }
  }

  // editClick() {
  //   // eslint-disable-next-line no-debugger
  //   debugger;
  // }

  // actionsClick() {
  //   // eslint-disable-next-line no-debugger
  //   debugger;

  // }
}

export default CaseView;
