import { html } from '@lion/core';

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

  </style>
`;