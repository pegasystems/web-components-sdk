import { html } from 'lit';

export const fieldValueListStyles = html`
  <style>
    :host {
      display: block;
    }

    .psdk-container-labels-left {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      column-gap: calc(2 * 0.5rem);
      row-gap: calc(2 * 0.5rem);
      align-items: start;
      padding-block: 8px;
    }

    .psdk-container-nolabels {
      align-items: start;
      padding-block: 8px;
    }

    .psdk-container-stacked-large-val {
      display: flex;
      flex-direction: column;
      padding-block: 8px;
    }

    .psdk-grid-label {
      font-size: 0.875rem;
      color: var(--app-neutral-color, #666); /* Fallback color */
      margin-bottom: 0.25rem;
    }

    .psdk-val-stacked {
      margin-top: 0.25rem;
    }

    .psdk-value {
      margin: 8px 0px;
    }

    .psdk-value-hf {
      margin: 8px 0px;
      font-weight: 500;
      font-size: 1.25rem;
    }

    .psdk-val-labels-left {
      word-break: break-word;
    }

    .value-empty {
      color: #999;
    }
  </style>
`;
