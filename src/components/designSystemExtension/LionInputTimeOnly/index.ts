import { customElement } from 'lit/decorators.js';
import { LionInput } from '@lion/ui/input.js';
import { loadDefaultFeedbackMessages } from '@lion/ui/validate-messages.js';

loadDefaultFeedbackMessages();

const toTime = d => d;

@customElement('lion-input-timeonly')
class LionInputTimeOnly extends LionInput {
  connectedCallback() {
    // console.log(`LionInputTimeOnly modelValue: ${this.modelValue}`);
    super.connectedCallback();
    this.type = 'time';
    // this.parser = (viewValue) => new Date(viewValue);
    this.parser = viewValue => viewValue;
    this.serializer = toTime;
    this.formatter = toTime;
  }
}
export default LionInputTimeOnly;
