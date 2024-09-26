import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { DetailsTemplateBase } from '../DetailsTemplateBase';
// NOTE: you need to import ANY component you may render.
import '../../../Region';

// import the component's styles as HTML with <style>
import { detailsTwoColumnStyles } from './details-two-column-styles';

import '../../../designSystemExtension/DetailsFields';

@customElement('details-two-column-component')
class DetailsTwoColumn extends DetailsTemplateBase {
  @property({ attribute: false }) viewName = null;

  arFields: any[] = [];
  arFields2: any[] = [];
  arFields3: any[] = [];

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
    this.theComponentStyleTemplate = detailsTwoColumnStyles;
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

    const theConfigProps = this.thePConn.getConfigProps();

    // eslint-disable-next-line no-restricted-syntax
    for (const prop in ['viewName']) {
      if (this[prop] != undefined) {
        this[prop] = theConfigProps[prop];
      }
    }

    for (const kid of this.children) {
      const pKid = kid.getPConnect();
      const pKidData = pKid.resolveConfigProps(pKid.getRawMetadata());
      if (this.children.indexOf(kid) == 0) {
        this.arFields = pKidData.children;
      } else {
        this.arFields2 = pKidData.children;
      }
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

    const theContent = html`
      <div class="psdk-grid-filter">
        <div>
          <details-fields-extension .arFields="${this.arFields}"></details-fields-extension>
        </div>
        <div>
          <details-fields-extension .arFields="${this.arFields2}"></details-fields-extension>
        </div>
      </div>
    `;
    this.renderTemplates.push(theContent);

    return this.renderTemplates;
  }
}

export default DetailsTwoColumn;
