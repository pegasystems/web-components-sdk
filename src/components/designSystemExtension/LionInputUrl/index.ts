import { customElement } from "lit/decorators.js";
import { LionInput } from "@lion/ui/input.js";
import { loadDefaultFeedbackMessages } from "@lion/ui/validate-messages.js";

loadDefaultFeedbackMessages();

@customElement("lion-input-url")
class LionInputUrl extends LionInput {
  connectedCallback() {
    //console.log(`LionInputUrl modelValue: ${this.modelValue}`);
    super.connectedCallback();
    this.type = "url";
  }
}
export default LionInputUrl;
