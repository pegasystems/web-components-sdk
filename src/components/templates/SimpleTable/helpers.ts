export const TABLE_CELL = 'SdkRenderer';
export const DELETE_ICON = 'DeleteIcon';
<<<<<<< HEAD
export const ACTIONS_ICON = 'ActionsIcon';
=======
>>>>>>> fe5c805 (Hiding primary fields in embedded data table)
export const PRIMARY_FIELDS = 'pyPrimaryFields';

const SUPPORTED_FIELD_TYPES = [
  'Address',
  'TextArea',
  'TextInput',
  'Phone',
  'Email',
  'Time',
  'URL',
  'Percentage',
  'Integer',
  'Decimal',
  'Date',
  'DateTime',
  'Currency',
  'Checkbox',
  'Dropdown',
  'AutoComplete',
  'UserReference',
  'RichText'
];

// BUG-615253: Workaround for autosize in table with lazy loading components
/* istanbul ignore next */
function getFiledWidth(field, label) {
  let width;
  switch (field.type) {
    case 'Time':
      width = 150;
      break;
    case 'Date':
      width = 160;
      break;
    case 'DateTime':
      width = 205;
      break;
    case 'AutoComplete':
    case 'TextArea':
      width = 190;
      break;
    case 'Currency':
    case 'TextInput':
      width = 182;
      break;
    case 'Checkbox':
      // eslint-disable-next-line no-case-declarations
      const text = document.createElement('span');
      document.body.appendChild(text);
      text.style.fontSize = '13px';
      text.style.position = 'absolute';
      text.innerHTML = label;
      width = Math.ceil(text.clientWidth) + 30;
      document.body.removeChild(text);
      break;
    default:
      width = 180;
  }
  return width;
}

export const getContext = thePConn => {
  const contextName = thePConn.getContextName();
  const pageReference = thePConn.getPageReference();
  // 8.7 change = referenceList may now be in top-level of state props,
  //  not always in config of state props
  let { referenceList } = thePConn.getStateProps()?.config || thePConn.getStateProps();
  const pageReferenceForRows = referenceList?.startsWith('.') ? `${pageReference}.${referenceList.substring(1)}` : referenceList;

  // removing "caseInfo.content" prefix to avoid setting it as a target while preparing pageInstructions
  referenceList = pageReferenceForRows?.replace(PCore.getConstants().CASE_INFO.CASE_INFO_CONTENT, '');

  return {
    contextName,
    referenceListStr: referenceList,
    pageReferenceForRows
  };
};

export function isFLProperty(label) {
  return label?.startsWith('@FL');
}

/**
 * [getFieldLabel]
 * Description - A utility that returns resolved field label for "@FL" annotation i.e from data model.
 * @param {Object} fieldConfig
 * @returns {string} resolved label string
 *
 * example:
 * fieldConfig = {label: "@FL .pyID", classID: "TestCase-Work"};
 * return "Case ID"
 */
export function getFieldLabel(fieldConfig) {
  const { label, classID, caption } = fieldConfig;
  let fieldLabel = (label ?? caption)?.substring(4);
  const labelSplit = fieldLabel?.split('.');
  const propertyName = labelSplit?.pop();
  const fieldMetaData: any = PCore.getMetadataUtils().getPropertyMetadata(propertyName, classID) ?? {};
  fieldLabel = fieldMetaData.label ?? fieldMetaData.caption ?? propertyName;
  return fieldLabel;
}

export const updateFieldLabels = (fields, configFields, primaryFieldsViewIndex, pConnect, options) => {
  const labelsOfFields: any = [];
  const { columnsRawConfig = [] } = options;
  fields.forEach((field, idx) => {
    const rawColumnConfig = columnsRawConfig[idx]?.config;
    if (field.config.value === PRIMARY_FIELDS) {
      labelsOfFields.push('');
    } else if (isFLProperty(rawColumnConfig?.label ?? rawColumnConfig?.caption)) {
      labelsOfFields.push(getFieldLabel(rawColumnConfig) || field.config.label || field.config.caption);
    } else {
      labelsOfFields.push(field.config.label || field.config.caption);
    }
  });

  if (primaryFieldsViewIndex > -1) {
    const totalPrimaryFieldsColumns = configFields.length - fields.length + 1;
    if (totalPrimaryFieldsColumns) {
      const primaryFieldLabels: any = [];
      for (let i = primaryFieldsViewIndex; i < primaryFieldsViewIndex + totalPrimaryFieldsColumns; i += 1) {
        let label = configFields[i].config?.label;
        if (isFLProperty(label)) {
          label = getFieldLabel(configFields[i].config);
        } else if (label.startsWith('@')) {
          label = label.substring(3);
        }
        if (pConnect) {
          label = pConnect.getLocalizedValue(label);
        }
        primaryFieldLabels.push(label);
      }
      labelsOfFields.splice(primaryFieldsViewIndex, 1, ...primaryFieldLabels);
    } else {
      labelsOfFields.splice(primaryFieldsViewIndex, 1);
    }
  }
  return labelsOfFields;
};

export const buildFieldsForTable = (configFields, pConnect, showDeleteButton, options) => {
  const { primaryFieldsViewIndex, fields } = options;

  const fieldsLabels = updateFieldLabels(fields, configFields, primaryFieldsViewIndex, pConnect, {
    columnsRawConfig: pConnect.getRawConfigProps()?.children?.find(item => item?.name === 'Columns')?.children
  });

  const fieldDefs = configFields?.map((field, index) => {
    return {
      type: 'text',
      label: fieldsLabels[index],
      fillAvailableSpace: !!field.config.fillAvailableSpace,
      id: index,
      name: field.config.value.substr(4),
      cellRenderer: TABLE_CELL,
      sort: false,
      noContextMenu: true,
      showMenu: false,
      meta: {
        ...field
      },
      // BUG-615253: Workaround for autosize in table with lazy loading components
      width: getFiledWidth(field, fields[index].config.label)
    };
  });

  // ONLY add DELETE_ICON to fields when the table is requested as EDITABLE
  if (showDeleteButton) {
    fieldDefs.push({
      type: 'text',
      label: '',
      name: DELETE_ICON,
      id: fieldDefs.length,
      cellRenderer: DELETE_ICON,
      sort: false,
      noContextMenu: true,
      showMenu: false,
      // BUG-615253: Workaround for autosize in table with lazy loading components
      width: 46
    });
  } else if (showActionsColumn) {
    fieldDefs.push({
      type: 'text',
      label: '',
      name: '',
      id: fieldDefs.length,
      cellRenderer: ACTIONS_ICON,
      sort: false,
      noContextMenu: true,
      showMenu: false,
      width: 30
    });
  }

  return fieldDefs;
};

export const getConfigFields = (rawFields, contextClass, primaryFieldsViewIndex) => {
  let primaryFields = [];
  let configFields: any = [];

  if (primaryFieldsViewIndex > -1) {
    let primaryFieldVMD: any = PCore.getMetadataUtils().resolveView(PRIMARY_FIELDS);
    if (Array.isArray(primaryFieldVMD)) {
      primaryFieldVMD = primaryFieldVMD.find((primaryFieldView: any) => primaryFieldView.classID === contextClass);
      primaryFields = primaryFieldVMD?.children?.[0]?.children || [];
    } else if (primaryFieldVMD?.classID === contextClass) {
      primaryFields = primaryFieldVMD?.children?.[0]?.children || [];
    }

    if (primaryFields.length) {
      primaryFields = primaryFields.filter((primaryField: any) => SUPPORTED_FIELD_TYPES.includes(primaryField.type));
    }
  }

<<<<<<< HEAD
  configFields = [...rawFields.slice(0, primaryFieldsViewIndex), ...primaryFields, ...rawFields.slice(primaryFieldsViewIndex + 1)];
  // filter duplicate fields after combining raw fields and primary fields
  return configFields.filter((field: any, index) => configFields.findIndex((_field: any) => field.config?.value === _field.config?.value) === index);
};

export const evaluateAllowRowAction = (allowRowDelete, rowData) => {
  if (allowRowDelete === undefined || allowRowDelete === true) return true;
  if (allowRowDelete.startsWith?.('@E ')) {
    const expression = allowRowDelete.replace('@E ', '');
    // @ts-ignore - Expected 3 arguments, but got 2
    return PCore.getExpressionEngine().evaluate(expression, rowData);
  }
  return false;
};
=======
  configFields = [
    ...rawFields.slice(0, primaryFieldsViewIndex),
    ...primaryFields,
    ...rawFields.slice(primaryFieldsViewIndex + 1)
  ];
  // filter duplicate fields after combining raw fields and primary fields
  return configFields.filter(
    (field: any, index) => configFields.findIndex((_field: any) => field.config?.value === _field.config?.value) === index
  );
};
>>>>>>> fe5c805 (Hiding primary fields in embedded data table)
