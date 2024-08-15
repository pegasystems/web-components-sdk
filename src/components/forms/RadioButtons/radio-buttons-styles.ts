import { html } from "lit";

export const radioButtonStyles = html`
  <style>
    .psdk-label-readonly {
      font-size: 1rem;
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

    .mat-form-field-infix {
      width: auto;
    }

    .psdk-radio-horizontal {
      display: flex;
      flex-direction: row;
    }

    .psdk-radio-vertical {
      display: flex;
      flex-direction: column;
    }

    .psdk-radio-button {
      padding: 0.3125rem;
    }

    .psdk-radio-form {
      width: 100%;
    }

    .psdk-radio-form .mat-form-field-underline {
      background-color: transparent;
    }

    .psdk-radio-form .mat-form-field-label {
      top: 0em;
    }

    .radio-group-form {
      margin-left: 25px;
      margin-top: 5px;
      margin-bottom: 15px;
    }

    .radio-group-label {
      color: var(--app-neutral-color);
      font-weight: var(--font-weight-normal);
    }
  </style>
`;

