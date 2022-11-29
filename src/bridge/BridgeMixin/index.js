//// JEA experiment with functional composition in ES6

export const BridgeMixin = () => (baseElement) => class extends baseElement {
  /* eslint-disable-next-line no-useless-constructor */
  constructor() {
    super();
    //debugger;
  }

  callIntoMixin() {
    console.log(`BridgeMixin: callIntoMixin`);
  }
}

// End of functional composition/MixIn experimental code