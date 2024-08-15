import { html } from "lit";

export const caseSummaryStyles = html`
  <style>
    .psdk-case-summary-info-box {
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
    }

    .psdk-case-summary-data {
      flex: 1;
    }

    .psdk-case-view-label {
      font-size: 1rem;
      display: block;
      transform: translateY(0.2em) scale(0.75) perspective(100px)
        translateZ(0.001px);
      -ms-transform: translateY(0.2em) scale(0.75);
      width: 133.33333%;
    }

    .psdk-label-readonly {
      font-size: 1rem;
      display: block;
      /*        
        transform: translateY(-1.28125em) scale(.75) perspective(100px) translateZ(.001px);
        -ms-transform: translateY(-1.28125em) scale(.75);
*/
      width: 133.33333%;
    }

    .psdk-data-readonly {
      padding-top: 0.625rem;
      width: 100%;
    }

    .psdk-status {
      background-color: var(--app-primary-color);
      color: white;
      padding: 0;
      margin-top: 0.625rem;
      width: fit-content;
    }

    .mat-form-field-infix {
      width: auto;
    }
  </style>
`;
