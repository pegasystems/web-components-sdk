import { html } from "lit";

export const multiStepStyles = html`
  <style>
    .psdk-vertical-step {
      position: relative;
      margin-left: 0.4375rem;
      display: flex;
      flex-direction: column;
    }

    .psdk-vertical-assignment {
      padding-left: 2rem;
    }

    /* makes the line between nodes*/
    .psdk-vertical-step::before {
      content: "";
      display: block;
      position: absolute;
      z-index: 0;
      width: 0.0625rem;
      height: 100%;
      top: calc(3 * 0.5rem);
      background-color: var(--app-neutral-color);
      transition: all calc(2 * 0.25s) cubic-bezier(0.4, 0.6, 0.1, 1);
    }

    /* hides line after later last node*/
    .psdk-vertical-step:last-child::before {
      display: none;
    }

    .psdk-vertical-header-step {
      height: calc(6 * 0.5rem);
      display: flex;
      align-items: center;
    }

    .psdk-vertical-step-name {
      margin-left: 0.5rem;
    }

    .psdk-vertical-marker {
      margin-left: calc(0.9375rem / 2 * -1);
      transition: all calc(2 * 0.25s) cubic-bezier(0.4, 0.6, 0.1, 1);
      display: block;
      position: relative;
      z-index: 1;
      width: 0.9375rem;
      height: 0.9375rem;
      border-radius: 100%;
      background: white;
    }

    ::before {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    .v-success {
      border: 0.15rem solid var(--app-primary-color);
    }

    .v-sub {
      margin-left: calc(0.4375rem / 2 * -1);
      width: 0.4375rem;
      height: 0.4375rem;
    }

    .v-current {
      background: var(--app-primary-color);
      border: 0.0625rem solid var(--app-primary-color);
    }

    .v-future {
      border: 0.0625rem solid var(--app-neutral-color);
    }

    .psdk-horizontal-progress {
      position: relative;
      padding: calc(2 * 0.5rem) 0.5rem;
    }

    .psdk-horizontal-steps {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      width: 100%;
    }

    .psdk-horizontal-assignment {
      padding-left: 2rem;
    }

    .psdk-horizontal-header-step {
      padding: 0.5rem;
      height: auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      flex-basis: 0;
      max-width: 100%;
      min-width: 0;
    }

    .psdk-horizontal-header-step-first {
      padding: 0.5rem;
      height: auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      flex-basis: 0;
      max-width: 100%;
      min-width: 0;
    }

    .psdk-horizontal-header-step-last {
      padding: 0.5rem;
      height: auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-end;
      flex-basis: 0;
      max-width: 100%;
      min-width: 0;
    }

    .psdk-horizontal-step-name {
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      line-height: 1.2em;
      text-transform: capitalize;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: all calc(2 * 0.25s) cubic-bezier(0.4, 0.6, 0.1, 1);
    }

    .psdk-horizontal-marker {
      transition: all calc(2 * 0.25s) cubic-bezier(0.4, 0.6, 0.1, 1);
      display: block;
      position: relative;
      z-index: 1;
      width: 0.9375rem;
      height: 0.9375rem;
      border-radius: 100%;
      background: white;
    }

    .psdk-horizontal-bar {
      position: absolute;
      height: 0.0625rem;
      bottom: 2rem;
      background: #cfcfcf;
      left: 2rem;
      right: calc(2% + 0.8rem);
    }

    .h-success {
      border: 0.15rem solid var(--app-primary-color);
    }

    .h-sub {
      margin-left: calc(0.4375rem / 2 * -1);
      width: 0.4375rem;
      height: 0.4375rem;
    }

    .h-current {
      background: var(--app-primary-color);
      border: 0.0625rem solid var(--app-primary-color);
    }

    .h-future {
      border: 0.0625rem solid var(--app-neutral-color);
    }
  </style>
`;

