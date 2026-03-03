import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BridgeBase } from '../../bridge/BridgeBase';

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
    this.pConn = {};
  }

  connectedCallback() {
    super.connectedCallback();
    this.registerAndSubscribeComponent(this.onStateChange.bind(this));
  }

  updateSelf() {
    if (!this.pConn.getConfigProps) {
      if (this.pConn.getPConnect()) {
        this.pConn = this.pConn.getPConnect();
      } else {
        console.error(`Reference component: bad pConn: ${JSON.stringify(this.pConn)}`);
        return;
      }
    }

    // Resolve configuration properties
    this.resolvedConfigProps = this.thePConn.resolveConfigProps(this.thePConn.getConfigProps());
    const { visibility = true, context = '', readOnly = false, displayMode = '' } = this.resolvedConfigProps;

    const referenceConfig = { ...this.pConn.getComponentConfig() };

    delete referenceConfig?.name;
    delete referenceConfig?.type;
    delete referenceConfig?.visibility;

    const viewMetadata = this.pConn.getReferencedView();

    if (!viewMetadata) {
      this.referencedViewComponent = null;
      return;
    }

    const viewObject = {
      ...viewMetadata,
      config: {
        ...viewMetadata.config,
        ...referenceConfig
      }
    };

    const viewComponent = this.pConn.createComponent(viewObject, null, null, {
      pageReference: context && context.startsWith('@CLASS') ? '' : context
    });

    const newCompPConnect = viewComponent.getPConnect();

    // Handle inherited props if specified in the reference configuration
    if (referenceConfig.inheritedProps && referenceConfig.inheritedProps.length > 0) {
      const inheritedProps = this.pConn.getInheritedProps();
      referenceConfig.inheritedProps = Object.keys(inheritedProps).map(prop => ({
        prop,
        value: inheritedProps[prop]
      }));
    }

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
