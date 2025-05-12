import { css } from 'lit';

export const headerStyles = css`
  .cc-toolbar {
    display: flex;
    align-items: center;
    height: 64px;
    padding: 0px 20px;
    width: 100%;
    z-index: 5;
    color: white;
    background-color: var(--app-primary-color);

    h1 {
      font-size: 30px;
    }
  }

  .cc-icon {
    width: 40px;
    margin-bottom: 10px;
    filter: var(--app-white-color-filter);
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

  .margin {
    width: calc(100% - 100px);
    margin-left: 50px;
    margin-right: 50px;
  }

  button {
    background-color: inherit;
    color: #fafafa;
    border: 0;
  }
`;
