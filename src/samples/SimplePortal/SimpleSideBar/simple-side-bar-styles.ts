import { html } from 'lit';

export const simpleSideBarStyles = html`
  <style>
    h2 {
      margin: 0px 0px;
      font-size: 20px;
    }

    .psdk-create-work-button {
      padding: 5px;
    }

    .psdk-open-work-button {
      padding: 1px;
    }

    .psdk-create-work {
      height: 100px;
      overflow-y: auto;
    }

    .psdk-worklist {
      height: calc(100% - 132px);
      overflow-y: auto;
    }

    .psdk-btn-text {
      text-align: left;
    }
  </style>
`;
