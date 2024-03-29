import { html, customElement, property, nothing } from '@lion/core';
import { FormComponentBase } from '../FormComponentBase';
import { Utils } from '../../../helpers/utils';

// NOTE: you need to import ANY component you may render.
import '@lion/listbox/define';     // Combobox uses lion-option from ListBox
import '@lion/combobox/define';

// import the component's styles as HTML with <style>
import { autoCompleteStyles } from './autocomplete-styles';


// Declare that PCore will be defined when this code is run
declare var PCore: any;

// NOTE: this is just a boilerplate component definition intended
//  to be used as a starting point for any new components as they're built out
@customElement('autocomplete-form')
class AutoComplete extends FormComponentBase {
  @property( {attribute: false, type: Array} ) options;
  @property( {attribute: true, type: String} ) datasource = "";
  
  columns: any;
  dataList: any = [];

  constructor() {
    //  Note: BridgeBase constructor has 2 optional args:
    //  1st: inDebug - sets this.bLogging: false if not provided
    //  2nd: inLogging - sets this.bLogging: false if not provided.
    //  To get started, we set Debug to false and Logging to true here. Set to your preferred value during development.
    super(false, false);
    if (this.bLogging) { console.log(`${this.theComponentName}: constructor`); }
    if (this.bDebug){ debugger; }

    this.options = [];
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.bLogging) { console.log(`${this.theComponentName}: connectedCallback`); }
    if (this.bDebug){ debugger; }

    // setup this component's styling...
    this.theComponentStyleTemplate = autoCompleteStyles;

    // bind events to this
    this.fieldOnFocus = this.fieldOnFocus.bind(this);
    
  }


  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();
    if (this.bLogging) { console.log(`${this.theComponentName}: disconnectedCallback`); }
    if (this.bDebug){ debugger; }

  }
  
  /**
   * updateSelf
   */
  updateSelf() {
    if (this.bLogging) { console.log(`${this.theComponentName}: updateSelf`); }
    if (this.bDebug){ debugger; }

    super.updateSelf();

    // AutoComplete does some additional work
    const theConfigProps = this.thePConn.resolveConfigProps(this.thePConn.getConfigProps());
    if(this.dataList.length > 0){
      theConfigProps.datasource = this.dataList;
      theConfigProps.listType = "associated";
    }
    
    let { listType, datasource = [], columns = [], displayMode } = theConfigProps;
    this.columns = this.preProcessColumns(columns);
    if (listType === 'associated') {
      this.options = Utils.getOptionList(theConfigProps, this.thePConn.getDataObject());
    }
    if (!displayMode && listType !== 'associated' && datasource.length > 0) {
      const workListData = PCore.getDataApiUtils().getData(datasource, {});
      
      workListData.then((workListJSON: Object) => {
        const optionsData: Array<any> = [];
        const results = workListJSON['data'].data;
        const displayColumn = this.getDisplayFieldsMetaData(this.columns);
        results?.forEach(element => {
          const val = element[displayColumn.primary]?.toString();
          const obj = {
            key: element.pyGUID || val,
            value: val
          };
          optionsData.push(obj);
        });
        this.options = optionsData;
      });
    }

  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'datasource') {
      if (newValue && oldValue !== newValue) {
        this.dataList = JSON.parse(newValue);
        this.options = JSON.parse(newValue);
        this.updateSelf();
      }
    }
  }

  getDisplayFieldsMetaData(columnList) {
    const displayColumns = columnList.filter(col => col.display === 'true');
    const metaDataObj: any = { key: '', primary: '', secondary: [] };
    const keyCol = columnList.filter(col => col.key === 'true');
    metaDataObj.key = keyCol.length > 0 ? keyCol[0].value : 'auto';
    for (let index = 0; index < displayColumns.length; index += 1) {
      if (displayColumns[index].primary === 'true') {
        metaDataObj.primary = displayColumns[index].value;
      } else {
        metaDataObj.secondary.push(displayColumns[index].value);
      }
    }
    return metaDataObj;
  };

  preProcessColumns(columnList) {
    return columnList.map(col => {
      const tempColObj = { ...col };
      tempColObj.value = col.value && col.value.startsWith('.') ? col.value.substring(1) : col.value;
      return tempColObj;
    });
  };


  isSelected(buttonValue:string): boolean {

    if (this.value === buttonValue) {
      return true;
    }

    return false;
  }

  // Original comment in fieldOnChange event handler before it moved
  //  to use the FormComponentBase implementation
    // NOTE: for lion-radio-group, the clicked button will be in event.target.modelValue
    //  See https://lion-web-components.netlify.app/?path=/docs/forms-radio-group--main
  

  fieldOnFocus(event: any) {
    if (this.bDebug){ debugger; }

    // we want to show the autocomplete list when we get focus...
    const theFocusElement = event.currentTarget;
    theFocusElement.opened = true;
  }

  getErrorMessage() {

    const tempError = `${this.theComponentName}: getErrorMessage needs to have a field control implemented.`
    let errMessage : string = tempError;

    console.error(tempError);

    // // look for validation messages for json, pre-defined or just an error pushed from workitem (400)
    // if (this.fieldControl.hasError('message')) {
    //   errMessage = this.validateMessage;
    // }
    // else if (this.fieldControl.hasError('required')) {

    //   errMessage = 'You must enter a value';
    // }
    // else if (this.fieldControl.errors) {

    //   errMessage = this.fieldControl.errors.toString();

    // }  

    return errMessage;
  }

  fieldOnChange(event: any) {
    if ((event?.type === 'model-value-changed') && (event?.target?.value === 'Select')) {
      let value = '';
      this.actions.onChange(this.thePConn, { value });
    } else {
      let key = '';
      if (event?.target?.value) {
        const index = this.options?.findIndex(element => element.value === event.target.value);
        key = index > -1 ? key = this.options[index].key : event.target.value;
      }
      event.target.value = key;
      this.actions.onChange(this.thePConn, event);
    }
  }

  render(){
    if (this.bLogging) { console.log(`${this.theComponentName}: render with pConn: ${JSON.stringify(this.pConn)}`); }
    if (this.bDebug){ debugger; }

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

    // Notes re: lion-combobox
    //  Adding the show-all-on-empty attribute tells the control to (when it's "opened") show
    //    the overlay of autocomplete values even if there is no value in the control.
    //    (Default seems to only show the overlay once the user has started typing.)
    //  @focus is added to mimic the Angular SDK behavior of showing the overlay of when the
    //    control gets focus.
    //@click=${this.fieldOnChange}
    const theContent = html`
      <div>
        ${ this.bVisible ?
          html`
              <div class="form-group">
                <lion-combobox 
                  id=${this.theComponentId}
                  class="" autocomplete='inline'
                  dataTestId=${this.testId}
                  .modelValue=${this.value}
                  .fieldName=${this.label}
                  .validators=${this.lionValidatorsArray}
                  .feedbackCondition=${this.requiredFeedbackCondition.bind(this)}
                  show-all-on-empty 
                  @focus=${this.fieldOnFocus}
                  @click=${this.fieldOnChange}
                  @blur=${this.fieldOnBlur} 
                  @change=${this.fieldOnChange}
                  ?readonly=${this.bReadonly} 
                  ?disabled=${this.bDisabled} 
                  >
                  <span slot="label">${this.annotatedLabel}</span>
                  ${ this.options.map((option) => { 
                    const theOptDisplay = `${option.value}`;
                    return html`
                      <lion-option value=${option.key} .choiceValue=${option.value}>
                        ${theOptDisplay}
                      </lion-option>` })}
                </lion-combobox>
              </div>
            `
          : nothing
        }

      </div>`
    ;

    this.renderTemplates.push( theContent );

    // this.addChildTemplates();

    return this.renderTemplates;

  }

}

export default AutoComplete;