import { html } from 'lit';

export const appEntryStyles = html`
  <style>
    .portal-load-error {
      height: 100vh;
      width: 100vw;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 1em;
      font-size: 2em;
      padding: 2em;
      box-sizing: border-box;
      text-align: center;
      font-weight: 500;
      letter-spacing: 0.5px;
      color: var(--app-error-light-color);
    }

    .portal-load-error .portal-name {
      font-style: italic;
      color: var(--app-warning-color-dark);
    }

    .logout-btn {
      position: absolute;
      top: 1.5em;
      right: 1em;
      background: none;
      font-size: 1em;
      border: 3px solid var(--app-neutral-color);
      border-radius: 10px;
      padding: 8px 2em;
      color: var(--app-warning-color);
      font-weight: 500;
      letter-spacing: 0.5px;
      cursor: pointer;
    }

    .logout-btn:hover {
      background: var(--app-warning-color-dark);
      color: var(--app-form-color);
    }

    .portals-list {
      display: flex;
      justify-content: center;
      align-content: center;
      gap: 1em;
      color: var(--app-primary-light-color);
      text-decoration: underline;
    }

    .portal-list-item:hover {
      cursor: pointer;
      color: var(--app-primary-dark-color);
    }
  </style>
`;
