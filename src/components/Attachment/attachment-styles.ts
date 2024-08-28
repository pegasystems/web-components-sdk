import { html } from 'lit';

export const attachmentStyles = html`
  <style>
    /* Due to shadow DOM scoping: from this component through all children, apply a background-color */

    lion-button {
      background-color: transparent;
      padding-left: 0px;
      color: var(--app-primary-color);
    }

    lion-button:disabled,
    lion-button[disabled] {
      color: var(--app-neutral-light-color);
    }

    .psdk-modal-file-selector {
      border: 1px dashed var(--app-neutral-color);
      width: 100%;
      padding: 0.3rem;
      text-align: center;
      position: relative;
    }

    .psdk-full-width {
      width: 100%;
    }

    .psdk-label-readonly {
      opacity: 54%;
      font-size: 0.7rem;
    }

    .psdk-data-readonly {
      padding-top: 0.625rem;
      width: 100%;
    }

    .psdk-attachment-list {
      border: 1px solid var(--app-neutral-color);
    }

    ::ng-deep .mat-form-field-infix {
      width: auto;
    }
  </style>
`;
