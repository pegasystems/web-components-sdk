import { CSSResultGroup, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { bootstrapCSSLink } from '../utils';

// import the component's styles
import { headerStyles } from './header-styles';

@customElement('embedded-header-component')
class Header extends LitElement {
  static styles?: CSSResultGroup = headerStyles;

  @property( {attribute: true, type: Boolean} ) portal;

  constructor() {
    super();
  }

  getHeaderHTML() {
    let tBHtml;
    if(PCore.getEnvironmentInfo().getApplicationLabel() === 'UplusAuto'){
      tBHtml = html `
        <div class="uplus-toolbar margin">
          <button @click=${()=> window.location.reload()}><img src="./assets/img/appName.png" class="uplus-icon"></button>
          <ul>
            <li><button style="${this.portal === 'UConnect' ? "border-bottom: 1px solid"  : "border-bottom: 0"}" @click=${() => { this.openPortal('UConnect') }}>U+ Connect</button></li>
            <li><button style="${this.portal === 'TradeIn' ? "border-bottom: 1px solid"  : "border-bottom: 0"}" @click=${() => { this.openPortal('TradeIn') }}>Trade in</button></li>
            <li><button style="${this.portal === 'Profile' ? "border-bottom: 1px solid"  : "border-bottom: 0"}" @click=${() => { this.openPortal('Profile') }}>Profile</button></li>
          </ul>
          <img src="./assets/img/Avatars.png" style="margin:10px;">
        </div>
      `;
    }else{
      tBHtml = html`<div class="cc-toolbar">
      <h1>${PCore.getEnvironmentInfo().getApplicationLabel()}&nbsp;</h1>
      <img src="./assets/img/antenna.svg" class="cc-icon" />
    </div>`;
    }

    return tBHtml;

    // return html`<div class="cc-toolbar">
    //   <h1>${PCore.getEnvironmentInfo().getApplicationLabel()}&nbsp;</h1>
    //   <img src="./assets/img/antenna.svg" class="cc-icon" />
    // </div>`;
  }

  openPortal(portal:string) {
    const event = new CustomEvent('openPortalClick', {
      portal: { value: portal }
    });

    this.dispatchEvent(event);
  }
    // this.portal = portal;
    // this.requestUpdate();
  }

  protected render(): unknown {
    const sContent = this.getHeaderHTML();

    return [bootstrapCSSLink, sContent];
  }
}

export default Header;
