import { html, customElement, property, nothing } from '@lion/core';
import { FormComponentBase } from '../FormComponentBase';

// NOTE: you need to import ANY component you may render.

import '@lion/input-datepicker/define';
import '../../designSystemExtension/LionInputDateOnly';

// import the component's styles as HTML with <style>
import { dateStyles } from './date-styles';


// Declare that PCore will be defined when this code is run
declare var PCore: any;


// NOTE: Can't use name "Date" since it's already a JS type/class
@customElement('date-form')
class DateComponent extends FormComponentBase {

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
        this.theComponentStyleTemplate = dateStyles;

        // Do an initial updateSelf - is this really necessary?
        this.updateSelf();
    }


    disconnectedCallback() {
        // The super call will call storeUnsubscribe...
        super.disconnectedCallback();
        if (this.bLogging) { console.log(`${this.theComponentName}: disconnectedCallback`); }
        if (this.bDebug) { debugger; }
    }


    // DateComponent does some processing on the event before passing to the super implementation
    fieldOnChange(event: any) {
        if (this.bDebug) { debugger; }
        let value = event.target.value;
        event.value = value;

        super.fieldOnChange(event);
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
                <text-form .pConn=${this.thePConn} ?disabled=${this.bDisabled} ?visible=${this.bVisible} label=${this.label} value=${this.value}>
                </text-form>
            `;
        }
        
        let dateValue = this.value ? new Date(this.value) : this.value;

        let sDisplay = this.bVisible? "block" : "none";

        let theContent = 
            html`
            <div style="display:${sDisplay};">
                <div class="form-group">
                    <lion-input-dateonly
                        id=${this.theComponentId}
                        name="DateOnly"
                        .modelValue=${dateValue}
                        .validators = ${this.lionValidatorsArray}
                        .fieldName=${this.label}
                        .feedbackCondition=${this.requiredFeedbackCondition.bind(this)}
                        ?readonly=${this.bReadonly} 
                        ?disabled=${this.bDisabled} 
                        @click=${this.fieldOnChange}
                        @blur=${this.fieldOnBlur} 
                        @change=${this.fieldOnChange}>
                        <span slot="label">${this.annotatedLabel}</span>
                    </lion-input-dateonly>
                </div>
            </div>`
   

        this.renderTemplates.push(theContent);

        return this.renderTemplates;

    }

}

export default DateComponent;