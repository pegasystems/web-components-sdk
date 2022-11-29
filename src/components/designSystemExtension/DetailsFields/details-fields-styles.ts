import { html } from '@lion/core';

export const detailsFieldsStyles = html`
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

    .psdk-details-group {
        flex-direction: row;
        justify-content: space-between;
    }
    .psdk-details-fields {
        padding: calc(2 * 0.5rem);
        grid-row-gap: calc(2 * 0.5rem);
    }

    .psdk-details-fields-primary {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr;
        grid-column-gap: calc(2 * 0.5rem);
        grid-row-gap: calc(1 * 0.5rem);
    }

    .psdk-details-fields-single {
        display: grid;
        grid-template-columns: 20ch 1fr;
        grid-column-gap: calc(2 * 0.5rem);
    }

    .psdk-details-fields-label {
        word-break: break-word;
        grid-column-start: 1;
        grid-row-start: 1;
        max-width: max-content;
        font-size: 0.8125rem;
        font-weight: 400;
        color: rgba(0,0,0,0.8);
        font-family: "Open Sans";
    }

    .psdk-details-fields-value {
        word-break: break-word;
        grid-column-start: 2;
        grid-row-start: 1;
    }

    span.psdk-details-text-style {
        font-weight: 400;
    }

    span.psdk-details-status-style {
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