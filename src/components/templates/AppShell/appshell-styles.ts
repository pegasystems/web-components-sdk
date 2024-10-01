import { html } from 'lit';

export const appShellStyles = html`
  <style>
    .appshell-top {
      display: flex;
      background-color: var(--app-background-color);
    }

    .nav-bar {
      width: 10%;
    }

    .appshell-main {
      position: relative;
      min-height: 100vh;
      display: block;
      width: 90%;
    }

    .psdk-icon {
      padding: 0rem 0.125rem;
      min-width: unset;
    }

    .progress-box {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 100%;
      background-color: whitesmoke;
      position: fixed;
      z-index: 999;
      top: 0rem;
      left: 0rem;
      opacity: 0.5;
    }

    .progress-spinner {
      text-align: center;
    }

    ::ng-deep snack-bar-container.snackbar-newline {
      white-space: pre-line;
    }
  </style>
`;
