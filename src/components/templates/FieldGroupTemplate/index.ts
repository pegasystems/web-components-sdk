import { html, customElement, property } from "@lion/core";
import { BridgeBase } from "../../../bridge/BridgeBase";
// NOTE: you need to import ANY component you may render.
import "../PromotedFilters";
import { FieldGroupUtils } from "../../../helpers/field-group-utils";
import "../../designSystemExtension/FieldGroup";
import "../../designSystemExtension/FieldGroupList";

// Declare that PCore will be defined when this code is run
declare var PCore: any;

@customElement("field-group-template")
class FieldGroupTemplate extends BridgeBase {
  @property({ attribute: true, type: Object }) configProps;
  @property({ attribute: false, type: Object }) contextClass;
  @property({ attribute: false, type: Array }) referenceList;
  @property({ attribute: false, type: Boolean }) readonlyMode: boolean | undefined;
  heading: string = "";
  pageReference: string = "";
  prevRefLength: number | undefined;

  constructor() {
    //  Note: BridgeBase constructor has 2 optional args:
    //  1st: inDebug - sets this.bLogging: false if not provided
    //  2nd: inLogging - sets this.bLogging: false if not provided.
    //  To get started, we set Debug to false and Logging to true here. Set to your preferred value during development.
    super(false, false);
    if (this.bLogging) {
      console.log(`${this.theComponentName}: constructor`);
    }
  }

  willUpdate(changedProperties) {
    for (let key of changedProperties.keys()) {
      // check for property changes, if so, normalize and render
      if (key == "configProps") {
        if (changedProperties[key] && changedProperties[key] != this.configProps) {
          this.updateSelf();
        }
      }
    }
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.bLogging) {
      console.log(`${this.theComponentName}: connectedCallback`);
    }

    //NOTE: Need to bind the callback to 'this' so it has this element's context when it's called.
    this.registerAndSubscribeComponent(this.onStateChange.bind(this));
    this.updateSelf();
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

    this.configProps = this.thePConn.getConfigProps();
    const renderMode = this.configProps["renderMode"];
    const displayMode = this.configProps["displayMode"];
    this.readonlyMode = renderMode === "ReadOnly" || displayMode === "LABELS_LEFT";
    this.contextClass = this.configProps["contextClass"];
    const lookForChildInConfig = this.configProps["lookForChildInConfig"];
    this.heading = this.configProps["heading"] ?? "Row";
    const resolvedList = FieldGroupUtils.getReferenceList(this.thePConn);
    this.pageReference = `${this.thePConn.getPageReference()}${resolvedList}`;
    this.thePConn.setReferenceList(resolvedList);
    this.referenceList = this.configProps["referenceList"];
    if (this.prevRefLength != this.referenceList.length) {
      if (!this.readonlyMode) {
        if (this.referenceList?.length === 0) {
          this.addFieldGroupItem();
        }
        this.children = this.referenceList?.map((item, index) => ({
          id: index,
          name: `${this.heading} ${index + 1}`,
          children: FieldGroupUtils.buildView(this.thePConn, index, lookForChildInConfig),
        }));
      }
    }
    this.prevRefLength = this.referenceList.length;
  }

  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();
    if (this.bLogging) {
      console.log(`${this.theComponentName}: disconnectedCallback`);
    }
  }

  addFieldGroupItem() {
    if (PCore?.getPCoreVersion()?.includes('8.7')) {
        this.thePConn.getListActions().insert({ classID: this.contextClass }, this.referenceList.length, this.pageReference);
    } else {
        this.thePConn.getListActions().insert({ classID: this.contextClass }, this.referenceList.length);
    }
  }

  deleteFieldGroupItem(event) {
    if (PCore?.getPCoreVersion()?.includes('8.7')) {
      this.thePConn.getListActions().deleteEntry(event.detail, this.pageReference);
    } else {
      this.thePConn.getListActions().deleteEntry(event.detail);
    }
  }

  getEditableFieldGroup() {
    return html`
      <field-group-list .items=${this.children} @onAdd=${this.addFieldGroupItem} @onDelete=${this.deleteFieldGroupItem}></field-group-list>
    `;
  }

  getReadOnlyFieldGroup() {
    return html`${this.referenceList.map((item, index) => {
      return html`<field-group .item=${item} .name=${this.heading + " " + (index + 1)}></field-group>`;
    })}`;
  }

  render() {
    if (this.readonlyMode === undefined) return null;

    // To prevent accumulation (and extra rendering) of previous renders, begin each the render
    //  of any component that's a child of BridgeBase with a call to this.prepareForRender();
    this.prepareForRender();

    if (this.readonlyMode) {
      this.renderTemplates.push(this.getReadOnlyFieldGroup());
    } else {
      this.renderTemplates.push(this.getEditableFieldGroup());
    }

    return this.renderTemplates;
  }
}

export default FieldGroupTemplate;
