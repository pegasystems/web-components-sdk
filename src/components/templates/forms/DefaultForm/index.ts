import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { FormTemplateBase } from '../FormTemplateBase';

// import the component's styles as HTML with <style>
import { defaultFormStyles } from './default-form-styles';

interface DefaultFormProps {
  // If any, enter additional props that only exist on this component
  NumCols: string;
  template: string;
  instructions: string;
}

@customElement('default-form-component')
class DefaultForm extends FormTemplateBase {
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
    this.theComponentStyleTemplate = defaultFormStyles;
  }

  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();
  }

  getDefaultFormHtml(): any {
    const configProps = this.thePConn.getConfigProps() as DefaultFormProps;

    const numCols = configProps.NumCols ? configProps.NumCols : '1';
    let divClass = '';
    switch (numCols) {
      case '1':
        divClass = 'psdk-default-form-one-column';
        break;
      case '2':
        divClass = 'psdk-default-form-two-column';
        break;
      case '3':
        divClass = 'psdk-default-form-three-column';
        break;
      default:
        divClass = 'psdk-default-form-one-column';
        break;
    }

    // repoint children before getting templateArray
    this.theChildren = this.theChildren[0].getPConnect().getChildren();

    return html` <div class="${divClass}">${this.getChildTemplateArray()}</div> `;
  }

  render() {
    const sContent = html`${this.getDefaultFormHtml()}`;

    // To prevent accumulation (and extra rendering) of previous renders, begin each the render
    //  of any component that's a child of BridgeBase with a call to this.prepareForRender();
    this.prepareForRender();

    this.renderTemplates.push(sContent);

    return this.renderTemplates;
  }
}

export default DefaultForm;
