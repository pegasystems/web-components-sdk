import { css } from 'lit';

export const mainScreenStyles = css`
  .cc-banner {
    font-size: 24px;
    text-align: center;
    width: 100%;
    padding: 20px;
  }

  .cc-main-screen {
    display: flex;
    flex-direction: column;
    height: calc(100% - 100px);
    position: relative;
    width: 100%;
  }

  .cc-main-div {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .cc-work-button {
    font-size: 22px;
    color: var(--app-primary-color);
    text-decoration: underline;
    padding-top: 10px;
  }

  .cc-work-ready {
    font-size: 22px;
    padding: 20px 20px 0px 40px;
  }

  .cc-info {
    display: flex;
    flex-direction: row;
  }

  .cc-info-pega {
    width: 50%;
    display: flex;
    flex-direction: column;
  }

  .cc-info-banner {
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }

  .cc-info-banner-text {
    font-size: 30px;
    line-height: 40px;
    padding: 20px 20px;
    color: darkslategray;
  }

  .cc-info-image {
    width: 100%;
    border-radius: 10px;
  }
`;
