import {
  LitElement, html, customElement, property, nothing
} from '@lion/core';
import { bootstrapStyles } from '../../bridge/BridgeBase/bootstrap-styles'

//  NOTE: need to import any custom-element that you want to render
//  Otherwise, the tag shows up but the constructor, connectedCallback, etc.
//  don't get called.
import { authLogin, authLogout, authIsSignedIn } from "../../helpers/auth";

@customElement('oauth-login')
class OAuthLoginElem extends LitElement {
  static get styles() {
    return bootstrapStyles;
  }

  @property({type: String}) logintext:string = "Login";
  @property({type: String}) logouttext:string = "Logout";

  loginOrLogout = () => {
    if( !authIsSignedIn() ) {
      authLogin(() => {
        // Update button label
        let elButton = (this.renderRoot.children[0] as HTMLButtonElement);
        elButton.innerText = this.logouttext;
      });
    } else {
      authLogout();
      let elButton = (this.renderRoot.children[0] as HTMLButtonElement);
      elButton.innerText = this.logintext;    
    }
  }

  invalidate = () => {
    let elButton = (this.renderRoot.children[0] as HTMLButtonElement);
    elButton.innerText = authIsSignedIn() ? this.logouttext : this.logintext;
  }

  render(){
    // To prevent flash of "Logout" button after login, we're only showing the button when the user
    //  is logged out. (The Logout button is no longer used since we log out from the NavBar)
    let bLoggedIn = authIsSignedIn();
       return html`
       ${ !bLoggedIn ?
          html`
            <div style="margin-left: 12px; margin-top: 12px;">
              <button type="button" class="btn btn-primary" @click=${this.loginOrLogout}>${bLoggedIn ? this.logouttext : this.logintext}</button>
          </div>`
        : nothing }
      `;
  }
}

export default OAuthLoginElem;