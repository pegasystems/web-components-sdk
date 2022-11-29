import { html, customElement, property } from "@lion/core";
import { BridgeBase } from "../../../bridge/BridgeBase";
// NOTE: you need to import ANY component you may render.
import "../PromotedFilters";
import { Utils } from "../../../helpers/utils";
import "./SimpleTableManual";

// Declare that PCore will be defined when this code is run
declare var PCore: any;

@customElement("simple-table-component")
class SimpleTable extends BridgeBase {
  @property({ attribute: false, type: Boolean }) visible = true;
  @property({ attribute: false, type: Object }) fieldGroupProps;

  constructor() {
    //  Note: BridgeBase constructor has 2 optional args:
    //  1st: inDebug - sets this.bLogging: false if not provided
    //  2nd: inLogging - sets this.bLogging: false if not provided.
    //  To get started, we set Debug to false and Logging to true here. Set to your preferred value during development.
    super(false, false);
    if (this.bLogging) {
      console.log(`${this.theComponentName}: constructor`);
    }
    if (this.bDebug) {
      debugger;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.bLogging) {
      console.log(`${this.theComponentName}: connectedCallback`);
    }

    //NOTE: Need to bind the callback to 'this' so it has this element's context when it's called.
    this.registerAndSubscribeComponent(this.onStateChange.bind(this));
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

  /**
   * updateSelf
   */
  updateSelf() {
    if (this.bLogging) {
      console.log(`${this.theComponentName}: updateSelf`);
    }

    const theConfigProps = this.thePConn.getConfigProps();
    if (theConfigProps["visibility"] != null) {
      this.visible = Utils.getBooleanValue(theConfigProps["visibility"]);
    }

    const { multiRecordDisplayAs } = theConfigProps;
    let { contextClass } = theConfigProps;
    if (!contextClass) {
      let listName = this.thePConn.getComponentConfig().referenceList;
      listName = PCore.getAnnotationUtils().getPropertyName(listName);
      contextClass = this.thePConn.getFieldMetadata(listName)?.pageClass;
    }
    if (multiRecordDisplayAs === "fieldGroup") {
      this.fieldGroupProps = { ...theConfigProps, contextClass };
    }
  }

  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();
    if (this.bLogging) {
      console.log(`${this.theComponentName}: disconnectedCallback`);
    }
  }

  render() {
    if (!this.visible) return null;

    // To prevent accumulation (and extra rendering) of previous renders, begin each the render
    //  of any component that's a child of BridgeBase with a call to this.prepareForRender();
    this.prepareForRender();

    const feildGroupComponent = html`<div>Field Group component</div>`;
    const simpleTableManual = html`<simple-table-manual .pConn=${this.thePConn}></simple-table-manual>`;

    if (this.fieldGroupProps) {
      this.renderTemplates.push(feildGroupComponent);
    } else {
      this.renderTemplates.push(simpleTableManual);
    }

    return this.renderTemplates;
  }
}

export default SimpleTable;
