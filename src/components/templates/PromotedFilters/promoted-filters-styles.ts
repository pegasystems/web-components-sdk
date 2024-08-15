import { html } from "lit";

export const promotedFiltersStyles = html`
  <style>
    .psdk-grid-filter {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      column-gap: calc(2 * 0.5rem);
      row-gap: calc(2 * 0.5rem);
      align-items: start;
    }
    .action-button {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-bottom: 1rem;
    }
  </style>
`;

