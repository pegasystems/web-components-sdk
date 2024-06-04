import { html } from '@lion/core';

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
      transform: translateY(-1.28125em) scale(.75) perspective(100px) translateZ(.001px);
      -ms-transform: translateY(-1.28125em) scale(.75);
      width: 133.33333%;
    }


    .psdk-data-readonly {
      padding-top: 0.625rem;
      width: 100%;
    }

    .check-box-form {
      /* margin-left: 20px; */
      //margin-top: 15px;
      //margin-bottom: 5px;
      margin-bottom: 0.5rem;
    }

    lion-checkbox input{
      height: 18px;
      width: 18px;
    }

    lion-checkbox{
      line-height: 30px;
      align-items: center;
      gap: 0.5rem;
    }
  </style>
`;