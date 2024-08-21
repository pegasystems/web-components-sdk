import { customElement } from '@lion/core';
import { LionInput } from '@lion/input';
import { loadDefaultFeedbackMessages } from '@lion/validate-messages';

loadDefaultFeedbackMessages();

@customElement('lion-input-url')
class LionInputUrl extends LionInput {
  connectedCallback() {
    super.connectedCallback();
    this.type = 'url';
  }
}
export default LionInputUrl;
