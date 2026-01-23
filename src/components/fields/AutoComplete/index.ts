import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FormComponentBase } from '../FormComponentBase';
import { Utils } from '../../../helpers/utils';
import type { PConnFieldProps } from '../../../types/PConnProps.interface';
import { getDataPage } from '../../../helpers/data_page';
// NOTE: you need to import ANY component you may render.
import '@lion/ui/define/lion-combobox.js';
import '@lion/ui/define/lion-option.js';
// import the component's styles as HTML with <style>
import { autoCompleteStyles } from './autocomplete-styles';

interface AutoCompleteProps extends PConnFieldProps {
  // If any, enter additional props that only exist on AutoComplete here
  deferDatasource?: boolean;
  datasourceMetadata?: any;
  onRecordChange?: any;
  additionalProps?: object;
  listType: string;
  parameters?: any;
  datasource: any;
  columns: any[];
}

// NOTE: this is just a boilerplate component definition intended
//  to be used as a starting point for any new components as they're built out
@customElement('autocomplete-form')
class AutoComplete extends FormComponentBase {
  @property({ attribute: false, type: Array }) options;
  @property({ attribute: true, type: String }) datasource = '';

  theConfigProps: AutoCompleteProps = {
    listType: '',
    datasource: undefined,
    columns: [],
    label: '',
    required: false,
    disabled: false,
    validatemessage: '',
    onChange: undefined,
    readOnly: false,
    testId: '',
    helperText: '',
    hideLabel: false
  };

  listType = '';
  parameters = {};
  columns = [];
  dataList: any = [];

  constructor() {
    //  Note: BridgeBase constructor has 2 optional args:
    //  1st: inDebug - sets this.bLogging: false if not provided
    //  2nd: inLogging - sets this.bLogging: false if not provided.
    //  To get started, we set Debug to false and Logging to true here. Set to your preferred value during development.
    super(false, false);
    if (this.bLogging) {
      console.log(`${this.theComponentName}: constructor`);
    }
    if (this.bDebug) {
      debugger;
    }

    this.options = [];
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
    this.theComponentStyleTemplate = autoCompleteStyles;

    // bind events to this
    this.fieldOnFocus = this.fieldOnFocus.bind(this);
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

    // AutoComplete does some additional work
    this.theConfigProps = this.thePConn.resolveConfigProps(this.thePConn.getConfigProps()) as AutoCompleteProps;

    if (this.dataList.length > 0) {
      this.theConfigProps.datasource = this.dataList;
      this.theConfigProps.listType = 'associated';
    }
    const { displayMode, readOnly } = this.theConfigProps;
    this.bReadonly = Utils.getBooleanValue(readOnly) || displayMode === 'DISPLAY_ONLY' || displayMode === 'STACKED_LARGE_VAL';

    this.listType = this.theConfigProps.listType;
    const context = this.thePConn.getContextName();
    const { columns, datasource } = this.generateColumnsAndDataSource();

    if (columns) {
      this.columns = this.preProcessColumns(columns);
    }

    if (this.listType === 'associated') {
      this.options = Utils.getOptionList(this.theConfigProps, this.thePConn.getDataObject());
    }
    if (!displayMode && this.listType !== undefined && this.listType !== 'associated') {
      getDataPage(datasource, this.parameters, context).then((results: any) => {
        const optionsData: any[] = [];
        const displayColumn = this.getDisplayFieldsMetaData(this.columns);
        results?.forEach(element => {
          const obj = {
            key: element[displayColumn.key] || element.pyGUID,
            value: element[displayColumn.primary]?.toString()
          };
          optionsData.push(obj);
        });
        this.options = optionsData;
      });
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // eslint-disable-next-line sonarjs/no-collapsible-if
    if (name === 'datasource') {
      if (newValue && oldValue !== newValue) {
        this.dataList = JSON.parse(newValue);
        this.options = JSON.parse(newValue);
        this.updateSelf();
      }
    }
  }

  generateColumnsAndDataSource() {
    let datasource = this.theConfigProps.datasource;
    let columns = this.theConfigProps.columns;
    const { deferDatasource, datasourceMetadata } = this.thePConn.getConfigProps() as AutoCompleteProps;
    // convert associated to datapage listtype and transform props
    // Process deferDatasource when datapage name is present. WHhen tableType is promptList / localList
    if (deferDatasource && datasourceMetadata?.datasource?.name) {
      this.listType = 'datapage';
      datasource = datasourceMetadata.datasource.name;
      const { parameters, propertyForDisplayText, propertyForValue } = datasourceMetadata.datasource;
      this.parameters = this.flattenParameters(parameters);
      const displayProp = propertyForDisplayText?.startsWith('@P') ? propertyForDisplayText.substring(3) : propertyForDisplayText;
      const valueProp = propertyForValue?.startsWith('@P') ? propertyForValue.substring(3) : propertyForValue;
      columns = [
        {
          key: 'true',
          setProperty: 'Associated property',
          value: valueProp
        },
        {
          display: 'true',
          primary: 'true',
          useForSearch: true,
          value: displayProp
        }
      ];
    }

    return { columns, datasource };
  }

  flattenParameters(params = {}) {
    const flatParams = {};
    Object.keys(params).forEach(key => {
      const { name, value: theVal } = params[key];
      flatParams[name] = theVal;
    });

    return flatParams;
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
  }

  preProcessColumns(columnList) {
    return columnList.map(col => {
      const tempColObj = { ...col };
      tempColObj.value = col.value && col.value.startsWith('.') ? col.value.substring(1) : col.value;
      return tempColObj;
    });
  }

  isSelected(buttonValue: string): boolean {
    return this.value === buttonValue;
  }

  // Original comment in fieldOnChange event handler before it moved
  //  to use the FormComponentBase implementation
  // NOTE: for lion-radio-group, the clicked button will be in event.target.modelValue
  //  See https://lion-web-components.netlify.app/?path=/docs/forms-radio-group--main

  fieldOnFocus(event: any) {
    if (this.bDebug) {
      debugger;
    }

    // we want to show the autocomplete list when we get focus...
    const theFocusElement = event.currentTarget;
    theFocusElement.opened = true;
  }

  getErrorMessage() {
    const tempError = `${this.theComponentName}: getErrorMessage needs to have a field control implemented.`;
    const errMessage: string = tempError;

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
    if (event?.type === 'model-value-changed' && event?.target?.value === 'Select') {
      const value = '';
      this.actions.onChange(this.thePConn, { value });
    } else {
      let key = '';
      if (event?.target?.value) {
        const index = this.options?.findIndex(element => element.value === event.target.value);
        key = index > -1 ? (key = this.options[index].key) : event.target.value;
      }
      event.target.value = key;
      this.actions.onChange(this.thePConn, event);
    }
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

    // Notes re: lion-combobox
    //  Adding the show-all-on-empty attribute tells the control to (when it's "opened") show
    //    the overlay of autocomplete values even if there is no value in the control.
    //    (Default seems to only show the overlay once the user has started typing.)
    //  @focus is added to mimic the Angular SDK behavior of showing the overlay of when the
    //    control gets focus.
    // @click=${this.fieldOnChange}
    const theContent = html` <div>
      ${this.bVisible
        ? html`
            <div class="form-group">
              <lion-combobox
                id=${this.theComponentId}
                class=""
                autocomplete="inline"
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
                ${this.options?.map(option => {
                  const theOptDisplay = `${option.value}`;
                  return option.value && html` <lion-option value=${option.key} .choiceValue=${option.value}> ${theOptDisplay} </lion-option>`;
                })}
              </lion-combobox>
            </div>
          `
        : nothing}
    </div>`;
    this.renderTemplates.push(theContent);

    // this.addChildTemplates();

    return this.renderTemplates;
  }
}

export default AutoComplete;
