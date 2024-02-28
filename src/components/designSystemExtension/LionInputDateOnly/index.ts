import { customElement } from 'lit/decorators.js';

import { LionInputDate } from '@lion/input-date';
import { loadDefaultFeedbackMessages } from '@lion/validate-messages';

loadDefaultFeedbackMessages();

const toIsoDate = (d) => d.toISOString().split('T')[0];


@customElement('lion-input-dateonly')
class LionInputDateOnly extends LionInputDate {
  connectedCallback() {
    // console.log(`LionInputDateOnly modelValue: ${this.modelValue}`);
    super.connectedCallback();
    this.type= 'date';
    this.parser = (viewValue) => new Date(viewValue);
    this.serializer = toIsoDate;
    this.formatter = toIsoDate;
  }


}
export default LionInputDateOnly;
