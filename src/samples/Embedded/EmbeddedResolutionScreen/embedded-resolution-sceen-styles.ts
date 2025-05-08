import { css } from 'lit';

export const embeddedResolutionScreenStyles = css`
  .cc-resolution {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 5rem;
  }

  .cc-card {
    display: flex;
    flex-direction: column;
    margin: 30px;
    width: 50%;
  }
  .cc-header {
    background-color: var(--app-primary-color);
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    padding: 30px;
    color: white;
    font-weight: bold;
    font-size: 60px;
  }

  .cc-body {
    font-size: 24px;
    border: 1px solid var(--app-primary-color);
    padding: 30px;
  }

  .cc-chat-image {
    width: 700px;
    border-radius: 10px;
    margin: 30px;
  }

  .cc-chat-button {
    color: white;
    background-color: var(--app-secondary-color);
    font-size: 25px;
    font-weight: bold;
    border-radius: 25px;
    border: 0px;
    margin: 20px;
    padding: 10px 30px;
  }

  .cc-body-uplus {
    font-size: 18px;
    padding: 30px;
    margin: 0% 25% 0% 25%;;
    min-width: 40rem;
    background-color: #fafafa;
    text-align:center;
    border-radius: 0.3125rem;
  }
`;
