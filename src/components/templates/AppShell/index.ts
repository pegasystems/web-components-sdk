import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BridgeBase } from '../../../bridge/BridgeBase';
// NOTE: you need to import ANY component you may render.
import '../../NavBar';

// import the component's styles as HTML with <style>
import { appShellStyles } from './appshell-styles';

// Declare that PCore will be defined when this code is run
declare let PCore: any;

// NOTE: this is just a boilerplate component definition intended
//  to be used as a starting point for any new components as they're built out
@customElement('app-shell')
class AppShell extends BridgeBase {
  @property({ attribute: false, type: Object }) configProps;
  @property({ attribute: false, type: Object }) pages;
  @property({ attribute: false, type: Object }) caseTypes;
  @property({ attribute: false, type: Boolean }) bShowAppShell = false;
  @property({ type: String }) appName;

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
    this.appName = PCore.getEnvironmentInfo().getApplicationName();
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
    this.theComponentStyleTemplate = appShellStyles;

    // NOTE: Need to bind the callback to 'this' so it has this element's context when it's called.
    this.registerAndSubscribeComponent(this.onStateChange.bind(this));

    this.configProps = this.thePConn.getConfigProps();
    this.pages = this.configProps.pages;

    if (this.pages) {
      this.bShowAppShell = true;
    }

    const caseTypesAvailableToCreateDP = PCore.getEnvironmentInfo().environmentInfoObject?.pxApplication?.pyCaseTypesAvailableToCreateDP;
    if (caseTypesAvailableToCreateDP) {
      const portalID = this.pConn.getPConnect().getValue('.pyOwner');
      PCore.getDataPageUtils()
        .getPageDataAsync(caseTypesAvailableToCreateDP, this.pConn.getPConnect().getContextName(), {
          PortalName: portalID
        })
        .then(response => {
          if (response?.pyCaseTypesAvailableToCreate) {
            this.pConn.getPConnect().replaceState('.pyCaseTypesAvailableToCreate', response.pyCaseTypesAvailableToCreate, {
              skipDirtyValidation: true
            });
          }
        });
    }

    this.caseTypes = this.configProps.caseTypes;
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

    this.configProps = this.thePConn.resolveConfigProps(this.thePConn.getConfigProps());

    this.pages = this.configProps.pages;

    if (this.pages) {
      this.bShowAppShell = true;
    }

    this.caseTypes = this.configProps.caseTypes;
    this.children = this.thePConn.getChildren();
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

    // NOTE: Children are processed inside theTemplate

    const theTemplate = this.bShowAppShell
      ? html`
          <div class="appshell-top">
            <nav-bar .pConn=${this.thePConn} appName=${this.appName} .pages=${this.pages} .caseTypes=${this.caseTypes}></nav-bar>
            <div class="appshell-main">${this.thePConn.getChildren().map(child => html`<view-container .pConn=${child}></view-container>`)}</div>
          </div>
        `
      : nothing;

    this.renderTemplates.push(theTemplate);

    return this.renderTemplates;
  }
}

export default AppShell;
