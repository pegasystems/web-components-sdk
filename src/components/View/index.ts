import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BridgeBase } from '../../bridge/BridgeBase';

// NOTE: you need to import ANY component you may render.
import '../templates/AppShell';
import '../templates/TwoColumnPage';
import '../FlowContainer';
import '../templates/forms/OneColumn';
import '../templates/OneColumnTab';
import '../templates/WideNarrowPage';
import '../Stages';
import '../Boilerplate';
import '../templates/CaseSummary';
import '../DeferLoad';
import '../templates/forms/DefaultForm';
import '../templates/DataReference';
import '../templates/SimpleTable';

import { getAllFields } from '../templates/utils';

// import the component's styles as HTML with <style>
import { viewStyles } from './view-styles';

interface ViewProps {
  // If any, enter additional props that only exist on this component
  template?: string;
  label?: string;
  showLabel: boolean;
  mode?: string;
  title?: string;
  visibility?: boolean;
  name?: string;
}

//
// WARNING:  It is not expected that this file should be modified.  It is part of infrastructure code that works with
// Redux and creation/update of Redux containers and PConnect.  Modifying this code could have undesireable results and
// is totally at your own risk.
//

@customElement('view-component')
class View extends BridgeBase {
  @property({ attribute: true, type: Boolean }) displayOnlyFA = false;

  @property({ attribute: false, type: String }) templateName;
  @property({ attribute: false, type: String }) title;

  label = '';
  showLabel = true;

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
    this.theComponentStyleTemplate = viewStyles;

    this.buildView();
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

    // this.buildView();

    const configProps = this.thePConn.getConfigProps() as ViewProps;
    this.templateName = 'template' in configProps ? configProps.template : '';
    if (this.bLogging) {
      console.log(`--> ${this.theComponentName} - templateName: ${this.templateName}`);
    }
    this.title = 'title' in configProps ? configProps.title : '';
  }

  buildView() {
    const configProps = this.thePConn.getConfigProps();
    this.templateName = 'template' in configProps ? configProps.template : '';
    if (this.bLogging) {
      console.log(`--> ${this.theComponentName} - templateName: ${this.templateName}`);
    }
    this.title = 'title' in configProps ? configProps.title : '';

    const inheritedProps$ = this.thePConn.getInheritedProps();

    // We need to bind this component's additionalProps (defined on BridgeBase)
    //  to this implementation's computeAdditionalProps
    this.additionalProps = this.computeAdditionalProps.bind(this);

    this.label = configProps.label || '';
    this.showLabel = configProps.showLabel || this.showLabel;
    // label & showLabel within inheritedProps takes precedence over configProps
    this.label = inheritedProps$.label || this.label;
    this.showLabel = inheritedProps$.showLabel || this.showLabel;

    // NOTE: Need to bind the callback to 'this' so it has this element's context when it's called.
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
    if (this.bDebug) {
      debugger;
    }

    const bShouldUpdate = super.shouldComponentUpdate();

    if (bShouldUpdate) {
      this.updateSelf();
    }
  }

  // Adapting computeAdditionalProps from React version (called additionalProps)
  //  Note that this function is assigned to BridgeBase.additionalProps in
  //  connectedCallback
  computeAdditionalProps(state: any, getPConnect: any) {
    if (this.bDebug) {
      debugger;
    }

    let propObj = {};

    // We already have the template name in this.templateName

    if (this.bLogging) {
      console.log(`--> ${this.theComponentName}: computeAdditionalProps with templateName: ${this.templateName}`);
    }

    if (this.templateName !== '') {
      let allFields = {};

      // These uses are adapted from React version CaseSummary.additionalProps
      switch (this.templateName) {
        case 'CaseSummary':
          allFields = getAllFields(getPConnect);
          // eslint-disable-next-line no-case-declarations
          const unresFields = {
            primaryFields: allFields[0],
            secondaryFields: allFields[1]
          };
          propObj = getPConnect.resolveConfigProps(unresFields);
          break;

        case 'Details':
          allFields = getAllFields(getPConnect);
          propObj = { fields: allFields[0] };
          break;
        default:
          break;
      }
    }

    return propObj;
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
    this.prepareForRender(this.displayOnlyFA);

    // NOTE: We're handling the possible Title and children in the templates below

    let theInnerTemplate: any = nothing;

    if (this.thePConn == null) {
      return;
    }

    if (this.templateName !== '') {
      theInnerTemplate = this.getTemplateForTemplate(this.templateName, this.pConn, this.displayOnlyFA);
    } else if (this.displayOnlyFA) {
      theInnerTemplate = this.getChildTemplateArray(this.displayOnlyFA);
    } else {
      theInnerTemplate = this.getChildTemplateArray();
    }

    const theOuterTemplate = html`
      <div class="psdk-view-top">
        ${this.showLabel && this.label && this.templateName !== 'SimpleTable' && this.templateName !== 'DefaultForm'
          ? html`<div class="template-title-container"><span>${this.label}</span></div>`
          : nothing}
        ${theInnerTemplate}
      </div>
    `;

    this.renderTemplates.push(theOuterTemplate);

    // NOTE: lit-html knows how to render array of lit-html templates!
    return this.renderTemplates;
  }
}

export default View;
