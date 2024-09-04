import { html } from 'lit';

export const caseSummaryFieldsStyles = html`
  <style>
    .psdk-case-summary-fields {
      padding: calc(2 * 0.5rem);
      display: grid;
      grid-row-gap: calc(2 * 0.5rem);
    }

    .psdk-case-summary-fields-primary {
      grid-template-columns: 20ch 1fr;
      display: grid;
      grid-column-gap: calc(2 * 0.5rem);
      grid-row-gap: calc(2 * 0.5rem);
    }

    .psdk-csf-primary-field {
      display: grid;
      grid-template-columns: 1fr;
      grid-column-gap: calc(0 * 0.5rem);
    }

    .psdk-csf-primary-field-header {
      word-break: break-word;
      grid-column-start: 1;
      grid-row-start: 1;
      max-width: max-content;
      font-size: 0.8125rem;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.8);
      font-family: 'Open Sans';
    }

    .psdk-csf-primary-field-data {
      word-break: break-word;
      grid-column-start: 1;
      grid-row-start: 2;
    }

    .psdk-case-summary-fields-secondary {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr;
      grid-column-gap: calc(2 * 0.5rem);
      grid-row-gap: calc(1 * 0.5rem);
    }

    .psdk-csf-secondary-field {
      display: grid;
      grid-template-columns: 20ch 1fr;
      grid-column-gap: calc(2 * 0.5rem);
    }

    .psdk-csf-secondary-field-header {
      word-break: break-word;
      grid-column-start: 1;
      grid-row-start: 1;
      max-width: max-content;
      font-size: 0.8125rem;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.8);
      font-family: 'Open Sans';
    }

    .psdk-csf-secondary-field-data {
      word-break: break-word;
      grid-column-start: 2;
      grid-row-start: 1;
    }

    span.psdk-csf-text-style {
      font-size: 1.125rem;
      font-weight: 600;
      font-family: 'Open Sans';
    }

    span.psdk-csf-status-style {
      background-color: #e9eef3;
      border-radius: calc(0.25 * 0.5rem);
      color: #4c5a67;
      display: inline-block;
      font-size: 0.75rem;
      font-weight: bold;
      line-height: calc(0.5rem * 2.5);
      height: calc(0.5rem * 2.5);
      padding: 0 0.5rem;
      text-transform: uppercase;
    }
  </style>
`;
