export function getDataPage(dataPageName, parameters, context) {
  let dataViewParams;
  if (parameters) {
    dataViewParams = {
      dataViewParameters: parameters
    };
  }
  return new Promise((resolve, reject) => {
    (PCore.getDataApiUtils().getData(dataPageName, dataViewParams, context) as Promise<object>)
      .then((response: any) => {
        resolve(response.data.data);
      })
      .catch(e => {
        if (e) {
          // check specific error if 401, and wiped out if so stored token is stale.  Fetcch new tokens.
          reject(e);
        }
      });
  });
}
