import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { DetailsTemplateBase } from '../DetailsTemplateBase';
// NOTE: you need to import ANY component you may render.
import '../../../Region';

// import the component's styles as HTML with <style>
import { detailsStyles } from './details-styles';

import '../../../designSystemExtension/DetailsFields';

interface DetailsProps {
  // If any, enter additional props that only exist on this component
  label: string;
  showLabel: boolean;
  showHighlightedData: boolean;
}

@customElement('details-component')
class Details extends DetailsTemplateBase {
  @property({ attribute: false }) viewName = null;

  arFields: any[] = [];

  constructor() {
    //  Note: BridgeBase constructor has 2 optional args:
    //  1st: inDebug - sets this.bLogging: false if not provided
    //  2nd: inLogging - sets this.bLogging: false if not provided.
    //  To get started, we set both to true here. Set to false if you don't need debugger or logging, respectively.
    super(false, false);
  }

  connectedCallback() {
    super.connectedCallback();

    // setup this component's styling...
    this.theComponentStyleTemplate = detailsStyles;
  }

  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();
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
    const theConfigProps = this.thePConn.getConfigProps() as DetailsProps;

    // eslint-disable-next-line no-restricted-syntax
    for (const prop in ['viewName']) {
      if (this[prop] !== undefined) {
        this[prop] = theConfigProps[prop];
      }
    }

    // get primary and secodary fields
    for (const kid of this.children) {
      this.arFields = [];
      const pKid = kid.getPConnect();
      const fields = pKid.getChildren();
      fields?.forEach(field => {
        const thePConn = field.getPConnect();
        const theCompType = thePConn.getComponentName().toLowerCase();
        if (theCompType === 'reference') {
          const configObj = thePConn.getReferencedView();
          configObj.config.readOnly = true;
          configObj.config.displayMode = 'LABELS_LEFT';
          const propToUse = { ...thePConn.getInheritedProps() };
          configObj.config.label = propToUse?.label;
          const loadedPConn = thePConn.getReferencedViewPConnect(true).getPConnect();
          const data = {
            type: theCompType,
            pConn: loadedPConn
          };
          this.arFields.push(data);
        } else {
          const data = {
            type: theCompType,
            config: thePConn.getConfigProps()
          };
          this.arFields.push(data);
        }
      });
    }

    this.requestUpdate();
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

    const { viewName } = this;

    // Title
    if (viewName !== null && viewName !== '') {
      const title = html`<text-form value=${viewName}></text-form>`;
      this.renderTemplates.push(title);
    }

    // React version uses <Grid container={cols, gap:2, aslignItems:'start'} with Flex child element
    //  <Flex conainer={direction:"column", itemGap: 1}>{buildReadonlyRegion}</Flex>

    // Opted not to use formatted-text-form as would have to emit each web component separately.  Better to have a
    //  a single component with a single set of styles defined for the entire list

    const theContent = html` <details-fields-extension .arFields="${this.arFields}"></details-fields-extension> `;
    this.renderTemplates.push(theContent);

    return this.renderTemplates;
  }
}

export default Details;
