import { html } from 'lit';

export const caseViewStyles = html`
  <style>
    /* See https://www.npmjs.com/package/@material/mwc-top-app-bar-fixed for info about applying colors */
    mwc-top-app-bar-fixed {
      --mdc-theme-primary: var(--app-primary-color);
      --mdc-theme-on-primary: var(--app-form-color);
    }

    .psdk-case-view-label {
      font-size: 1rem;
      display: block;
      transform: translateY(0.2em) scale(0.75) perspective(100px) translateZ(0.001px);
      -ms-transform: translateY(0.2em) scale(0.75);
      width: 133.33333%;
    }

    .psdk-case-view {
      box-sizing: border-box;
      display: flex;
    }

    .psdk-case-view-toolbar {
      display: flex;
      flex-direction: row;
      color: var(--app-form-color);
      background-color: var(--app-primary-color);
      padding: 1rem;
    }

    .psdk-case-icon-div {
      background-color: var(--app-primary-dark-color);
      border-radius: 0.3rem;
      padding: 0.5rem 0.5rem 0.5rem 0.5rem;
    }
    .psdk-case-svg-icon {
      width: 2rem;
      /* padding: 0rem 0.3125rem; */
      filter: var(--app-white-color-filter);
    }

    .psdk-case-view-heading {
      display: block;
      text-align: left;
      padding-left: 0.75rem;
    }

    .psdk-case-view-heading-id {
      font-size: 0.9rem;
      font-weight: 300;
      line-height: 1.5rem;
    }

    .psdk-case-view-heading-h1 {
      font-size: 1.1rem;
      line-height: 1.5rem;
      font-weight: 500;
    }

    .psdk-case-view-info-box {
      display: flex;
      flex-direction: row;
      padding: 0rem 0.3125rem 0rem 0rem;
    }

    .psdk-case-view-info {
      flex: 0 0 auto;
      float: left;
      padding: 0rem 0.3125rem 0rem 0rem;
      height: 100%; /* Should be removed. Only for demonstration */
      background-color: var (--app-form-color);
      width: 25%;
    }

    .psdk-case-view-main {
      flex-grow: 2;
      float: left;
      padding: 0rem 0.3125rem;
      height: 100%; /* Should be removed. Only for demonstration */
      width: 50%;
    }

    .psdk-case-view-buttons {
      display: flex;
      justify-content: flex-start;
      padding: 0.3125rem;
    }

    .psdk-case-view-utilities {
      margin: 0.625rem 0rem;
      float: left;
      padding: 0rem 0.3125rem;
      height: 100%; /* Should be removed. Only for demonstration */
      width: 25%;
    }

    .psdk-case-view-divider {
      border-bottom: 0.0625rem solid var(--app-neutral-light-color);
    }

    .psdk-status {
      padding: 0.3125rem 0.3125rem;
      background-color: var(--app-primary-color);
      color: white;
      width: fit-content;
      margin: 0.625rem;
    }

    button {
      margin: 0rem 0.3125rem;
    }

    .psdk-action-menu-content {
      display: none;
      position: absolute;
      background-color: #f1f1f1;
      left: 100px;
      top: 100px;
      min-width: 160px;
      box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
      z-index: 1;
      text-align: left;
    }

    .psdk-action-menu-content.show {
      display: block;
    }

    .psdk-action-menu-content a {
      color: black;
      padding: 12px 16px;
      text-decoration: none;
      display: block;
    }

    .psdk-action-menu-content a:hover {
      background-color: #ddd;
    }
  </style>
`;
