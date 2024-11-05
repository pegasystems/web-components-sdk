export function getDetailsFieldArray(arFields) {
  const fields: any[] = [];
  arFields?.forEach(field => {
    const thePConn = field.getPConnect();
    const theCompType = thePConn.getComponentName().toLowerCase();
    if (theCompType === 'reference') {
      const configObj = thePConn.getReferencedView();
      configObj.config.readOnly = true;
      configObj.config.displayMode = 'DISPLAY_ONLY';
      const propToUse = { ...thePConn.getInheritedProps() };
      configObj.config.label = propToUse?.label;
      const loadedPConn = thePConn.getReferencedViewPConnect(true).getPConnect();
      const data = {
        type: theCompType,
        pConn: loadedPConn
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
