import { html, customElement, property } from '@lion/core';
import { BridgeBase } from '../../../bridge/BridgeBase';
// NOTE: you need to import ANY component you may render.

// import the component's styles
import { appAnnouncementStyles } from './app-announcement-styles';

// NOTE: this is just a boilerplate component definition intended
//  to be used as a starting point for any new components as they're built out
@customElement('app-announcement')
class AppAnnouncement extends BridgeBase {
  @property({ attribute: false }) header;
  @property({ attribute: false }) description;
  @property({ attribute: false, type: Array }) arDetails = [];
  @property({ attribute: false }) label;
  @property({ attribute: false }) whatsnewlink;

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

    //   // setup this component's styling...
    this.theComponentStyleTemplate = appAnnouncementStyles;

    // get some info from thePConn before we register and subscribe
    const configProps = this.thePConn.getConfigProps();

    this.header = configProps.header;
    this.description = configProps.description;
    this.arDetails = configProps.details || [];
    this.label = configProps.label;
    this.whatsnewlink = configProps.whatsnewlink;

    // NOTE: Need to bind the callback to 'this' so it has this element's context when it's called.
    this.registerAndSubscribeComponent(this.onStateChange.bind(this));
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

    const theAnnouncement = html` <article class="psdk-announcement">
      <h2 id="announcement-header">${this.header}</h2>
      <div>
        <p>${this.description}</p>
        <div>
          <h3>${this.label}</h3>
          <ul>
            ${this.arDetails.map(detail => html`<li>${detail}</li>`)}
          </ul>
        </div>
      </div>
      <a href="${this.whatsnewlink}"><button class="btn btn-primary active" aria-pressed="true">See what's new</button></a>
    </article>`;

    this.renderTemplates.push(theAnnouncement);

    // AppAnnouncement isn't expected to have children. It's a kind of leaf component

    return this.renderTemplates;
  }
}

export default AppAnnouncement;
