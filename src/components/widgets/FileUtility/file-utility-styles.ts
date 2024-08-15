import { html } from "lit";

export const fileUtilityStyles = html`
  <style>
    .psdk-dialog-background {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 100%;
      background-color: rgba(100, 100, 100, 0.4);
      position: fixed;
      z-index: 999;
      top: 0px;
      left: 0px;
    }

    .psdk-modal-file-top {
      display: table;
      margin: auto;
      min-width: 650px;
      background-color: white;
      border: 1px solid black;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 0 10px 3px #777;
    }

    .psdk-modal-link-top {
      display: table;
      margin: auto;
      min-width: 650px;
      background-color: white;
      border: 1px solid black;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 0 10px 3px #777;
    }

    .psdk-modal-body {
      max-height: 500px;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .psdk-view-all-header {
      display: flex;
      justify-content: space-between;
    }

    .psdk-view-all-close-icon {
      width: 1.5rem;
    }

    .psdk-view-all-body {
      max-height: 500px;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .psdk-links-two-column {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: calc(1rem);
      flex: 2;
    }

    .psdk-modal-links-row {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }

    .psdk-links-add-link {
      padding: 15px;
    }

    ul {
      columns: 2;
      -webkit-columns: 2;
      -moz-columns: 2;
    }
  </style>
`;

