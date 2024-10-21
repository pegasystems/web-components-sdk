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
`;
