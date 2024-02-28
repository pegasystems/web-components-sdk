import { customElement } from 'lit/decorators.js';

import { LionInput } from '@lion/input';
import { loadDefaultFeedbackMessages } from '@lion/validate-messages';

loadDefaultFeedbackMessages();

@customElement('lion-input-url')
class LionInputUrl extends LionInput {
  connectedCallback() {
    //console.log(`LionInputUrl modelValue: ${this.modelValue}`);
    super.connectedCallback();
    this.type= 'url';
  }
}
export default LionInputUrl;
