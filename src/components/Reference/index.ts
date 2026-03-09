import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BridgeBase } from '../../bridge/BridgeBase';
import resolveContext from './utils';

/**
 * Reference component that resolves referenced views with proper configuration.
 */
@customElement('reference-component')
class Reference extends BridgeBase {
  @property({ attribute: true, type: Boolean }) displayOnlyFA = false;
  @property({ attribute: false, type: Object }) resolvedConfigProps: any = {};
  @property({ attribute: false, type: Function }) referencedViewComponent: typeof PConnect | null = null;

  constructor() {
    super(false, false);
  }

  connectedCallback() {
    super.connectedCallback();

    const { context } = this.thePConn.resolveConfigProps(this.thePConn.getConfigProps());
    this.thePConn.registerAdditionalProps({
      classID: `@P ${context}.classID`
    });

    this.registerAndSubscribeComponent(this.onStateChange.bind(this));
  }

  updateSelf() {
    // Resolve configuration properties
    this.resolvedConfigProps = this.thePConn.resolveConfigProps(this.thePConn.getConfigProps());
    const { visibility = true, context = '', readOnly = false, displayMode = '' } = this.resolvedConfigProps;

    const referenceConfig = { ...this.thePConn.getComponentConfig() };

    delete referenceConfig?.name;
    delete referenceConfig?.type;
    delete referenceConfig?.visibility;

    const viewMetadata = this.thePConn.getReferencedView();
    if (!viewMetadata) {
      this.referencedViewComponent = null;
      return;
    }

    // @ts-ignore - Property 'template' does not exist on type 'ComponentMetadataConfig'.
    if (viewMetadata.config?.template === 'CaseView') {
      const utilitiesIndex = viewMetadata.children?.findIndex(child => child.name === 'Utilities');
      if (utilitiesIndex !== -1) {
        // Utilities found in metadata
        const caseID = this.thePConn.getValue(PCore.getConstants().CASE_INFO.CASE_INFO_ID);
        const unSupportedWidgets = ['FileUtility', 'Followers', 'RelatedCases', 'Stakeholders', 'Tags'];
        if (!caseID) {
          viewMetadata.children[utilitiesIndex].children = viewMetadata.children[utilitiesIndex].children.filter(
            widget => !unSupportedWidgets.includes(widget.type)
          );
        }
      }
    }

    const viewObject = {
      ...viewMetadata,
      config: {
        ...viewMetadata.config,
        ...referenceConfig
      }
    };

    // @ts-expect-error - Argument of type 'null' is not assignable to parameter of type 'string'.
    const viewComponent = this.thePConn.createComponent(viewObject, null, null, {
      pageReference: context && context.startsWith('@CLASS') ? '' : resolveContext(context)
    });

    // Handle inherited props if specified in the reference configuration
    if (referenceConfig.inheritedProps && referenceConfig.inheritedProps.length > 0) {
      const inheritedProps = this.thePConn.getInheritedProps();
      referenceConfig.inheritedProps = Object.keys(inheritedProps).map(prop => ({
        prop,
        value: inheritedProps[prop]
      }));
    }

    const newCompPConnect = viewComponent.getPConnect();
    newCompPConnect.setInheritedConfig({
      ...referenceConfig,
      readOnly,
      displayMode
    });

    this.referencedViewComponent = visibility !== false ? newCompPConnect : null;
  }

  onStateChange() {
    const bShouldUpdate = super.shouldComponentUpdate();

    if (bShouldUpdate) {
      this.updateSelf();
    }
  }

  getComponentToRender() {
    return this.referencedViewComponent
      ? html`<view-component .pConn=${this.referencedViewComponent} ?displayOnlyFA=${this.displayOnlyFA}></view-component>`
      : nothing;
  }

  render() {
    if (this.resolvedConfigProps.visibility === false) return null;

    this.prepareForRender(this.displayOnlyFA);
    this.renderTemplates.push(this.getComponentToRender());
    this.addChildTemplates();

    return this.renderTemplates;
  }
}

export default Reference;
