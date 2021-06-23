import { html } from '@lion/core';

export const viewContainerStyles = html`
  <style>
    h4 {
        margin-top: 0.8rem;
        margin-left: 0.8rem;
    }

    .psdk-view-container-top {
        padding: 0;
    }

    .progress-box {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 100%;
      background-color: rgba(245, 245, 245, 0.5); /* whitesmoke as rgba to let spinner be fully opaque */
      position: fixed;
      z-index: 99999;
      top: 0rem;
      left: 0rem;
    }        

  </style>
`;