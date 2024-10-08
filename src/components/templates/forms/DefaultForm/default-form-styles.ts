import { html } from 'lit';

export const defaultFormStyles = html`
  <style>
    .psdk-default-form-one-column {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: calc(1rem);
    }

    .psdk-default-form-two-column {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: calc(1rem);
    }

    .psdk-default-form-three-column {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: calc(1rem);
    }

    .psdk-default-form-two-column .grid-column {
      grid-column: 1 / span 2;
    }

    .psdk-default-form-three-column .grid-column {
      grid-column: 1 / span 3;
    }
  </style>
`;
