import { CSSResultGroup, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { SdkConfigAccess } from '@pega/auth/lib/sdk-auth-manager';

import '@lion/ui/define/lion-button.js';
import '@lion/ui/define/lion-textarea.js';

// NOTE: you need to import ANY component you may render.

// import the component's styles as HTML with <style>
import { shoppingOptionsCardStyles } from './shopping-options-card-styles';

@customElement('shopping-options-card-component')
class ShoppingOptionsCard extends LitElement {
  @property({ attribute: true, type: Object }) option;

  static styles?: CSSResultGroup = shoppingOptionsCardStyles;

  constructor() {
    super();
  }

  getButtonSwatchHtml(): any {
    const { play, level, channels, channels_full, banner, price, calling, internetSpeed } = this.option;
    const labelDollars = price.substring(0, price.indexOf('.'));
    const labelCents = `${price.substring(price.indexOf('.') + 1)}/month`;

    return html`
      <div>
        <div class="cc-swatch-header">
          <div class="cc-swatch-package">
            <div class="cc-swatch-play">${play}</div>
            <div class="cc-swatch-level">${level}</div>
          </div>
          <div class="cc-swatch-channels">
            <div class="cc-swatch-count">${channels}</div>
            <div class="cc-swatch-label">Channels</div>
          </div>
        </div>
        <div class="cc-swatch-body">
          <div class="cc-swatch-banner">${banner}</div>
          <ul>
            <li>${channels_full} channels plus FREE HD</li>
            <li>Thousands of On Demand choices</li>
            <li>Watch on the ${PCore.getEnvironmentInfo().getApplicationLabel()} App</li>
            <li>Up to ${internetSpeed} Internet Speeds</li>
            <li>Unlimited nationwide calling ${calling}</li>
          </ul>

          <div class="cc-swatch-price">
            <div class="cc-swatch-from-group">
              <div class="cc-swatch-from">From</div>
              <div class="cc-swatch-currency">$</div>
            </div>

            <div class="cc-swatch-dollars">${labelDollars}</div>
            <div class="cc-swatch-monthly">
              <div class="cc-swatch-cents">${labelCents}</div>
              <div>for 12 mons</div>
              <div>when bundled</div>
            </div>
          </div>
          <div>
            <button
              class="cc-swatch-shop-button"
              @click=${() => {
                this._shopClick(level);
              }}
            >
              SHOP NOW
            </button>
          </div>
        </div>
      </div>
    `;
  }

  render() {
    const sContent = this.getButtonSwatchHtml();
    const locBootstrap = SdkConfigAccess?.getSdkConfigBootstrapCSS();

    const arHtml: any[] = [];

    // ShoppingOptionsCard not derived from BridgeBase, so we need to load Bootstrap CSS
    arHtml.push(html`<link rel="stylesheet" href="${locBootstrap}" />`);

    arHtml.push(sContent);

    return arHtml;
  }

  _shopClick(sLevel: string) {
    const event = new CustomEvent('ShopNowButtonClick', {
      detail: { value: sLevel }
    });

    this.dispatchEvent(event);
  }
}

export default ShoppingOptionsCard;
