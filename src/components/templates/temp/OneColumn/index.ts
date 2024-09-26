import { customElement } from 'lit/decorators.js';
import { FormTemplateBase } from '../FormTemplateBase';
// NOTE: you need to import ANY component you may render.

// import the component's styles as HTML with <style>
import { oneColumnStyles } from './one-column-styles';

@customElement('one-column')
class OneColumn extends FormTemplateBase {
  constructor() {
    //  Note: FormTemplateBase constructor has 2 optional args:
    //  1st: inDebug - sets this.bLogging: false if not provided
    //  2nd: inLogging - sets this.bLogging: false if not provided.
    //  To get started, we set both to true here. Set to false if you don't need debugger or logging, respectively.
    super(false, false);
  }

  connectedCallback() {
    super.connectedCallback();

    // setup this component's styling...
    this.theComponentStyleTemplate = oneColumnStyles;
  }

  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();
  }

  render() {
    // To prevent accumulation (and extra rendering) of previous renders, begin each the render
    //  of any component that's a child of BridgeBase with a call to this.prepareForRender();
    this.prepareForRender();

    this.addChildTemplates();

    return this.renderTemplates;
  }
}

export default OneColumn;
