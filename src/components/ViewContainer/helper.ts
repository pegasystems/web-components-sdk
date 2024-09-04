export const addContainerItem = pConnect => {
  const containerManager = pConnect.getContainerManager();
  const context = pConnect.getContextName();
  containerManager.addContainerItem({
    context,
    semanticURL: ''
  });
};

export const configureBrowserBookmark = pConnect => {
  const context = pConnect.getContextName();
  const containerName = pConnect.getContainerName();
  const navPages = pConnect.getValue('pyPortal.pyPrimaryNavPages');
  const defaultViewLabel = Array.isArray(navPages) && navPages[0] ? navPages[0].pyLabel : '';
  PCore.configureForBrowserBookmark({
    context,
    containerName,
    acName: containerName,
    semanticURL: '',
    defaultViewLabel
  });
};
