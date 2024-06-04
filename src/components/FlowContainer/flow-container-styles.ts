import { html } from '@lion/core';

export const flowContainerStyles = html`
  <style>
    h2 {
      font-size: 1.1rem;
    }

    .psdk-instruction-text {
    font-size: 0.90rem;
    font-weight: 400;
    margin-bottom: 1.0rem; 
    }

    .psdk-case-view-divider {
      border-bottom: 0.0625rem solid var(--app-neutral-light-color);
    }


    .psdk-flow-container-top {
      background-color: var(--app-form-color);
      //padding: 0rem 0.625rem 0.625rem 0.625rem;
      padding: 2rem;
      border-radius: 0.3125rem;

    }
    .psdk-flow-container {
      padding-left: 2.1875rem;
    }

    .psdk-message-card {
      margin: 10px;
      padding: 16px;
    }

    .psdk-message {
      margin-top: .2rem;
    }

    .psdk-icon {
      width: 3rem;
      display: inline-block;
      padding: 0rem 0.6rem;
      filter: var(--app-primary-color-filter);
    }

  </style>
`;
