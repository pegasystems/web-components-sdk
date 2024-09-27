import { html } from 'lit';
import { customElement, property, ifDefined } from 'lit/decorators.js';
import { BridgeBase } from '../../../bridge/BridgeBase';
// NOTE: you need to import ANY component you may render.

// import the component's styles as HTML with <style>
import { caseSummaryStyles } from './case-summary-styles';

import '../../designSystemExtension/CaseSummaryFields';

// CaseSummaryFields is one of the few components that does NOT have getPConnect.
//  So, no need to extend PConnProps
interface CaseSummaryFieldsProps {
  // If any, enter additional props that only exist on this component
  status?: string;
  showStatus?: boolean;
  theFields: any[] | any | never;
}

// NOTE: this is just a boilerplate component definition intended
//  to be used as a starting point for any new components as they're built out
@customElement('case-summary-template')
class CaseSummary extends BridgeBase {
  @property({ attribute: false, type: String }) status? = '';
  @property({ attribute: false, type: Boolean }) showStatus? = false;

  arPrimaryFields: any[] = [];
  arSecondaryFields: any[] = [];

  // copies of previous primary and secondary rawmeta
  sOldPrimaryMeta = '';
  sOldSecondaryMeta = '';
  localizedVal = PCore.getLocaleUtils().getLocaleValue;
  localeCategory = 'ModalContainer';
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

    // this.pConn = {};
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.bLogging) {
      console.log(`${this.theComponentName}: connectedCallback`);
    }
    if (this.bDebug) {
      debugger;
    }

    // setup this component's styling...
    this.theComponentStyleTemplate = caseSummaryStyles;

    // NOTE: Need to bind the callback to 'this' so it has this element's context when it's called.
    this.registerAndSubscribeComponent(this.onStateChange.bind(this));

    // store off old metadata
    const primaryMeta = this.theChildren[0].getPConnect().resolveConfigProps(this.theChildren[0].getPConnect().getRawMetadata());
    // const secondaryMeta = this.children[1].getPConnect().resolveConfigProps(this.children[1].getPConnect().getRawMetadata());
    this.sOldPrimaryMeta = JSON.stringify(primaryMeta);
    this.sOldSecondaryMeta = JSON.stringify(primaryMeta);
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
   * updateSelf
   */
  updateSelf() {
    if (this.bLogging) {
      console.log(`${this.theComponentName}: updateSelf`);
    }
    if (this.bDebug) {
      debugger;
    }

    const configProps = this.thePConn.getConfigProps() as CaseSummaryFieldsProps;
    this.status = configProps.status;
    this.showStatus = configProps.showStatus;

    // get primary and secodary fields
    for (const kid of this.theChildren) {
      const pKid = kid.getPConnect();
      const pKidData = pKid.resolveConfigProps(pKid.getRawMetadata());
      if (pKidData.name.toLowerCase() == 'primary fields') {
        this.arPrimaryFields = pKidData.children;
        this.arPrimaryFields.forEach(field => {
          if (field.config?.value && typeof field.config?.value === 'string') {
            field.config.value = this.localizedVal(field.config.value, this.localeCategory);
          }
        });
      } else if (pKidData.name.toLowerCase() == 'secondary fields') {
        const secondarySummaryFields = this.prepareCaseSummaryData(pKid);
        this.arSecondaryFields = pKidData.children;
        this.arSecondaryFields.forEach((field, index) => {
          field.config.displayLabel = secondarySummaryFields[index]?.value?.getPConnect().getConfigProps().label;
        });
      }
    }

    this.requestUpdate();
  }

  prepareComponentInCaseSummary(pConnectMeta, getPConnect) {
    const { config, children } = pConnectMeta;
    const pConnect = getPConnect();

    const caseSummaryComponentObject: any = {};

    const { type } = pConnectMeta;
    const createdComponent = pConnect.createComponent({
      type,
      children: children ? [...children] : [],
      config: {
        ...config
      }
    });

    caseSummaryComponentObject.value = createdComponent;
    return caseSummaryComponentObject;
  }

  prepareCaseSummaryData(summaryFieldChildren) {
    const convertChildrenToSummaryData = kid => {
      return kid?.map((childItem, index) => {
        const childMeta = childItem.getPConnect().meta;
        const caseSummaryComponentObject = this.prepareComponentInCaseSummary(childMeta, childItem.getPConnect);
        caseSummaryComponentObject.id = index + 1;
        return caseSummaryComponentObject;
      });
    };
    return summaryFieldChildren ? convertChildrenToSummaryData(summaryFieldChildren?.getChildren()) : undefined;
  }

  rawMetaChanged(): boolean {
    let bHasChanged = false;

    // going to check
    const primaryMeta = this.theChildren[0].getPConnect().resolveConfigProps(this.theChildren[0].getPConnect().getRawMetadata());
    const secondaryMeta = this.theChildren[1].getPConnect().resolveConfigProps(this.theChildren[1].getPConnect().getRawMetadata());

    bHasChanged = !(JSON.stringify(primaryMeta) == this.sOldPrimaryMeta);
    if (!bHasChanged) {
      // check secondary
      bHasChanged = !(JSON.stringify(secondaryMeta) == this.sOldSecondaryMeta);
    }

    if (bHasChanged) {
      // update old
      this.sOldPrimaryMeta = JSON.stringify(primaryMeta);
      this.sOldSecondaryMeta = JSON.stringify(secondaryMeta);
    }

    return bHasChanged;
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
    if (this.bDebug) {
      debugger;
    }

    const bShouldUpdate = super.shouldComponentUpdate();

    // standard bShouldUpdate, but if no changes, then check the raw meta data of the children (primary and secondary fields)
    if (bShouldUpdate || this.rawMetaChanged()) {
      this.updateSelf();
      // } else if () {
      //   this.updateSelf();
    }
  }

  /**
   *
   * @param inName the metadata <em>name</em> that will cause a region to be returned
   */
  getChildRegionArray(inName: string): Object[] {
    if (this.bDebug) {
      debugger;
    }
    const theRetArray: Object[] = [];
    let iFound = 0;

    for (const child of this.theChildren) {
      if (child.getPConnect) {
        const theMetadataType: string | undefined = child.getPConnect().getRawMetadata()?.type?.toLowerCase();
        const theMetadataName: string | undefined = child.getPConnect().getRawMetadata()?.name?.toLowerCase();

        if (theMetadataType === 'region' && theMetadataName === inName) {
          iFound++;
          theRetArray.push(html`<region-component .pConn=${child.getPConnect()}></region-component>`);
        }
      }
    }

    if (this.bLogging) {
      console.log(`${this.theComponentName}: getChildRegionArray - looking for ${inName} found: ${iFound}`);
    }
    return theRetArray;
  }

  render() {
    if (this.bLogging) {
      console.log(`${this.theComponentName}: render with pConn: ${JSON.stringify(this.pConn)}`);
    }
    if (this.bDebug) {
      debugger;
    }

    // To prevent accumulation (and extra rendering) of previous renders, begin each the render
    //  of any component that's a child of BridgeBase with a call to this.prepareForRender();
    this.prepareForRender();

    const theContent = html`
      <case-summary-fields-extension
        status="${ifDefined(this.status)}"
        ?bShowStatus="${this.showStatus}"
        .arPrimaryFields="${this.arPrimaryFields}"
        .arSecondaryFields="${this.arSecondaryFields}"
      ></case-summary-fields-extension>
    `;

    this.renderTemplates.push(theContent);

    // this.addChildTemplates();

    return this.renderTemplates;
  }
}

export default CaseSummary;
