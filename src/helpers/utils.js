"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
var dayjs = require("dayjs");
var customParseFormat = require("dayjs/plugin/customParseFormat");
var localizedFormat = require("dayjs/plugin/localizedFormat");
var relativeTime = require("dayjs/plugin/relativeTime");
var sdk_auth_manager_1 = require("@pega/auth/lib/sdk-auth-manager");
dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.getUniqueControlID = function () {
        var sPrefix = "control-";
        this.lastControlID++;
        return sPrefix + this.lastControlID.toString();
    };
    Utils.getSDKStaticContentUrl = function () {
        var sdkConfigServer = sdk_auth_manager_1.SdkConfigAccess.getSdkConfigServer();
        // NOTE: Needs a trailing slash! So add one if not provided
        if (!sdkConfigServer.sdkContentServerUrl.endsWith("/")) {
            sdkConfigServer.sdkContentServerUrl = "".concat(sdkConfigServer.sdkContentServerUrl, "/");
        }
        return "".concat(sdkConfigServer.sdkContentServerUrl, "constellation/");
    };
    Utils.getOptionList = function (configProps, dataObject) {
        var listType = configProps.listType;
        var arReturn = [];
        if (listType != null) {
            switch (listType.toLowerCase()) {
                case "associated":
                    // data source should be an array
                    if (typeof configProps.datasource == "object") {
                        arReturn = configProps.datasource;
                    }
                    break;
                case "datapage":
                    // get data page
                    // eslint-disable-next-line no-case-declarations
                    var dataPage = configProps.datasource;
                    if (dataObject[dataPage]) {
                        alert("need to handle data page");
                    }
                    else {
                        var listSourceItems = configProps.listOutput;
                        if (typeof dataPage === "object" &&
                            !Array.isArray(listSourceItems)) {
                            listSourceItems = dataPage.source ? dataPage.source : [];
                        }
                        (listSourceItems || []).forEach(function (item) {
                            item.value = item.text ? item.text : item.value;
                        });
                        arReturn = listSourceItems || [];
                    }
                    break;
            }
        }
        return arReturn;
    };
    Utils.getInitials = function (userName) {
        var userInitials = userName;
        if (userName && userName != "") {
            userInitials = userName.charAt(0);
            if (userName.lastIndexOf(" ") > 0) {
                var lastName = userName.substring(userName.lastIndexOf(" ") + 1);
                userInitials += lastName.charAt(0);
            }
            else if (userName.lastIndexOf(".") > 0) {
                var lastName = userName.substring(userName.lastIndexOf(".") + 1);
                userInitials += lastName.charAt(0);
            }
        }
        else {
            userInitials = "";
        }
        return userInitials.toUpperCase();
    };
    Utils.getImageSrc = function (name, serverUrl) {
        var iconName = name.replace("pi-", "").replace("pi ", "").trim();
        if (iconName === "line-chart") {
            iconName = "chart-line";
        }
        return this.getIconPath(serverUrl).concat(iconName).concat(".svg");
    };
    Utils.getIconPath = function (serverUrl) {
        // Directory in the constellation folder where the icons will be
        return serverUrl.concat("icons/");
    };
    Utils.getBooleanValue = function (inValue) {
        var bReturn = false;
        if (typeof inValue == "string") {
            // Experiment with having "" be true, too (and "on")
            if (inValue.toLowerCase() === "true" ||
                inValue.toLowerCase() === "on" ||
                inValue === "") {
                bReturn = true;
            }
        }
        else {
            bReturn = inValue;
        }
        return bReturn;
    };
    // Note: Explored using formatters/format but that doesn't do the same as this function.  So not possible to just invoke
    //  format and do away with all the separate Pega possible dateFormats.
    Utils.generateDate = function (dateVal, dateFormat) {
        var sReturnDate = dateVal;
        if (dateVal == null || dateVal == "") {
            return dateVal;
        }
        // VRS: Dont think we need the below line.  Commenting out for now. (2020.05.20)
        // dateTimeVal = dateTimeVal.replace("GMT", "+0000")
        // Anything else would require a specific String pattern be specified as an argument to the dayjs constructor
        // if date has a ".", then of the format YYYMMDD[T]HHmmss[.]SSS Z, need to change to YYYYMMDD
        if (dateVal.indexOf(".") >= 0) {
            // VRS: Dont think we need the dateVal.replace("GMT", "+0000").  Commenting out for now. (2020.05.20)
            // dateVal = dayjs(dateVal.replace("GMT", "+0000"), "YYYYMMDD[T]HHmmss[.]SSS Z").format("YYYYMMDD");
            // dateVal format appears to be YYYY-MM-DDThh:mm:ss.SSSZ (which is the default dayjs expected format)
            // Don't change the dateVal passed to dayjs (rather just set a default sReturnDate--if that is what we want to do)
            //  (better might be just doing that in a default switch block)
            sReturnDate = dayjs(dateVal).format("YYYYMMDD");
        }
        switch (dateFormat) {
            case "Date-Short":
                // 1/1/01
                sReturnDate = dayjs(dateVal).format("M/D/YY");
                break;
            case "Date-Short-YYYY":
                // 1/1/2001
                sReturnDate = dayjs(dateVal).format("M/D/YYYY");
                break;
            case "Date-Short-Custom":
                // 01/01/01
                sReturnDate = dayjs(dateVal).format("MM/DD/YY");
                break;
            case "Date-Short-Custom-YYYY":
                // 01/01/2001
                sReturnDate = dayjs(dateVal).format("L");
                break;
            case "Date-Medium":
                // Jan 1, 2001
                sReturnDate = dayjs(dateVal).format("ll");
                break;
            case "Date-DayMonthYear-Custom":
                // 01-Jan-2001
                sReturnDate = dayjs(dateVal).format("DD-MMM-YYYY");
                break;
            case "Date-Full":
                // Monday, January 1, 2001
                sReturnDate = dayjs(dateVal).format("dddd, MMMM D, YYYY");
                break;
            case "DateTime-Frame":
            case "DateTime-Frame-Short":
            case "DateTime-Since":
                // 2 days, 5 hours ago
                sReturnDate = dayjs(dateVal).fromNow();
                break;
            case "Date-Long":
                // January 1, 2001
                sReturnDate = dayjs(dateVal).format("MMMM D, YYYY");
                break;
            case "Date-ISO-8601":
                // 2001/01/01 y/m/d
                sReturnDate = dayjs(dateVal).format("YYYY/MM/DD");
                break;
            case "Date-Gregorian-1":
                // 01 January, 2001
                sReturnDate = dayjs(dateVal).format("DD MMMM, YYYY");
                break;
            case "Date-Gregorian-2":
                // January 01, 2001
                sReturnDate = dayjs(dateVal).format("MMMM DD, YYYY");
                break;
            case "Date-Gregorian-3":
                // 2001, January 01
                sReturnDate = dayjs(dateVal).format("YYYY, MMMM DD");
                break;
            case "DateTime-Custom":
                break;
        }
        return sReturnDate;
    };
    // Note: Explored using formatters/format but that doesn't do the same as this function.  So not possible to just invoke
    //  format and do away with all the separate Pega possible dateFormats.
    Utils.generateDateTime = function (dateTimeVal, dateFormat) {
        var sReturnDate = dateTimeVal;
        if (dateTimeVal == null || dateTimeVal == "") {
            return dateTimeVal;
        }
        // VRS: Dont think we need the below line.  Commenting out for now. (2020.05.20)
        // dateTimeVal = dateTimeVal.replace("GMT", "+0000")
        // dateTimeVal format appears to be YYYY-MM-DDThh:mm:ss.SSSZ (which is the default dayjs expected format)
        // Anything else would require a specific String pattern be specified as an argument to the dayjs constructor
        switch (dateFormat) {
            case "DateTime-Short":
                // 1/1/01 1:00 AM
                sReturnDate = dayjs(dateTimeVal).format("M/D/YY h:mm A");
                break;
            case "DateTime-Short-Custom":
                // 01/01/01 01:00 AM
                sReturnDate = dayjs(dateTimeVal).format("MM/DD/YY hh:mm A");
                break;
            case "DateTime-Short-YYYY-Custom":
                // 01/01/2001 01:00 AM
                sReturnDate = dayjs(dateTimeVal).format("M/D/YYYY hh:mm A");
                break;
            case "DateTime-Short-YYYY":
                // 1/1/2001 1:00 AM
                sReturnDate = dayjs(dateTimeVal).format("M/D/YYYY h:mm A");
                break;
            case "DateTime-Medium":
                // Jan 1, 2001 1:00:00 AM
                sReturnDate = dayjs(dateTimeVal).format("MMM D, YYYY h:mm:ss A");
                break;
            case "DateTime-Long":
                // January 1, 2001 1:00:00 AM
                sReturnDate = dayjs(dateTimeVal).format("MMMM D, YYYY h:mm:ss A");
                break;
            case "DateTime-DayMonthYear-Custom":
                // 01-Jan-2001 1:00:00 AM
                sReturnDate = dayjs(dateTimeVal).format("DD-MMM-YYYY h:mm:ss A");
                break;
            case "DateTime-Full":
                // Monday, January 1, 2001 1:00 AM EDT
                sReturnDate = dayjs(dateTimeVal).format("dddd, MMMM D, YYYY h:mm A z");
                break;
            case "DateTime-Frame":
            case "DateTime-Frame-Short":
            case "DateTime-Since":
                // 2 days, 5 hours ago
                sReturnDate = dayjs(dateTimeVal).fromNow();
                break;
            case "DateTime-ISO-8601":
                // 2001/01/01 1:00:00 AM     y/m/d
                sReturnDate = dayjs(dateTimeVal).format("YYYY/MM/DD h:mm:ss A");
                break;
            case "DateTime-Gregorian-1":
                // 01 January, 2001 1:00:00 AM
                sReturnDate = dayjs(dateTimeVal).format("DD MMMM, YYYY h:mm:ss A");
                break;
            case "DateTime-Gregorian-2":
                // January 01, 2001 1:00:00 AM
                sReturnDate = dayjs(dateTimeVal).format("MMMM DD, YYYY h:mm:ss A");
                break;
            case "DateTime-Gregorian-3":
                // 2001, January 01 1:00:00 AM
                sReturnDate = dayjs(dateTimeVal).format("YYYY, MMMM DD h:mm:ss A");
                break;
            case "DateTime-Custom":
                break;
        }
        return sReturnDate;
    };
    Utils.getIconFromFileType = function (fileType) {
        var icon = "document-doc";
        if (!fileType)
            return icon;
        if (fileType.startsWith("audio")) {
            icon = "audio";
        }
        else if (fileType.startsWith("video")) {
            icon = "video";
        }
        else if (fileType.startsWith("image")) {
            icon = "picture";
        }
        else if (fileType.includes("pdf")) {
            icon = "document-pdf";
        }
        else {
            var _a = fileType.split("/"), subtype_1 = _a[1];
            var foundMatch = function (sources) {
                return sources.some(function (key) { return subtype_1.includes(key); });
            };
            if (foundMatch(["excel", "spreadsheet"])) {
                icon = "document-xls";
            }
            else if (foundMatch(["zip", "compressed", "gzip", "rar", "tar"])) {
                icon = "document-compress";
            }
        }
        return icon;
    };
    Utils.getIconForAttachment = function (attachment) {
        var icon;
        switch (attachment.type) {
            case "FILE":
                icon = this.getIconFromFileType(attachment.mimeType);
                break;
            case "URL":
                icon = "chain";
                break;
            default:
                icon = "document-doc";
        }
        return icon;
    };
    Utils.getTagName = function (lionTagName) {
        var TAGS_MAP = {
            INPUT: "INPUT",
            TEXTAREA: "TEXTAREA",
            COMBOBOX: "SELECT",
            CHECKBOX: "checkbox",
            RADIO: "radio",
        };
        for (var key in TAGS_MAP) {
            if (lionTagName.includes(key))
                return TAGS_MAP[key];
        }
        return lionTagName;
    };
    Utils.isObject = function (objValue) {
        return (objValue &&
            typeof objValue === "object" &&
            objValue.constructor === Object);
    };
    Utils.lastControlID = 0;
    return Utils;
}());
exports.Utils = Utils;
exports.default = Utils;
