import { html } from '@lion/core';

export const caseOperatorStyles = html`
  <style>
    /* Due to shadow DOM scoping: from this component through all children, apply a background-color */
/*
    * {
      background-color: palegoldenrod;
    }
*/

    .psdk-operator {
    display: flex;
    flex-direction: row;
    /* font-size: 0.8rem; */
    color: $app-neutral-color;
    }

    .psdk-operator-popover {
        display: table;
        margin: auto;
        min-width: 100px;
        background-color: white;
        border: 1px solid black;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 0 10px 3px #777;
        position: absolute;
        z-index: 99;
    }

    .psdk-operator-name {
        color: $app-neutral-color;
    }

    .psdk-operator-value {
        padding-left: 5px;
        color: $app-neutral-dark-color
    }


    .psdk-single {
        flex: 1;
    }

    .psdk-double {
        flex: 2;
    }

    .psdk-top-pad {
        padding-top: 10px;
    }

    dl {
        display: grid;
        grid-template-columns: auto 1fr;
        grid-column-gap: calc(2 * 0.5rem);
        grid-row-gap: calc(1 * 0.5rem);
    }

    dl::before, dl::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    dt {
        max-width: 20ch;
        grid-column-start: 1;
    }

    dd {
        max-width: 75ch;
        grid-column-start: 2;
    }   
 
  </style>
`;