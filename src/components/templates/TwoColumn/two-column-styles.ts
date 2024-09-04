import { html } from 'lit';

export const twoColumnStyles = html`
  <style>
    * {
      box-sizing: border-box;
    }

    .psdk-two-column {
      display: flow-root;
      height: 100%;
    }

    /* Create two equal columns that floats next to each other */
    .psdk-two-column-column {
      width: 50%;
      float: left;
      padding: 0rem 0.3125rem;
      height: 100%;
    }

    .psdk-two-column-left {
      float: left;
      min-width: 50%;
      padding: 0rem 0.3125rem;
    }

    .psdk-two-column-right {
      float: left;
      width: 50%;
      padding: 0rem 0.3125rem;
    }
  </style>
`;
