import { html } from "lit";

export const pulseStyles = html`
  <style>
    /* Due to shadow DOM scoping: from this component through all children, apply a background-color */

    * {
      background-color: lightskyblue;
    }
  </style>
`;

