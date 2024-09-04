import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { SdkConfigAccess } from '@pega/auth/lib/sdk-auth-manager';

import '@lion/ui/define/lion-button.js';
import '@lion/ui/define/lion-textarea.js';

// NOTE: you need to import ANY component you may render.

// import the component's styles as HTML with <style>
import { mashupBundleSwatchStyles } from './mashup-bundle-swatch-styles';

@customElement('mashup-bundle-swatch-component')
class MashupBundleSwatch extends LitElement {
  @property({ attribute: false, type: Object }) swatchConfig;

  labelPlay = '';
  labelLevel = '';
  labelChannelCount = '';
  labelChannelFull = '';
  labelBanner = '';
  labelDollars = '';
  labelCents = '';
  labelInternetSpeed = '';

  extraCalling = '';

  // NOTE: MashupBundleSwatch is NOT derived from BridgeBase; just derived from LitElement
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();

    this.labelPlay = this.swatchConfig.play;
    this.labelLevel = this.swatchConfig.level;
    this.labelChannelCount = this.swatchConfig.channels;
    this.labelChannelFull = this.swatchConfig.channels_full;
    this.labelBanner = this.swatchConfig.banner;
    this.labelDollars = this.swatchConfig.price.substring(0, this.swatchConfig.price.indexOf('.'));
    this.labelCents = `${this.swatchConfig.price.substring(this.swatchConfig.price.indexOf('.') + 1)}/month`;
    this.extraCalling = this.swatchConfig.calling;
    this.labelInternetSpeed = this.swatchConfig.internetSpeed;
  }

  disconnectedCallback() {
    // The super call will call storeUnsubscribe...
    super.disconnectedCallback();
  }

  getButtonSwatchHtml(): any {
    return html`
      <div>
        <div class="cc-swatch-header">
          <div class="cc-swatch-package">
            <div class="cc-swatch-play">${this.labelPlay}</div>
            <div class="cc-swatch-level">${this.labelLevel}</div>
          </div>
          <div class="cc-swatch-channels">
            <div class="cc-swatch-count">${this.labelChannelCount}</div>
            <div class="cc-swatch-label">Channels</div>
          </div>
        </div>
        <div class="cc-swatch-body">
          <div class="cc-swatch-banner">${this.labelBanner}</div>
          <ul>
            <li>${this.labelChannelFull} channels plus FREE HD</li>
            <li>Thousands of On Demand choices</li>
            <li>Watch on the ${PCore.getEnvironmentInfo().getApplicationLabel()} App</li>
            <li>Up to ${this.labelInternetSpeed} Internet Speeds</li>
            <li>Unlimited nationwide calling ${this.extraCalling}</li>
          </ul>

          <div class="cc-swatch-price">
            <div class="cc-swatch-from-group">
              <div class="cc-swatch-from">From</div>
              <div class="cc-swatch-currency">$</div>
            </div>

            <div class="cc-swatch-dollars">${this.labelDollars}</div>
            <div class="cc-swatch-monthly">
              <div class="cc-swatch-cents">${this.labelCents}</div>
              <div>for 12 mons</div>
              <div>when bundled</div>
            </div>
          </div>
          <div>
            <button
              class="cc-swatch-shop-button"
              @click=${() => {
                this._shopClick(this.labelLevel);
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
    const locBootstrap = SdkConfigAccess.getSdkConfigBootstrapCSS();

    const arHtml: any[] = [];

    // MashupBundleSwatch not derived from BridgeBase, so we need to load Bootstrap CSS
    arHtml.push(html`<link rel="stylesheet" href="${locBootstrap}" />`);

    arHtml.push(mashupBundleSwatchStyles);
    arHtml.push(sContent);

    return arHtml;
  }

  _shopClick(sLevel: string) {
    const event = new CustomEvent('ShopNowButtonClick', {
      detail: { data: sLevel }
    });

    this.dispatchEvent(event);
  }
}

export default MashupBundleSwatch;
