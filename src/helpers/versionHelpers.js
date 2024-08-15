"use strict";
/**
 * versionHelpers.ts
 *
 * Container helper functions that can identify which version of
 * PCore/PConnect is being run
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sdkVersion = void 0;
exports.compareSdkPCoreVersions = compareSdkPCoreVersions;
exports.sdkVersion = "8.7";
function compareSdkPCoreVersions() {
    //  const theConstellationVersion = PCore.getPCoreVersion();
    console.warn("Using Constellation version ".concat(PCore.getPCoreVersion(), ". Ensure this is the same version as your Infinity server."));
}
