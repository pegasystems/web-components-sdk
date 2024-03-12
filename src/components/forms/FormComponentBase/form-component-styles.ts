import { css } from 'lit';

// NOTE: formComponentStyles is added to the static styles property of BridgeBase
//  to give additional styles to Form Components.

export const formComponentStyles = css`
  /* Indicate that an element (typically a field on a form) needs to be fixed - validation problem */
  .field-needs-attention {
    border: 2px solid var(--app-error-light-color);
    border-radius: 0.5rem;
    padding: 5px;
  }`;
