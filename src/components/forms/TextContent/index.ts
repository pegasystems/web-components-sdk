import { html, customElement, property } from '@lion/core';
import { FormComponentBase } from '../FormComponentBase';

// NOTE: you need to import ANY component you may render.
import '@lion/input/define';

// import the component's styles as HTML with <style>
import { textContentStyles } from './text-content-styles';

@customElement('text-content-form')
class TextContent extends FormComponentBase {
  // displayAs metadata is one of: 'Paragraph' | 'Heading 1' | 'Heading 2' | 'Heading 3' | 'Heading 4';
  @property({ attribute: false, type: String }) displayAs;
  @property({ attribute: false, type: String }) content;

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

    this.pConn = {};
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
    this.theComponentStyleTemplate = textContentStyles;
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

    super.updateSelf();

    // Some additional processing

    const theConfigProps = this.thePConn.getConfigProps();

    this.displayAs = theConfigProps.displayAs;
    this.content = theConfigProps.content;
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

    // Handle and return if read only rendering
    if (this.bReadonly) {
      return html`
        <text-form
          .pConn=${this.thePConn}
          ?disabled=${this.bDisabled}
          ?visible=${this.bVisible}
          label=${this.label}
          value=${this.value}
          testId=${this.testId}
        >
        </text-form>
      `;
    }

    let theContentHtml;

    switch (this.displayAs) {
      case 'Paragraph':
        theContentHtml = html`<p>${this.content}</p>`;
        break;

      case 'Heading 1':
        theContentHtml = html`<h1>${this.content}</h1>`;
        break;

      case 'Heading 2':
        theContentHtml = html`<h2>${this.content}</h2>`;
        break;

      case 'Heading 3':
        theContentHtml = html`<h3>${this.content}</h3>`;
        break;

      case 'Heading 4':
        theContentHtml = html`<h4>${this.content}</h4>`;
        break;

      default:
        console.error(`${this.theComponentName} received unexpected displayAs: ${this.displayAs}`);
        theContentHtml = html`<p>${this.content}</p>`;
        break;
    }

    this.renderTemplates.push(theContentHtml);

    return this.renderTemplates;
  }
}

export default TextContent;
