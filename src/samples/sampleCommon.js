"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sampleMainInit = void 0;
var sampleMainInit = function (elMain, startingComp, mainElName) {
    // Add event listener for when logged in and constellation bootstrap is loaded
    document.addEventListener("SdkConstellationReady", function () {
        var replaceMe = document.getElementById("pega-here");
        if (replaceMe === null) {
            var myShadowRoot = document.getElementsByTagName(startingComp)[0].shadowRoot;
            if (myShadowRoot) {
                var replaceMe_1 = myShadowRoot.getElementById("pega-here");
                var elPrePegaHdr = myShadowRoot.getElementById("app-nopega");
                if (elPrePegaHdr)
                    elPrePegaHdr.style.display = "none";
                var replacement = document.createElement(mainElName);
                if (replacement != null && replaceMe_1 != null) {
                    replacement.setAttribute("id", "pega-root");
                    replaceMe_1.replaceWith(replacement);
                }
            }
        }
        else {
            // Hide the original prepega area
            var elPrePegaHdr = document.getElementById("app-nopega");
            if (elPrePegaHdr)
                elPrePegaHdr.style.display = "none";
            // With Constellation Ready, replace <div id="pega-root"></div>
            //  with top-level AppEntry with id="pega-root". The creation of
            //  AppEntry will kick off the loadMashup.
            // Not sure why we need this app-entry component....should be fine to just move the logic
            // in app-entry here as done for mashup scenario (so more startPortal to this source file)
            var replacement = document.createElement("app-entry");
            if (replacement && replaceMe) {
                replacement.setAttribute("id", "pega-root");
                replaceMe.replaceWith(replacement);
            }
        }
    });
    document.addEventListener("SdkLoggedOut", function () {
        var thePegaRoot = document.getElementById("pega-root");
        if (thePegaRoot) {
            var thePegaHere = document.createElement("div");
            thePegaHere.setAttribute("id", "pega-here");
            thePegaRoot.replaceWith(thePegaHere);
            var theLogoutMsgDiv = document.createElement("div");
            theLogoutMsgDiv.setAttribute("style", "margin: 5px;");
            theLogoutMsgDiv.innerHTML = "You are logged out. Refresh the page to log in again.";
            thePegaRoot.appendChild(theLogoutMsgDiv);
        }
    });
};
exports.sampleMainInit = sampleMainInit;
