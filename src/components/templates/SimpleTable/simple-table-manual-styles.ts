import { html } from "@lion/core";

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
  </style>
`;
