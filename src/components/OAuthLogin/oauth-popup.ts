import {
    LitElement, html, customElement
  } from '@lion/core';
  
  //  NOTE: need to import any custom-element that you want to render
  //  Otherwise, the tag shows up but the constructor, connectedCallback, etc.
  //  don't get called.
  import { authIsMainRedirect, authRedirectCallback, authPopupCallback } from "../../helpers/auth.js";
  
  @customElement('oauth-popup')
  class OAuthPopupElem extends LitElement {

    constructor() {
        super();

        // Add listener to handleAuthentication once UserManager is ready
        document.addEventListener("UserManagerReady", () => {
          this.handleAuthentication();
        });

    }

    // Process authentication once the UserManager has been initialized and is ready.
    handleAuthentication() {

      // Call back the appropriate signin complete to complete the auth
      if( authIsMainRedirect() ) {
        authRedirectCallback(location.href)
      } else {
        window.onload = function() {
            authPopupCallback(location.href)
        };
      }
    }
  
    render(){
         return html`
        <div />
        `;
    }
  }
  
  export default OAuthPopupElem;