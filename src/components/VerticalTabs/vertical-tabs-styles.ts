import { html } from 'lit';

export const verticalTabsStyles = html`
  <style>
    button {
      background-color: transparent;
    }

    button:active,
    input[type='button']:active,
    button:focus,
    input[type='button']:focus {
      outline: none;
    }

    .psdk-vertical-tabs {
      display: flex;
      flex-direction: column;
    }

    .psdk-tab-selected {
      position: relative;
      background: none;
      border: 0.125rem solid transparent;
      border-style: inset;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-style: solid;
      color: #000000;
      border-width: 0.0625rem 0;
      border-color: #cfcfcf;
      height: calc(5.5 * 0.5rem);
      margin-top: -0.0625rem;
      padding: 0 calc(2 * 0.5rem);
      font-weight: bold;
      white-space: nowrap;
    }

    .psdk-tab-selected::after {
      content: '';
      position: absolute;
      display: block;
      top: 0;
      bottom: 0;
      right: 0;
      width: 0.25rem;
      background: var(--app-primary-color);
    }

    .psdk-tab-unselected {
      position: relative;
      background: none;
      border: 0.125rem solid transparent;
      border-style: inset;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-style: solid;
      color: #000000;
      border-width: 0.0625rem 0;
      border-color: #cfcfcf;
      height: calc(5.5 * 0.5rem);
      margin-top: -0.0625rem;
      padding: 0 calc(2 * 0.5rem);
      font-weight: bold;
      white-space: nowrap;
    }
  </style>
`;
