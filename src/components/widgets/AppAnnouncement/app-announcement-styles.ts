import { html } from '@lion/core';

export const appAnnouncementStyles = html`
  <style>
    h2 {
      font-size: 1.2rem;
      margin-block-start: 0rem;
    }

    h3 {
      font-size: 1.1rem;
    }
    ul {
      padding-inline-start: 20px;
    }
    .psdk-announcement {
      background-color: var(--app-primary-light-color);
      padding: 1rem;
      margin: 0.5rem;
      border-radius: 0.6125rem;
    }
  </style>
`;
