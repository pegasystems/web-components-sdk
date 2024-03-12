import {  html  } from "lit";

export const boilerplateStyles = html`
  <style>
    /* Due to shadow DOM scoping: from this component through all children, apply a background-color */
/*
    * {
      background-color: orange;
    }
*/

    .boilerplate-class {
      font-size: 16px;

      background-color: var(--app-neutral-light-color);
      padding: 1.0rem;
      margin: 0.5rem;
      border-radius: 0.6125rem;
    }
  </style>
`;
