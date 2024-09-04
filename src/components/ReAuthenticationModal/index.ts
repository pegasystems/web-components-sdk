import { LitElement, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
// NOTE: you need to import ANY component you may render.

// NOTE: this is just a boilerplate component definition intended
//  to be used as a starting point for any new components as they're built out
@customElement('reauthentication-modal-component')
class ReAuthenticationModal extends LitElement {
  bLogging: Boolean = false;
  theComponentName: String = 'ReAuthenticationModal';

  constructor() {
    super();
    if (this.bLogging) {
      console.log(`${this.theComponentName}: constructor`);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.bLogging) {
      console.log(`${this.theComponentName}: connectedCallback`);
    }

    // Note: ReAuthenticationModal relies on a subscription to a PCore PubSub event
    //  to notify when there is a need to re-authenticate
    /* TODO use const for reAuth */
    PCore.getPubSubUtils().subscribe('reAuth', this.launchReAuthenticationModal.bind(this), 'launchReAuthenticationModal');
  }

  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();
    if (this.bLogging) {
      console.log(`${this.theComponentName}: disconnectedCallback`);
    }
  }

  launchReAuthenticationModal(reAuthProps) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const reauthUrl = reAuthProps.url;
    window.alert(`Authentication token has expired. For now, you need to close this browser window and login again.`);
    // Note: for now, this is the best we can do since the updateSession API call is giving a CORS error.
    //  Need to find way to be in a state where we can show a modal and let user log back in...
  }

  render() {
    if (this.bLogging) {
      console.log(`${this.theComponentName}: render `);
    }

    // Note: Potentially, will render a modal if/when we can prompt user to re-authenticate

    return nothing;
  }
}

export default ReAuthenticationModal;
