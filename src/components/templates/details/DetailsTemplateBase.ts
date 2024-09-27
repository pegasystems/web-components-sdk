import { BridgeBase } from '../../../bridge/BridgeBase';

export class DetailsTemplateBase extends BridgeBase {
  childrenMetadataOld;

  constructor(inDebug = false, inLogging = false) {
    //  Note: BridgeBase constructor has 2 optional args:
    //  1st: inDebug - sets this.bLogging: false if not provided
    //  2nd: inLogging - sets this.bLogging: false if not provided.
    //  To get started, we set both to true here. Set to false if you don't need debugger or logging, respectively.
    super(inDebug, inLogging);

    if (this.bLogging) {
      console.log(`${this.theComponentName}: constructor`);
    }

    // this.pConn = {};
    this.childrenMetadataOld = [];
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.bLogging) {
      console.log(`${this.theComponentName}: connectedCallback`);
    }

    // NOTE: Need to bind the callback to 'this' so it has this element's context when it's called.
    this.registerAndSubscribeComponent(this.onStateChange.bind(this));

    this.childrenMetadataOld = this.getChildrenMetadata();
  }

  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();
    if (this.bLogging) {
      console.log(`${this.theComponentName}: disconnectedCallback`);
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

    if (bShouldUpdate || this.rawMetaChanged()) {
      this.updateSelf();
    }
  }

  // this will be overriden by the child component
  updateSelf() {}

  rawMetaChanged(): boolean {
    const childrenMetadataNew = this.getChildrenMetadata();

    if (!PCore.isDeepEqual(childrenMetadataNew, this.childrenMetadataOld)) {
      this.childrenMetadataOld = childrenMetadataNew;
      return true;
    }

    return false;
  }

  getChildrenMetadata() {
    return this.theChildren.map(child => child.getPConnect().resolveConfigProps(child.getPConnect().getRawMetadata()));
  }
}
