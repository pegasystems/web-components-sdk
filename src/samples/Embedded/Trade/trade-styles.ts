import { css } from 'lit';

export const tradeStyles = css`
  .cc-banner {
    font-size: 20px;
    // text-align: center;
    width: 100%;
    padding: 20px;
    color: var(--app-form-color);
  }

  .cc-main-screen {
    display: flex;
    flex-direction: column;
    height: calc(100% - 100px);
    position: relative;
    width: 100%;
  }

  .cc-main-div {
    overflow-y: auto;
    overflow-x: hidden;
    color: white;
    display: flex;
    justify-content: center;
    padding-top: 4rem;
  }

  .vl {
    border-left: 1px solid white;
    height: 4rem;
  }

  .text-align {
    text-align: center;
  }

  .get-started-button {
    background: none;
    border: none;
    font-size: 14px;
    justify-content: start;
    display: flex;
    margin-top: 10px;
    color: #253278;
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

  .uplus-info-pega {
    min-width: 40rem;
    display: flex;
    flex-direction: column;
  }

  .cc-info-banner {
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .cc-info-banner-text {
    font-size: 30px;
    line-height: 40px;
    padding: 20px 20px;
    color: darkslategray;
  }

  .cc-info-image {
    // width: 700px;
    margin: 20px;
    border-radius: 10px;
  }

  .card {
    display: flex;
    width: 32rem;
    border: 1px solid lightgray;
    border-radius: 10px;
    background-color: #fafafa;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    padding: 20px;
    margin-top: 2rem;
    color: black !important;
  }

  .cc-info {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 5rem;
  }

  .cc-resolution {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 5rem;
  }

  .cc-body-uplus {
    font-size: 18px;
    padding: 30px;
    margin: 0% 25% 0% 25%;
    min-width: 40rem;
    background-color: #fafafa;
    text-align: center;
    border-radius: 4px;
  }
`;
