import { LitElement, html, nothing, css } from "lit";
import { customElement, property } from "lit/decorators.js";

export const fieldGroupStyles = html`
  <style>
    .field-group-title {
      padding: 1em 0;
      font-weight: 500;
    }
    .field-group-items {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .field-group-item {
      display: grid;
      grid-template-columns: 16ch auto;
      gap: calc(0.5rem) calc(1rem);
    }
    .field-group-item-label {
      word-break: break-word;
      max-width: max-content;
      font-size: calc(0.8125rem);
      font-weight: 600;
      color: rgba(0, 0, 0, 0.6);
    }
    .field-group-item-value {
      ord-break: break-word;
    }
  </style>
`;
