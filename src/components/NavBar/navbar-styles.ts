import { html } from 'lit';

export const navbarStyles = html`
  <style>
    .psdk-nav-divider {
      border-bottom: 0.0625rem solid var(--app-nav-color);
      width: 100%;
    }

    .psdk-nav-header {
      display: flex;
      padding-top: 0.625rem;
    }

    .psdk-nav-logo {
      /* override vertical-align coming in from Bootstrap "reboot" */
      vertical-align: baseline;

      width: 3.5rem;
      margin-left: 0.5rem;
      margin-right: 0.5rem;
      margin-top: 0.25rem;
      margin-bottom: 0.25rem;

      padding-left: 0.5rem;
      padding-right: 0.5rem;
    }

    /* background color white */
    .psdk-nav-svg-icon {
      filter: var(--app-white-color-filter);
      width: 1.6rem;
      padding-right: 0.625rem;
    }

    .psdk-nav-portal-info {
      margin-top: 0.15rem;
      margin-bottom: 0.25rem;
      padding-left: 0.15rem;
      padding-right: 0.5rem;
    }

    .psdk-nav-portal-name {
      font-size: 1rem;
    }

    .psdk-nav-portal-app {
      font-size: 1rem;
    }

    .psdk-appshell-nav {
      top: 0px; /* JEA */
      position: relative; /* JEA was fixed */
      z-index: 3;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      background: var(--app-nav-bg);
      height: 100%;
      color: var(--app-nav-color);
      overflow: hidden;
      white-space: nowrap;
      width: var(--app-nav-width-expanded);
    }

    .psdk-appshell-topnav {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      background: var(--app-nav-bg);
      width: var(--app-nav-width);
      height: 15%;
      color: var(--app-nav-color);
      overflow: hidden;
      white-space: nowrap;
      transition: width var(--transition-medium) var(--natural-ease);
      will-change: width;
    }

    .psdk-appshell-middlenav {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: var(--app-nav-bg);
      width: var(--app-nav-width);
      height: 50%;
      color: var(--app-nav-color);
      overflow: hidden;
      white-space: nowrap;
      transition: width var(--transition-medium) var(--natural-ease);
      will-change: width;
    }

    .psdk-appshell-bottom {
      /* to make NavBar logout button stay fixed to bottom of window */
      position: fixed;
      bottom: 0px;
      background: var(--app-nav-bg);
      width: inherit;
      border-top: 0.0625rem solid var(--app-nav-color);
    }

    /* Added for nav bar buttons to be like middlenav but with no additional flex direction and left justify */
    .psdk-appshell-buttonnav {
      /* display: flex;
        flex-direction: row; */
      border: none;
      justify-content: left;
      background: var(--app-nav-bg);
      width: var(--app-nav-width);
      height: 50%;
      color: var(--app-nav-color);
      overflow: hidden;
      white-space: nowrap;
      transition: width var(--transition-medium) var(--natural-ease);
      will-change: width;
    }

    .psdk-nav-ul-middle {
      display: block;
      list-style-type: none;
      margin: 0rem;
      padding-inline-start: 30px;
    }

    .psdk-nav-li-middle {
      box-sizing: border-box;
      text-align: left;
    }

    .psdk-icon {
      padding: 0rem 0.125rem;
      min-width: unset;
    }

    .psdk-nav-button-span {
      padding: 1rem;
    }

    .psdk-nav-oper-avatar {
      margin: 0rem;
      padding: 0rem;
      min-width: 2.5rem;
      min-height: 2.5rem;
      max-width: 2.5rem;
      max-height: 2.5rem;
      border-radius: 50%;
      justify-content: center;
      align-items: center;
      text-align: center;
      display: inline-flex;
      background: var(--app-neutral-color);
      color: white;
      font-weight: normal;
      font-size: 1rem;
    }
  </style>
`;
