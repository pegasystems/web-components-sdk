import { html } from "lit";
import { BridgeBase } from "../../bridge/BridgeBase";
import "@vaadin/text-field";

// To experiment with BridgeMixin (functional composition mixin) along with
//  extending the component, use the following lines:
//
// import { BridgeMixin } from '../../bridge/BridgeMixin';
// class NotSupported extends BridgeMixin()( BridgeBase ) {

class NotSupported extends BridgeBase {
  constructor() {
    //  Note: BridgeBase constructor has 2 optional args:
    //  1st: inDebug - sets this.bLogging: false if not provided
    //  2nd: inLogging - sets this.bLogging: false if not provided.
    //  To get started, we set both to true here. Set to false if you don't need debugger or logging, respectively.
    super(false, false);
    if (this.bLogging) {
      console.log(`${this.theComponentName}: constructor`);
    }
    if (this.bDebug) {
      debugger;
    }

    this.strToDisplay = `${this.theComponentName}`;
    this.pConn = {};
  }

  // Define standard LitElement property getters here. This sets up the
  //  typical data binding for these properties. Note, however,
  //  that you do NOT declare the special "Property" data bindings that
  //  you've prefixed with . (ex: .getPConnect) which have values set by
  //  a lit-html declarative (ex: the function that's passed in as the
  //  value of .getPConnect).
  //  This is the JS way. For TS, can use @property annotation
  static get properties() {
    return {
      strToDisplay: { type: String },
      pConn: { type: Object },
      // componentName: { type: String },
      // configProps: {type: Object }
    };
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.bLogging) {
      console.log(`${this.theComponentName}: connectedCallback`);
    }
    if (this.bDebug) {
      debugger;
    }

    //NOTE: Need to bind the callback to 'this' so it has this element's context when it's called.
    this.registerAndSubscribeComponent(this.onStateChange.bind(this));
  }

  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();
    if (this.bLogging) {
      console.log(`${this.theComponentName}: disconnectedCallback`);
    }
    if (this.bDebug) {
      debugger;
    }
  }

  /**
   *  After calling registerAndSubscribe, this function is called whenever
   *  the store changes.
   */
  onStateChange() {
    super.onStateChange();
    if (this.bLogging) {
      console.log(`${this.theComponentName}: onStateChange`);
    }
    if (this.bDebug) {
      debugger;
    }

    // This calls the getPConnect function that was passed in. The end
    //  result is that pConn is set to the pConnect object that's returned
    //  by getPConnect(). As a demonstration, we'll get values from it
    //  and include in the string we're going to render in this component.
    const pConn = this.getPConnect ? this.getPConnect() : null;
    const configProps = pConn ? pConn.getConfigProps() : null;
    const hasChildren = pConn ? pConn.hasChildren() : null;
    this.strToDisplay = `${this.theComponentName}: configProps: ${JSON.stringify(configProps)} hasChildren: ${hasChildren}`;

    // Demonstrate that we can call into methods added by our Mixin class (if we're using it)
    if (typeof this.callIntoMixin === "function") {
      this.callIntoMixin();
    }
  }

  // render function
  render() {
    if (this.bLogging) {
      console.log(`${this.theComponentName}: render`);
    }
    if (this.bDebug) {
      debugger;
    }

    // To prevent accumulation (and extra rendering) of previous renders, begin each the render
    //  of any component that's a child of BridgeBase with a call to this.prepareForRender();
    this.prepareForRender();

    // When I switched to use <vaadin-text-field>, stopped using my own styling...
    /*
      <style>
        .not-supported-comp {
          font-family: Arial, Helvetica, sans-serif;
          background-color: tomato;
          display: block;
          max-width: 800px;
          margin: 0 auto;
        }
      </style>
    */

    return html`
      <div>
        <vaadin-text-field
          style="width: 100%; text-align: center;"
          value="${this.strToDisplay}"
          readonly
        >
        </vaadin-text-field>
      </div>
    `;
  }
}

// Associate the component implementation with a HTML tag using the CustomElements registry
// As always with Web Components, tag names need to have a dash (Custom Element standard)
customElements.define("not-supported", NotSupported);

export default NotSupported;

