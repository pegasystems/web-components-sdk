import { customElement } from '@lion/core';
import { LionInputDate } from '@lion/input-date';
import { loadDefaultFeedbackMessages } from '@lion/validate-messages';

loadDefaultFeedbackMessages();

const toIsoDatetime = (d) => d && new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('.')[0];


@customElement('lion-input-datetime')
class LionInputDatetime extends LionInputDate {
  connectedCallback() {
    // console.log(`LionInputDateTime modelValue: ${this.modelValue}`);
    super.connectedCallback();
    this.type= 'datetime-local';
    this.parser = (viewValue) => new Date(viewValue);
    this.serializer = toIsoDatetime;
    this.formatter = toIsoDatetime;
  }
}
export default LionInputDatetime;
