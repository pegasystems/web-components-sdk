"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldGroupUtils = void 0;
var FieldGroupUtils = /** @class */ (function () {
    function FieldGroupUtils() {
    }
    /**
     *
     * @param {*} pConn - pConnect object of the view
     * @returns {string} - returns the name of referenceList
     */
    FieldGroupUtils.getReferenceList = function (pConn) {
        var resolvePage = pConn
            .getComponentConfig()
            .referenceList.replace("@P ", "");
        if (resolvePage.includes("D_")) {
            resolvePage = pConn.resolveDatasourceReference(resolvePage);
            if (resolvePage === null || resolvePage === void 0 ? void 0 : resolvePage.pxResults) {
                resolvePage = resolvePage === null || resolvePage === void 0 ? void 0 : resolvePage.pxResults;
            }
            else if (resolvePage.startsWith("D_") &&
                !resolvePage.endsWith(".pxResults")) {
                resolvePage = "".concat(resolvePage, ".pxResults");
            }
        }
        else {
            resolvePage = "".concat(pConn.getPageReference().replace("caseInfo.content", "")).concat(resolvePage);
        }
        return resolvePage;
    };
    /**
     * creates and returns react element of the view
     * @param {*} pConn - pConnect object of the view
     * @param {*} index - index of the fieldGroup item
     * @param {*} viewConfigPath - boolean value to check for children in config
     * @returns {*} - return the react element of the view
     */
    FieldGroupUtils.buildView = function (pConn, index, viewConfigPath) {
        var _a, _b;
        var context = pConn.getContextName();
        var referenceList = this.getReferenceList(pConn);
        var isDatapage = referenceList.startsWith("D_");
        var pageReference = isDatapage
            ? "".concat(referenceList, "[").concat(index, "]")
            : "".concat(pConn.getPageReference()).concat(referenceList.substring(referenceList.lastIndexOf(".")), "[").concat(index, "]");
        var meta = viewConfigPath
            ? pConn.getRawMetadata().children[0].children[0]
            : pConn.getRawMetadata().children[0];
        var config = {
            meta: meta,
            options: {
                context: context,
                pageReference: pageReference,
                referenceList: referenceList,
                hasForm: true,
            },
        };
        var view = PCore.createPConnect(config);
        if (((_a = pConn.getConfigProps()) === null || _a === void 0 ? void 0 : _a.displayMode) === "LABELS_LEFT") {
            (_b = view.getPConnect()) === null || _b === void 0 ? void 0 : _b.setInheritedProp("displayMode", "LABELS_LEFT");
        }
        return view;
    };
    return FieldGroupUtils;
}());
exports.FieldGroupUtils = FieldGroupUtils;
