import { Validator } from "@lion/ui/form-core.js";

class ValidateMessageValidator extends Validator {
  // param: { getCompPropFn: checkValidateMessage}
  //  where the value of getCompPropFn is the object being validated's
  //  getComponentProp() function. Can call param.getCompPropFn("validatemessage")
  //  to see if there's a validatemessage value defined...
  // execute(modelValue, param) {
  //   let hasFeedback = false;
  //   // what's the current value of "validatemessage"
  //   const theValMsg = param.getCompPropFn("validatemessage");
  //   // console.log( `ValidateMessageValidator getCompPropFn("validatemessage"): ${theValMsg}`);
  //   if (theValMsg !== undefined && theValMsg !== "") {
  //     // Indicate that there's feedback to be shown if there's a validatemessage
  //     hasFeedback = true;
  //   }
  //   return hasFeedback;
  // }

  static get validatorName() {
    return "ValidateMessageValidator";
  }

  static async getMessage(data) {
    // data contains all of the information from the validator
    //  including the params (that includes our getComponentProp function)
    //  NOTE: trying to save validatemessage a class variable didn't work.
    const theValMsg = await data.params?.getCompPropFn("validatemessage");
    let theRetMsg = "";
    if (theValMsg !== undefined && theValMsg !== "") {
      theRetMsg = theValMsg;
    }

    return theRetMsg;
  }
}

export default ValidateMessageValidator;
