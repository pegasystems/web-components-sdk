import {  html } from "lit";

export const modalViewContainerStyles = html`
  <style>

  .psdk-dialog-background {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    background-color: rgba(100,100,100, 0.4);
    position: fixed;
    z-index: 999;
    top: 0px;
    left: 0px;
}

.psdk-modal-view-container-top {
    display: table;
    margin: auto;
    min-width: 650px;
    background-color: white;
    border: 1px solid black;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 0 10px 3px #777;
}

.psdk-dialog-float {
    position: absolute;
}  


  </style>
`;
