export function getDetailsFieldArray(arFields) {
  const fields: any[] = [];
  arFields?.forEach(field => {
    const thePConn = field.getPConnect();
    const theCompType = thePConn.getComponentName().toLowerCase();
    if (theCompType === 'reference' || theCompType === 'group') {
      const configProps = thePConn.getConfigProps();
      configProps.readOnly = true;
      configProps.displayMode = 'DISPLAY_ONLY';
      const propToUse = { ...thePConn.getInheritedProps() };
      configProps.label = propToUse?.label;
      const options = {
        context: thePConn.getContextName(),
        pageReference: thePConn.getPageReference(),
        referenceList: thePConn.getReferenceList()
      };
      const viewContConfig = {
        meta: {
          ...thePConn.getMetadata(),
          type: theCompType,
          config: configProps
        },
        options
      };
      const theViewCont = PCore.createPConnect(viewContConfig);
      const data = {
        type: theCompType,
        pConn: theViewCont?.getPConnect()
      };
      fields.push(data);
    } else {
      const data = {
        type: theCompType,
        config: thePConn.getConfigProps()
      };
      fields.push(data);
    }
  });
  return fields;
}
