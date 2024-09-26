import { html } from 'lit';

export const autoCompleteStyles = html`
  <style>
    .psdk-full-width {
      width: 100%;
    }

    .psdk-label-readonly {
      font-size: 1rem;
      display: block;
      transform: translateY(-1.28125em) scale(0.75) perspective(100px) translateZ(0.001px);
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
  </style>
`;
