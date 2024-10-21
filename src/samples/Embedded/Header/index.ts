import { CSSResultGroup, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { bootstrapCSSLink } from '../utils';

// import the component's styles
import { headerStyles } from './header-styles';

@customElement('embedded-header-component')
class Header extends LitElement {
  static styles?: CSSResultGroup = headerStyles;

  constructor() {
    super();
  }

  getHeaderHTML() {
    return html`<div class="cc-toolbar">
      <h1>${PCore.getEnvironmentInfo().getApplicationLabel()}&nbsp;</h1>
      <img src="./assets/img/antenna.svg" class="cc-icon" />
    </div>`;
  }

  protected render(): unknown {
    const sContent = this.getHeaderHTML();

    return [bootstrapCSSLink, sContent];
  }
}

export default Header;
