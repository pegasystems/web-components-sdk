import { html } from '@lion/core';

export const actionButtonsStyles = html`
  <style>
    .nq_button_grid {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }

    .btn-secondary {
      border-radius: 25px !important;
      border: 1px solid #CE2525 !important;
      color: #CE2525 !important;
      min-width: 6rem !important;
      background: none !important;
    }
    
    .btn-primary {
      border-radius: 25px !important;
      border: 1px solid #CE2525 !important;
      color: white !important;
      min-width: 6rem !important;
      background: #CE2525 !important;
    }

    button:focus {
      outline: none;
      box-shadow: none !important;
    }
  </style>
`;