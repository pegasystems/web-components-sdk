import {  html } from "lit";

export const detailsTwoColumnStyles = html`
  <style>
    .psdk-grid-filter {
      display: grid;
      grid-template-columns: repeat(2,minmax(0,1fr));
      column-gap: calc(2 * 0.5rem);
      row-gap: calc(2 * 0.5rem);
      align-items: start;
    }
  </style>
`
