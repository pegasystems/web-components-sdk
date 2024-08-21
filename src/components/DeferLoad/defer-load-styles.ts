import { html } from '@lion/core';

export const deferLoadStyles = html`
  <style>
    /* used for div wrapper to allow loading indicator to center in the deferLoad wrapper div */
    .container-for-progress {
      position: relative;

      background-color: var(--app-form-color);
      margin-top: 16px;
      margin-bottom: 16px;
      padding: 0rem 0.625rem;
      border-radius: 0.3125rem;
    }
  </style>
`;
