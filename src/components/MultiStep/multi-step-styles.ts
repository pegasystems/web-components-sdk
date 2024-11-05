import { html } from 'lit';

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
      content: '';
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
      white-space: nowrap;
      display: flex;
      align-items: center;
      text-align: left;
    }

    .psdk-horizontal-assignment {
      padding-left: 2rem;
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

    .psdk-horizontal-stepper {
      background-color: transparent;
      display: block;
    }

    .psdk-horizontal-stepper-header-container {
      white-space: nowrap;
      display: flex;
      align-items: center;
      text-align: left;
    }

    .psdk-horizontal-step-header {
      overflow: hidden;
      outline: none;
      cursor: pointer;
      position: relative;
      box-sizing: content-box;
      display: flex;
      height: 72px;
      overflow: hidden;
      align-items: center;
      padding: 0 24px;
    }

    .psdk-horizontal-step-icon {
      background-color: var(--app-neutral-color);
      color: #fff;
      border-radius: 50%;
      height: 24px;
      width: 24px;
      flex-shrink: 0;
      position: relative;
      display: block;
      margin-right: 8px;
      flex: none;
    }

    .psdk-horizontal-step-icon-content {
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .psdk-horizontal-step-icon-selected {
      background-color: var(--app-primary-color);
      color: #fff;
      border-radius: 50%;
      height: 24px;
      width: 24px;
      flex-shrink: 0;
      position: relative;
      display: block;
      margin-right: 8px;
      flex: none;
    }

    .psdk-horizontal-step-label {
      color: rgba(0, 0, 0, 0.54);
      display: inline-block;
      min-width: 50px;
      vertical-align: middle;
      font-size: 14px;
      font-weight: 500;
      white-space: initial;
    }

    .psdk-horizontal-step-label-selected {
      color: rgba(0, 0, 0, 0.87);
      display: inline-block;
      min-width: 50px;
      vertical-align: middle;
      font-size: 14px;
      font-weight: 500;
      white-space: initial;
    }

    .psdk-horizontal-step-line {
      border-top-color: rgba(0, 0, 0, 0.12);
      border-top-width: 1px;
      border-top-style: solid;
      flex: auto;
      height: 0;
      margin: 0 -16px;
      min-width: 32px;
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
