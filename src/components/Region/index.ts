import { customElement } from 'lit/decorators.js';
import { BridgeBase } from '../../bridge/BridgeBase';
// NOTE: you need to import ANY component you may render.
import '../widgets/AppAnnouncement';
import '../widgets/CaseHistory';
import '../widgets/FileUtility';
import '../ToDo';
import '../Pulse';
import '../fields/AutoComplete';
import '../fields/Checkbox';
import '../fields/Currency';
import '../fields/Date';
import '../fields/DateTime';
import '../fields/Decimal';
import '../fields/Dropdown';
import '../fields/Email';
import '../fields/FormattedText';
import '../fields/Integer';
import '../fields/Percentage';
import '../fields/Phone';
import '../fields/RadioButtons';
import '../fields/Text';
import '../fields/TextArea';
import '../fields/TextContent';
import '../fields/TextInput';
import '../fields/Time';
import '../fields/URL';
import '../fields/UserReference';
import '../templates/Details';
import '../templates/DetailsTwoColumn';
import '../Attachment';

@customElement('region-component')
class Region extends BridgeBase {
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

    // eslint-disable-next-line sonarjs/no-collapsible-if
    if (!this.children) {
      if (this.bLogging) {
        console.log(`${this.theComponentName}: render with NO children: ${this.children}`);
      }
    }

    this.addChildTemplates();

    return this.renderTemplates;
  }
}

export default Region;
