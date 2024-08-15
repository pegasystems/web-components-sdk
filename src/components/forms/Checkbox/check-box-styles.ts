import { html } from "lit";

export const checkboxStyles = html`
  <style>
    .psdk-full-width {
      min-width: 9.375rem;
      width: 100%;
      text-align: left;
    }

    .psdk-label-readonly {
      top: 0rem;
      margin-top: 0.625rem;
      font-size: 0.875rem;
      display: block;
      transform: translateY(-1.28125em) scale(0.75) perspective(100px)
        translateZ(0.001px);
      -ms-transform: translateY(-1.28125em) scale(0.75);
      width: 133.33333%;
    }

    .psdk-data-readonly {
      padding-top: 0.625rem;
      width: 100%;
    }

    .check-box-form {
      /* margin-left: 20px; */
      margin-top: 15px;
      margin-bottom: 5px;
    }
  </style>
`;

