import { html } from 'lit';

export const simpleTableManualStyles = html`
  <style>
    .psdk-no-records {
      text-align: center;
    }

    .label {
      font-size: 1.1rem;
    }

    .results-count {
      opacity: 0.7;
      font-size: 0.8rem;
      margin-inline-start: 0.625rem;
    }

    .psdk-utility-button {
      background: none;
      border: none;
      cursor: pointer;
    }

    .psdk-utility-card-action-svg-icon {
      width: 1.4rem;
      margin-top: 7px;
    }

    .psdk-table-actions {
    }

    .psdk-action-menu-content {
      display: none;
      position: absolute;
      background-color: #f1f1f1;
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
      cursor: pointer;
    }

    .psdk-action-menu-content a:hover {
      background-color: #ddd;
      text-decoration: none;
      color: black;
    }
  </style>
`;
