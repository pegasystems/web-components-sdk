import { SdkConfigAccess } from './config_access';

/**
 * Initiate the process to get the Constellation bootstrap shell loaded and initialized
 * @param {String} access_token 
 */
export const constellationInit = ( access_token ) => {

  let constellationBootConfig = {};

  // Set up constellationConfig with data that bootstrapWithAuthHeader expects
  // constellationConfig.appAlias = "";
  constellationBootConfig.authorizationHeader = "Bearer " + access_token;
  constellationBootConfig.customRendering = true;
  constellationBootConfig.restServerUrl = SdkConfigAccess.getSdkConfigServer().infinityRestServerUrl;
  // NOTE: Needs a trailing slash! So add one if not provided
  constellationBootConfig.staticContentServerUrl = SdkConfigAccess.getSdkConfigServer().sdkContentServerUrl + "/constellation/";
  if (constellationBootConfig.staticContentServerUrl.slice(-1) !== "/") {
    constellationBootConfig.staticContentServerUrl = constellationBootConfig.staticContentServerUrl + "/";
  }

  window.sessionStorage.setItem("accessToken", access_token);

  // Note that staticContentServerUrl already ends with a slash (see above), so no slash added.
  // In order to have this import succeed and to have it done with the webpackIgnore magic comment tag.  See:  https://webpack.js.org/api/module-methods/ 
  import(/* webpackIgnore: true */ `${constellationBootConfig.staticContentServerUrl}bootstrap-shell.js`).then((bootstrapShell) => {
      // NOTE: once this callback is done, we lose the ability to access loadMashup.
      //  So, create a reference to it
      window.myLoadMashup = bootstrapShell.loadMashup;

      // For experimentation, save a reference to loadPortal, too!
      window.myLoadPortal = bootstrapShell.loadPortal;


      bootstrapShell.bootstrapWithAuthHeader(constellationBootConfig, 'shell').then(() => {
          console.log('Bootstrap successful!');
          // If logging in via oauth-login component...it creates its own window
          if(window.myWindow) {
              window.myWindow.close();
          }

          var event = new CustomEvent("ConstellationReady", { });
          document.dispatchEvent(event);

      });
  });
  /** Ends here **/
};

/**
 * Cleanup an Constellation bootstrap related stuff
 */
export const constellationTerm = () => {
  // TBD: Call to getPConnect().getActionsApi().logout gave a CORS error. Investigate
  // const pConnConfig = { "meta": { "config": {} }};
  // const pConn = PCore.createPConnect( pConnConfig);
  // if (pConn) {
  //     pConn.getPConnect().getActionsApi().logout();
  // }

  // Just reload the page to get the login button again
  window.location.reload();
};


// Code that sets up use of Constellation once it's been loaded and ready

document.addEventListener("ConstellationReady", () => {

  // For now, we are not dynamically loading components. So, turn
  //  off this behavior and assume that all components are loaded at the beginning.
  PCore.setBehaviorOverride("dynamicLoadComponents", false);

  const replaceMe = document.getElementById("pega-here");

  if (replaceMe == null) {

    // shadow root
    const startingComponent = window.sessionStorage.getItem("startingComponent");

    const myShadowRoot = document.getElementsByTagName(startingComponent)[0].shadowRoot;
    const replaceMe = myShadowRoot.getElementById("pega-here");
    const elPrePegaHdr = myShadowRoot.getElementById("app-nopega");
    if(elPrePegaHdr) elPrePegaHdr.style.display = "none";

    let replacement = null;

    switch (startingComponent) {
      case "full-portal-component" :
        replacement = document.createElement("app-entry");
        break;
      case "simple-portal-component":
        replacement = document.createElement("simple-main-component");
        break;
      case "mashup-portal-component":
        replacement = document.createElement("mashup-main-component");
        break;
    }

    if (replacement != null) {
      replacement.setAttribute("id", "pega-root");
      replaceMe.replaceWith(replacement);
    }

  }
  else {

        // Hide the original prepega area
    const elPrePegaHdr = document.getElementById("app-nopega");
    if(elPrePegaHdr) elPrePegaHdr.style.display = "none";

    // With Constellation Ready, replace <div id="pega-here"></div>
    //  with top-level AppEntry with id="pega-root". The creation of
    //  AppEntry will kick off the loadMashup.
  
    const replacement = document.createElement("app-entry");

    replacement.setAttribute("id", "pega-root");
    replaceMe.replaceWith(replacement);

  }


});
