import { Validator } from '@lion/ui/form-core';

class ValidateMessageValidator extends Validator {
  // param: { getCompPropFn: checkValidateMessage}
  //  where the value of getCompPropFn is the object being validated's
  //  getComponentProp() function. Can call param.getCompPropFn("validatemessage")
  //  to see if there's a validatemessage value defined...
  constructor(validateMessage) {
    super(validateMessage);
    this.validateMessage = validateMessage;
  }

  /**
   * Executes the validation and returns a boolean indicating whether there is feedback to be shown.
   *
   * @returns {boolean} True if there is a validatemessage, false otherwise.
   */
  execute() {
    return Boolean(this.validateMessage);
  }

  /**
   * Returns the name of the validator.
   *
   * @returns {string} The name of the validator.
   */
  static get validatorName() {
    return 'ValidateMessageValidator';
  }

  /**
   * Retrieves the validation message from the data object.
   *
   * @param {Object} data - Contains information from the validator, including params.
   * @returns {string} The validation message if available, otherwise an empty string.
   */
  static getMessage(data) {
    return data.params ?? '';
  }
}

export default ValidateMessageValidator;
