import { html } from 'lit';

export const flowContainerStyles = html`
  <style>
    h2 {
      font-size: 1.1rem;
    }

    .psdk-instruction-text {
      font-size: 0.9rem;
      font-weight: 400;
      margin-bottom: 1rem;
    }

    .psdk-case-view-divider {
      border-bottom: 0.0625rem solid var(--app-neutral-light-color);
    }

    .psdk-flow-container-top {
      background-color: var(--app-form-color);
      padding: 0rem 0.625rem 0.625rem 0.625rem;
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
      margin-top: 0.2rem;
    }

    .psdk-icon {
      width: 3rem;
      display: inline-block;
      padding: 0rem 0.6rem;
      filter: var(--app-primary-color-filter);
    }

    .psdk-alert {
      border: 1px solid;
      display: flex;
      align-items: center;
      border-radius: 4px;
      padding: 10px;
      margin: 5px 0px;
    }

    .psdk-alert-icon {
      margin-right: 10px;
      border-radius: 50%;
      border: 1px solid var(--app-alert-icon-border-color);
      height: 15p;
      padding: 0 7.5px;
    }

    .psdk-alert-urgent {
      color: rgb(82, 21, 8);
      border: 1px solid rgb(207, 53, 22);
      --app-alert-icon-border-color: rgb(207, 53, 22);
    }

    .psdk-grid-warning {
      color: rgb(102, 60, 0);
      border: 1px solid #ff9800;
      --app-alert-icon-border-color: #ff9800;
    }

    .psdk-grid-success {
      color: rgb(2, 46, 9);
      border: 1px solid rgb(6, 116, 23);
      --app-alert-icon-border-color: rgb(6, 116, 23);
    }

    .psdk-grid-info {
      color: rgb(13, 60, 97);
      border: 1px solid #2196f3;
      --app-alert-icon-border-color: #2196f3;
    }
  </style>
`;
