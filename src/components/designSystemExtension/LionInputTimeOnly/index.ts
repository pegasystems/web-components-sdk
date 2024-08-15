import { customElement } from "lit/decorators.js";
import { LionInput } from "@lion/ui/input.js";
import { loadDefaultFeedbackMessages } from "@lion/ui/validate-messages.js";

loadDefaultFeedbackMessages();

const toIsoDatetime = (d) =>
  d &&
  new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .split(".")[0];
const toTime = (d) => d;

@customElement("lion-input-timeonly")
class LionInputTimeOnly extends LionInput {
  connectedCallback() {
    console.log(`LionInputTimeOnly modelValue: ${this.modelValue}`);
    super.connectedCallback();
    this.type = "time";
    // this.parser = (viewValue) => new Date(viewValue);
    this.parser = (viewValue) => viewValue;
    this.serializer = toTime;
    this.formatter = toTime;
  }
}
export default LionInputTimeOnly;
