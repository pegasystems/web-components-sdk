import {  html  } from "lit";

export const listViewStyles = html`
  <style>
    /* Due to shadow DOM scoping: from this component through all children, apply a background-color */
/*
    * {
      background-color: cornflowerblue;
    }
*/
    /* for vaadin-grid */

    /* based on this thread: https://github.com/vaadin/vaadin-grid/issues/786 */
    vaadin-grid tbody#items {
     box-sizing: content-box;
    }

    vaadin-grid-cell-content {
      cursor: pointer;
    }



    /* for use with "table" grid */
    table {
      width: 100%;
      border-collapse: collapse;
    }

    table th {
      padding: 5px;
      border: 1px solid silver; 
    }

    table td {
      padding: 5px;
      border: 1px solid silver; 
    }

  </style>
`;
