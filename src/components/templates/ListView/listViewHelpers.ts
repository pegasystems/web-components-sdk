import { getContext, readContextResponse } from './utils';

export function init(props) {
  const {
    referenceList,
    pConn$,
    personalizationId,
    parameters,
    compositeKeys,
    isSearchable,
    allowBulkActions,
    ref,
    showDynamicFields,
    isDataObject,
    xRayUid,
    cosmosTableRef
  } = props;
  let { editing, selectionMode } = props;

  const runtimeParams = PCore.getRuntimeParamsAPI().getRuntimeParams();

  let selectionCountThreshold;

  // promise to fetch metadata
  const metaDataPromise = PCore.getAnalyticsUtils().getDataViewMetadata(referenceList, showDynamicFields, null);

  const promisesArray: any = [metaDataPromise];

  // promise to fetch report configured columns
  const reportColumnsPromise = PCore.getAnalyticsUtils()
    .getFieldsForDataSource(referenceList, false, pConn$.getContextName())
    .catch(() => {
      return Promise.resolve({
        data: { data: [] }
      });
    });
  promisesArray.push(reportColumnsPromise);

  const fetchEditDetails = async metadata => {
    const {
      data: { isQueryable }
    } = metadata;
    if (!isDataObject) {
      if (!isQueryable) {
        editing = false; /* Force editing to false if DP is non queryable */
      }

      const { MULTI_ON_HOVER, MULTI } = PCore.getConstants().LIST_SELECTION_MODE;
      if (allowBulkActions && isQueryable) {
        /** enable bulk actions only if DP is queryable */
        selectionMode = MULTI_ON_HOVER;
      }
      if ([MULTI_ON_HOVER, MULTI].includes(selectionMode)) {
        selectionCountThreshold = 250; // Results count should not be greater than threshold to display SelectAll checkbox.
      }
    }
    return Promise.resolve();
  };

  const editPromise = metaDataPromise.then(metadata => fetchEditDetails(metadata));
  promisesArray.push(editPromise);
  return getContext({
    tableSource: referenceList,
    ListId: personalizationId,
    runtimeParams: parameters ?? runtimeParams,
    promisesArray,
    pConn$,
    compositeKeys,
    isSearchable,
    isCacheable: true,
    xRayUid
  }).then(async context => {
    return readContextResponse(context, {
      ...props,
      editing,
      selectionCountThreshold,
      ref,
      selectionMode,
      xRayUid,
      cosmosTableRef
    });
  });
}
