// Declare that PCore will be defined when this code is run
declare var PCore: any;

export class FieldGroupUtils {
  /**
   *
   * @param {*} pConn - pConnect object of the view
   * @returns {string} - returns the name of referenceList
   */
  static getReferenceList(pConn) {
    let resolvePage = pConn.getComponentConfig().referenceList.replace('@P ', '');
    if (resolvePage.includes('D_')) {
      resolvePage = pConn.resolveDatasourceReference(resolvePage);
      if (resolvePage?.pxResults) {
        resolvePage = resolvePage?.pxResults;
      } else if (resolvePage.startsWith('D_') && !resolvePage.endsWith('.pxResults')) {
        resolvePage = `${resolvePage}.pxResults`;
      }
    } else {
      resolvePage = `${pConn.getPageReference().replace('caseInfo.content', '')}${resolvePage}`;
    }
    return resolvePage;
  }

  /**
   * creates and returns react element of the view
   * @param {*} pConn - pConnect object of the view
   * @param {*} index - index of the fieldGroup item
   * @param {*} viewConfigPath - boolean value to check for children in config
   * @returns {*} - return the react element of the view
   */
  static buildView(pConn, index, viewConfigPath) {
    const context = pConn.getContextName();
    const referenceList = this.getReferenceList(pConn);

    const isDatapage = referenceList.startsWith('D_');
    const pageReference = isDatapage
      ? `${referenceList}[${index}]`
      : `${pConn.getPageReference()}${referenceList.substring(referenceList.lastIndexOf('.'))}[${index}]`;
    const meta = viewConfigPath ? pConn.getRawMetadata().children[0].children[0] : pConn.getRawMetadata().children[0];
    const config = {
      meta,
      options: {
        context,
        pageReference,
        referenceList,
        hasForm: true
      }
    };

    const view = PCore.createPConnect(config);
    if (pConn.getConfigProps()?.displayMode === 'LABELS_LEFT') {
      view.getPConnect()?.setInheritedProp('displayMode', 'LABELS_LEFT');
    }
    return view;
  }
}
