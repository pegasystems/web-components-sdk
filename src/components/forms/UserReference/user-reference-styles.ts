import { html } from '@lion/core';

export const userReferenceStyles = html`
  <style>
    /* Due to shadow DOM scoping: from this component through all children, apply a background-color */
    /*
    * {
      background-color: orange;
    }
*/
    .psdk-user-reference {
      display: flex;
      flex-direction: row;
      font-size: 0.8rem;
      color: var(--app-neutral-color);
    }
    .psdk-single {
      flex: 1;
    }

    .psdk-double {
      flex: 2;
    }

    .psdk-top-pad {
      padding-top: 10px;
    }

    dt {
      flex: 1;
    }

    dd {
      flex: 2;
    }
  </style>
`;
