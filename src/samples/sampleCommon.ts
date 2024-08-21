export const sampleMainInit = (elMain, startingComp, mainElName) => {
  // Add event listener for when logged in and constellation bootstrap is loaded
  document.addEventListener('SdkConstellationReady', () => {
    const replaceMe = document.getElementById('pega-here');

    if (replaceMe === null) {
      const myShadowRoot = document.getElementsByTagName(startingComp)[0].shadowRoot;
      if (myShadowRoot) {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const replaceMe = myShadowRoot.getElementById('pega-here');
        const elPrePegaHdr = myShadowRoot.getElementById('app-nopega');
        if (elPrePegaHdr) elPrePegaHdr.style.display = 'none';

        const replacement = document.createElement(mainElName);
        if (replacement != null && replaceMe != null) {
          replacement.setAttribute('id', 'pega-root');
          replaceMe.replaceWith(replacement);
        }
      }
    } else {
      // Hide the original prepega area
      const elPrePegaHdr = document.getElementById('app-nopega');
      if (elPrePegaHdr) elPrePegaHdr.style.display = 'none';

      // With Constellation Ready, replace <div id="pega-root"></div>
      //  with top-level AppEntry with id="pega-root". The creation of
      //  AppEntry will kick off the loadMashup.
      // Not sure why we need this app-entry component....should be fine to just move the logic
      // in app-entry here as done for mashup scenario (so more startPortal to this source file)

      const replacement = document.createElement('app-entry');

      if (replacement && replaceMe) {
        replacement.setAttribute('id', 'pega-root');
        replaceMe.replaceWith(replacement);
      }
    }
  });

  document.addEventListener('SdkLoggedOut', () => {
    const thePegaRoot = document.getElementById('pega-root');
    if (thePegaRoot) {
      const thePegaHere = document.createElement('div');
      thePegaHere.setAttribute('id', 'pega-here');
      thePegaRoot.replaceWith(thePegaHere);
      const theLogoutMsgDiv = document.createElement('div');
      theLogoutMsgDiv.setAttribute('style', 'margin: 5px;');
      theLogoutMsgDiv.innerHTML = `You are logged out. Refresh the page to log in again.`;
      thePegaRoot.appendChild(theLogoutMsgDiv);
    }
  });
};
