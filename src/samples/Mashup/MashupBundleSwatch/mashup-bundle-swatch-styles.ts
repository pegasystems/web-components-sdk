import { html } from 'lit';

export const mashupBundleSwatchStyles = html`
  <style>
    .cc-swatch-header {
      display: flex;
      flex-direction: row;
    }

    .cc-swatch-package {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      width: 260px;
      height: 70px;
      background-color: #333000;
      padding: 5px;
    }

    .cc-swatch-package .cc-swatch-play {
      letter-spacing: normal;
      color: white;
      font-size: 25px;
    }

    .cc-swatch-package .cc-swatch-level {
      letter-spacing: normal;
      color: white;
      font-size: 28px;
      font-weight: bold;
    }

    .cc-swatch-channels {
      letter-spacing: normal;
      background-color: var(--app-primary-color);
      width: 100px;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
    }

    .cc-swatch-channels .cc-swatch-count {
      letter-spacing: normal;
      color: white;
      font-size: 40px;
      font-weight: bold;
    }

    .cc-swatch-channels .cc-swatch-label {
      letter-spacing: normal;
      color: white;
      font-size: 17px;
    }

    .cc-swatch-body {
      letter-spacing: normal;
      border: 1px solid lightgray;
      background-color: #fafafa;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-bottom: 20px;
    }

    .cc-swatch-body .cc-swatch-banner {
      letter-spacing: normal;
      font-weight: bold;
      font-size: 15px;
      padding: 5px;
    }

    .cc-swatch-body .cc-swatch-price {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    .cc-swatch-body .cc-swatch-from-group {
      height: 90px;
    }

    .cc-swatch-body .cc-swatch-from {
      color: var(--app-primary-color);
      text-align: right;
    }

    .cc-swatch-body .cc-swatch-currency {
      letter-spacing: normal;
      color: var(--app-primary-color);
      font-size: 30px;
      font-weight: bold;
      font-family: Tahoma;
    }

    .cc-swatch-body .cc-swatch-dollars {
      letter-spacing: normal;
      color: var(--app-primary-color);
      font-size: 90px;
      font-weight: bold;
      font-family: Tahoma;
    }

    .cc-swatch-body .cc-swatch-monthly {
      display: flex;
      flex-direction: column;
    }

    .cc-swatch-body .cc-swatch-cents {
      letter-spacing: normal;
      color: var(--app-primary-color);
      font-size: 20px;
      font-weight: bold;
    }

    .cc-swatch-body .cc-swatch-shop-button {
      color: white;
      background-color: var(--app-secondary-color);
      font-size: 25px;
      font-weight: bold;
      border-radius: 25px;
      border: 0px;
      margin: 20px;
      padding: 10px 30px;
    }
  </style>
`;
