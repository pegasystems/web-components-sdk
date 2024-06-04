import { html } from '@lion/core';

export const mashupMainStyles = html`
  <style>

.toolbar-spacer {
    flex: 1 1 auto;
}

.progress-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    background-color: whitesmoke;
    position: fixed;
    z-index: 99999;
    top: 0px;
    left: 0px;
    opacity: 0.5;
}

.progress-spinner {
    text-align: center;
}

.example-container {
    min-height: 100%;
    height: 100%;
  }


  .psdk-aside {
      height: calc(100% - 64px);
      width: 12.5rem;
      border-right: 1px solid lightgray;
  }

  .psdk-main {
      height: calc(100% - 64px);
      width: calc(100% - 12.5rem);
  }

  h1 {
    font-size: 30px;
  }

  .cc-toolbar {
    display: flex;
    align-items: center;
    height: 64px;
    padding: 0px 20px;
    width: 100%;
    z-index: 5;
    color: white;
    background-color: var(--app-primary-color);
  }

  .uplus-toolbar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    // align-items: center;
    height: 64px;
    padding: 0px 20px;
    width: 100%;
    z-index: 5;
    color: white;
    // background-color: var(--app-primary-color);
  }

  .cc-toolbar-row {
      height: 100px;
  }

  .cc-main {
    display: flex; 
    height: calc(100% - 100px);
    top: 100px;
    position: relative;
  }

  .cc-icon {
    width: 40px;
    margin-bottom: 10px;
    filter: var(--app-white-color-filter);
  }

  .uplus-icon {
    width: 150px;
    margin-bottom: 10px;
    // filter: var(--app-white-color-filter);
  }

  ul {
    list-style-type: none;
    margin: 0;
    padding: 20px;
    overflow: hidden;
  }
  
  li {
    float: left;
    padding-left: 20px;
    padding-right: 20px;
    font-size: larger;
  }

  // .cc-main-screen {
  //   display: flex; 
  //   flex-direction: column;
  //   position: relative;
  //   width: 100%;
  // }

  // .cc-main-div {
  //   width: 100%;
  //   overflow-y: auto;
  //   overflow-x: hidden;  
  // }

  .margin{
    width: calc(100% - 100px);
    margin-left: 50px;
    margin-right: 50px;
  }

  button{
    background-color:inherit;
    color: #fafafa;
    border: 0;
  }
  </style>
`;