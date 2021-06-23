import { html } from '@lion/core';

export const simpleMainStyles = html`
  <style>

  h1 {
      font-size: 20px;
    }

  .psdk-toolbar {
    display: flex;
    align-items: center;
    height: 64px;
    padding: 0px 20px;
    width: 100%;
    z-index: 5;
    color: white;
    background-color: var(--app-primary-color);
  }

 .psdk-main {
  display: flex;
  height: 100%;
 }

 .psdk-main-root {
   height: 100%;
   width: 100%;
 }

  </style>
`;