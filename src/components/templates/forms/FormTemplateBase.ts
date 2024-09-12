import { BridgeBase } from '../../../bridge/BridgeBase';

export class FormTemplateBase extends BridgeBase {
  constructor(inDebug = false, inLogging = false) {
    //  Note: BridgeBase constructor has 2 optional args:
    //  1st: inDebug - sets this.bLogging: false if not provided
    //  2nd: inLogging - sets this.bLogging: false if not provided.
    //  To get started, we set both to true here. Set to false if you don't need debugger or logging, respectively.
    super(inDebug, inLogging);

    if (this.bLogging) {
      console.log(`${this.theComponentName}: constructor`);
    }

    this.pConn = {};
  }

  connectedCallback(): void {
    super.connectedCallback();

    if (this.bLogging) {
      console.log(`${this.theComponentName}: connectedCallback`);
    }

    // NOTE: Need to bind the callback to 'this' so it has this element's context when it's called.
    this.registerAndSubscribeComponent(this.onStateChange.bind(this));
  }

  disconnectedCallback(): void {
    // Calling removeContextTreeNode method to remove previous form fields from ContextTreeNode
    PCore.getContextTreeManager().removeContextTreeNode(this.thePConn.getContextName());

    super.disconnectedCallback();

    if (this.bLogging) {
      console.log(`${this.theComponentName}: disconnectedCallback`);
    }
  }

  /**
   * updateSelf
   */
  updateSelf() {
    // Calling removeContextTreeNode method to remove previous form fields from ContextTreeNode
    PCore.getContextTreeManager().removeContextTreeNode(this.thePConn.getContextName());

    if (this.bLogging) {
      console.log(`${this.theComponentName}: updateSelf`);
    }
  }

  /**
   * The `onStateChange()` method will be called when the state is updated.
   *  Override this method in each class that extends BridgeBase.
   *  This implementation can be used for common code that should be done for
   *  all components that are derived from BridgeBase
   */
  onStateChange() {
    if (this.bLogging) {
      console.log(`${this.theComponentName}: onStateChange`);
    }

    const bShouldUpdate = super.shouldComponentUpdate();

    if (bShouldUpdate) {
      this.updateSelf();
    }
  }
}
