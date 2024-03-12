import {  html, nothing } from "lit";
import { customElement  } from "lit/decorators.js";

import { FormComponentBase } from '../FormComponentBase';

// NOTE: you need to import ANY component you may render.
import '@lion/input-amount/define';

// import the component's styles as HTML with <style>
import { decimalStyles } from './decimal-styles';
import { loadDefaultFeedbackMessages } from '@lion/validate-messages';
// Declare that PCore will be defined when this code is run
declare var PCore: any;


@customElement('decimal-form')
class Decimal extends FormComponentBase {

    constructor() {
        //  Note: BridgeBase constructor has 2 optional args:
        //  1st: inDebug - sets this.bLogging: false if not provided
        //  2nd: inLogging - sets this.bLogging: false if not provided.
        //  To get started, we set both to true here. Set to false if you don't need debugger or logging, respectively.
        super(false, false);
        if (this.bLogging) { console.log(`${this.theComponentName}: constructor`); }
        if (this.bDebug) { debugger; }

        this.pConn = {};
    }

    connectedCallback() {
        super.connectedCallback();
        if (this.bLogging) { console.log(`${this.theComponentName}: connectedCallback`); }
        if (this.bDebug) { debugger; }

        // setup this component's styling...
        this.theComponentStyleTemplate = decimalStyles;

    }


    disconnectedCallback() {
        // The super call will call storeUnsubscribe...
        super.disconnectedCallback();
        if (this.bLogging) { console.log(`${this.theComponentName}: disconnectedCallback`); }
        if (this.bDebug) { debugger; }

    }


    render() {
        if (this.bLogging) { console.log(`${this.theComponentName}: render with pConn: ${JSON.stringify(this.pConn)}`); }
        if (this.bDebug) { debugger; }

        // To prevent accumulation (and extra rendering) of previous renders, begin each the render
        //  of any component that's a child of BridgeBase with a call to this.prepareForRender();
        this.prepareForRender();

        // Handle and return if read only rendering
        if (this.bReadonly) {
            return html`
                <text-form .pConn=${this.thePConn} ?disabled=${this.bDisabled} ?visible=${this.bVisible} label=${this.label} value=${this.value} testId=${this.testId}>
                </text-form>
            `;
        }
          
        loadDefaultFeedbackMessages();

        let theContent = html`${ this.bVisible ?
            html`
            <div class="form-group">
                <lion-input-amount
                    id=${this.theComponentId}
                    name="Amount"
                    dataTestId=${this.testId}
                    .modelValue=${this.value}
                    .fieldName=${this.label} 
                    .validators = ${this.lionValidatorsArray}
                    .feedbackCondition=${this.requiredFeedbackCondition.bind(this)}
                    ?readonly=${this.bReadonly} 
                    ?disabled=${this.bDisabled} 
                    @click=${this.fieldOnClick}
                    @blur=${this.fieldOnBlur}
                    @change=${this.fieldOnChange}>
                    <span slot="label">${this.annotatedLabel}</span>
                </lion-input-amount>
            </div>`
            :
            nothing
            }`;

        this.renderTemplates.push(theContent);

        // There shouldn't be any chidren
        // this.addChildTemplates();

        return this.renderTemplates;

    }

}

export default Decimal;
