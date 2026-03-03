import { html } from 'lit';

export const assignmentStyles = html`
  <style>
    .boilerplate-class {
      font-size: 16px;

      background-color: var(--app-neutral-light-color);
      padding: 1rem;
      margin: 0.5rem;
      border-radius: 0.6125rem;
    }

    /* ── Banner / alert styles (shared with FlowContainer) ──
       These mirror the .psdk-alert-* classes used for server-side
       page message banners so field-level validation errors have
       the exact same visual appearance. */

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

    .psdk-alert-message {
      display: flex;
      align-items: center;
    }
  </style>
`;
