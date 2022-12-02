import { html } from '@lion/core';

export const semanticLinkStyles = html`
  <style>
    .psdk-grid-filter {
        display: grid;
        grid-template-columns: repeat(2,minmax(0,1fr));
        column-gap: calc(2 * 0.5rem);
        row-gap: calc(2 * 0.5rem);
        align-items: center;
        font-size: 0.875rem;
    }

    .psdk-field-label {
      color: rgba(0, 0, 0, 0.54);
      display: block;
      font-weight: 400;
    }

  </style>
`;