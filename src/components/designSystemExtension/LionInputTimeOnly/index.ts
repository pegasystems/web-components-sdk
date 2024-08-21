import { customElement } from '@lion/core';
import { LionInput } from '@lion/input';
import { loadDefaultFeedbackMessages } from '@lion/validate-messages';

loadDefaultFeedbackMessages();

const toTime = d => d;

@customElement('lion-input-timeonly')
class LionInputTimeOnly extends LionInput {
  connectedCallback() {
    console.log(`LionInputTimeOnly modelValue: ${this.modelValue}`);
    super.connectedCallback();
    this.type = 'time';
    // this.parser = (viewValue) => new Date(viewValue);
    this.parser = viewValue => viewValue;
    this.serializer = toTime;
    this.formatter = toTime;
  }
}
export default LionInputTimeOnly;
