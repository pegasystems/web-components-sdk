import { customElement } from 'lit/decorators.js';
import { LionInputDate } from '@lion/ui/input-date.js';
import { loadDefaultFeedbackMessages } from '@lion/ui/validate-messages.js';

loadDefaultFeedbackMessages();

const toIsoDate = d => d && d.toISOString().split('T')[0];

@customElement('lion-input-dateonly')
class LionInputDateOnly extends LionInputDate {
  connectedCallback() {
    // console.log(`LionInputDateOnly modelValue: ${this.modelValue}`);
    super.connectedCallback();
    this.type = 'date';
    this.parser = viewValue => new Date(viewValue);
    this.serializer = toIsoDate;
    this.formatter = toIsoDate;
  }
}
export default LionInputDateOnly;
