import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import isEqual from 'fast-deep-equal';
import { FormComponentBase } from '../FormComponentBase';
import { Utils } from '../../../helpers/utils';
import handleEvent from '../../../helpers/event-utils';
import type { PConnFieldProps } from '../../../types/PConnProps.interface';

// NOTE: you need to import ANY component you may render.
import '@lion/ui/define/lion-select.js';
import '../../designSystemExtension/FieldValueList';

// import the component's styles as HTML with <style>
import { dropdownStyles } from './dropdown-styles';

interface DropdownProps extends PConnFieldProps {
  // If any, enter additional props that only exist on Dropdown here
  datasource?: any[];
  onRecordChange?: any;
  fieldMetadata?: any;
  listType?: any;
  columns?: any[];
  deferDatasource?: boolean;
  datasourceMetadata?: any;
  parameters?: any;
}

function flattenParameters(params = {}) {
  const flatParams = {};
  Object.keys(params).forEach(key => {
    const { name, value: theVal } = params[key];
    flatParams[name] = theVal;
  });

  return flatParams;
}

function preProcessColumns(columnList) {
  return columnList.map(col => {
    const tempColObj = { ...col };
    tempColObj.value = col.value && col.value.startsWith('.') ? col.value.substring(1) : col.value;
    return tempColObj;
  });
}

function getDisplayFieldsMetaData(columnList) {
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

interface IOption {
  key: string;
  value: string;
}

// NOTE: this is just a boilerplate component definition intended
//  to be used as a starting point for any new components as they're built out
@customElement('dropdown-form')
class Dropdown extends FormComponentBase {
  @property({ attribute: false, type: Array }) options;

  dataList: any = [];
  fieldMetadata: any = [];
  localeContext = '';
  localeClass = '';
  localeName = '';
  localePath = '';
  localizedValue = '';
  theDatasource?: any[] | null;

  constructor() {
    //  Note: BridgeBase constructor has 2 optional args:
    //  1st: inDebug - sets this.bLogging: false if not provided
    //  2nd: inLogging - sets this.bLogging: false if not provided.
    //  To get started, we set Debug to false and Logging to true here. Set to your preferred value during development.
    super(false, false);
  }

  connectedCallback() {
    super.connectedCallback();

    // setup this component's styling...
    this.theComponentStyleTemplate = dropdownStyles;
  }

  updateOptions(options: IOption[]) {
    this.options = options;

    if (this.displayMode) {
      this.value = this.options?.find(option => option.key === this.value)?.value || this.value;
      this.localizedValue = this.thePConn.getLocalizedValue(
        this.value === 'Select...' ? '' : this.value,
        this.localePath,
        this.thePConn.getLocaleRuleNameFromKeys(this.localeClass, this.localeContext, this.localeName)
      );
    }
  }

  /**
   * updateSelf
   */
  updateSelf() {
    super.updateSelf();

    // Some additional processing
    const theConfigProps = this.thePConn.resolveConfigProps(this.thePConn.getConfigProps()) as DropdownProps;
    const datasource = theConfigProps.datasource;

    if (!isEqual(datasource, this.theDatasource)) {
      // inbound datasource is different, so update theDatasource
      this.theDatasource = datasource || null;
    }

    if (this.value === '' && !this.bReadonly) {
      this.value = 'Select';
    }

    if (this.theDatasource) {
      const optionsList = Utils.getOptionList(theConfigProps, this.thePConn.getDataObject());
      optionsList?.unshift({ key: 'Select', value: this.thePConn.getLocalizedValue('Select...', '', '') });
      this.updateOptions(optionsList);
    }

    const propName = this.thePConn.getStateProps().value;
    const className = this.thePConn.getCaseInfo().getClassName();
    const refName = propName?.slice(propName.lastIndexOf('.') + 1);

    this.fieldMetadata = theConfigProps.fieldMetadata;
    const metaData = Array.isArray(this.fieldMetadata)
      ? this.fieldMetadata.filter((field: any) => field?.classID === className)[0]
      : this.fieldMetadata;

    let displayName = metaData?.datasource?.propertyForDisplayText;
    displayName = displayName?.slice(displayName.lastIndexOf('.') + 1);
    this.localeContext = metaData?.datasource?.tableType === 'DataPage' ? 'datapage' : 'associated';
    this.localeClass = this.localeContext === 'datapage' ? '@baseclass' : className;
    this.localeName = this.localeContext === 'datapage' ? metaData?.datasource?.name : refName;
    this.localePath = this.localeContext === 'datapage' ? displayName : this.localeName;

    this.localizedValue = this.thePConn.getLocalizedValue(
      this.value,
      this.localePath,
      this.thePConn.getLocaleRuleNameFromKeys(this.localeClass, this.localeContext, this.localeName)
    );

    this.localizedValue = this.options?.find(opt => opt.key === this.value)?.value || this.localizedValue;
    this.getDatapageData();
  }

  getDatapageData() {
    const configProps = this.thePConn.getConfigProps() as DropdownProps;
    let { listType, parameters, datasource = [], columns = [] } = configProps;
    const { deferDatasource, datasourceMetadata } = configProps;
    const context = this.thePConn.getContextName();
    if (deferDatasource && datasourceMetadata?.datasource?.name) {
      listType = 'datapage';
      datasource = datasourceMetadata.datasource.name;
      const { parameters: dataSourceParameters, propertyForDisplayText, propertyForValue } = datasourceMetadata.datasource;
      parameters = flattenParameters(dataSourceParameters);
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

    columns = preProcessColumns(columns) || [];
    if (listType !== 'associated' && typeof datasource === 'string') {
      this.getData(datasource, parameters, columns, context, listType);
    }
  }

  getData(dataSource, parameters, columns, context, listType) {
    const dataConfig: any = {
      columns,
      dataSource,
      deferDatasource: true,
      listType,
      parameters,
      matchPosition: 'contains',
      maxResultsDisplay: '5000',
      cacheLifeSpan: 'form'
    };
    // @ts-ignore - PCore is a global
    PCore.getDataApi()
      .init(dataConfig, context)
      .then((dataApiObj: any) => {
        const optionsData: any[] = [];
        const displayColumn = getDisplayFieldsMetaData(columns);
        dataApiObj?.fetchData('').then(response => {
          if (response.data) {
            response.data.forEach(element => {
              const val = element[displayColumn.primary]?.toString();
              const obj = {
                key: element[displayColumn.key] || element.pyGUID,
                value: val
              };
              optionsData.push(obj);
            });
          }
          optionsData?.unshift({ key: 'Select', value: this.thePConn.getLocalizedValue('Select...', '', '') });
          this.updateOptions(optionsData);
        });
      });
  }

  // Comment that was in the original fieldOnChange before we started to use
  //  the super class implementation
  // NOTE: for lion-radio-group, the clicked button will be in event.target.modelValue
  //  See https://lion-web-components.netlify.app/?path=/docs/forms-radio-group--main

  isSelected(buttonValue: string): boolean {
    return this.value === buttonValue;
  }

  fieldOnChange(event: any) {
    if (event?.target?.value === 'Select') {
      event.target.value = '';
    }
    handleEvent(this.actionsApi, 'changeNblur', this.propName, event.target.value);
    const configProps = this.thePConn.getConfigProps() as DropdownProps;
    if (configProps?.onRecordChange) {
      configProps.onRecordChange(event);
    }
    this.thePConn.clearErrorMessages({
      property: this.propName
    });
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

    if (this.displayMode) {
      return html` <field-value-list .label="${this.label}" .value="${this.value}" .displayMode="${this.displayMode}"> </field-value-list> `;
    }

    // Handle and return if read only rendering
    if (this.bReadonly) {
      return html`
        <text-form
          .pConn=${this.thePConn}
          ?disabled=${this.bDisabled}
          ?visible=${this.bVisible}
          label=${this.label}
          value=${this.localizedValue}
          testId=${this.testId}
        >
        </text-form>
      `;
    }

    const theContent = html`${this.bVisible
      ? html` <div>
          ${this.bVisible
            ? html`
                <div class="form-group">
                  <lion-select
                    id=${this.theComponentId}
                    dataTestId=${this.testId}
                    .fieldName=${this.label}
                    .modelValue=${this.value === '' && !this.bReadonly ? 'Select' : this.value}
                    .validators=${this.lionValidatorsArray}
                    .feedbackCondition=${this.requiredFeedbackCondition.bind(this)}
                    ?readonly=${this.bReadonly}
                    ?disabled=${this.bDisabled}
                    @model-value-changed=${this.fieldOnChange}
                  >
                    <span slot="label">${this.annotatedLabel}</span>
                    <select slot="input">
                      ${this.options.map(option => {
                        return html`<option value=${option.key}>
                          ${this.thePConn.getLocalizedValue(
                            option.value,
                            this.localePath,
                            this.thePConn.getLocaleRuleNameFromKeys(this.localeClass, this.localeContext, this.localeName)
                          )}
                        </option>`;
                      })}
                    </select>
                  </lion-select>
                </div>
              `
            : nothing}
        </div>`
      : nothing}`;

    this.renderTemplates.push(theContent);

    // this.addChildTemplates();

    return this.renderTemplates;
    // @model-value-changed=${this.fieldOnChange} >
  }
}

export default Dropdown;
