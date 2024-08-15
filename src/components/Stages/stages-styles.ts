import { html } from "lit";

export const stagesStyles = html`
  <style>
    .psdk-stages-full {
      display: block;
    }

    .psdk-stages-divider {
      border-bottom: 0.0625rem solid var(--app-neutral-light-color);
    }

    .psdk-stages-icon {
      width: 1.4rem;
      display: inline-block;
    }

    .psdk-stages-bar {
      margin: 1rem 0rem;
      background-color: rgb(255, 255, 255);
      border-radius: 0.5rem;
      border: 0.0625rem solid var(--app-neutral-light-color);
      overflow: hidden;
      display: flex;
    }

    .psdk-stages-chevron {
      position: relative;
      height: calc(2rem);
      padding: calc(1rem);
      display: flex;
      justify-content: center;
      align-items: center;
      max-width: 100%;
      min-width: 0px;
      flex-grow: 1;
      flex-shrink: 1;
    }

    .psdk-stages-chevron:not(:last-child)::after {
      content: "";
      position: absolute;
      display: block;
      z-index: 2;
      width: calc(1.75rem);
      height: calc(1.75rem);
      right: calc(-0.4375rem);
      background: inherit;
      border-style: solid;
      border-color: rgb(207, 207, 207);
      border-width: 0.0625rem 0.0625rem 0px 0px;
      border-radius: 0px calc(0.3125rem) 0px 0px;
      transform: rotateZ(45deg) skew(15deg, 15deg);
    }

    .psdk-stages-inner-past {
      color: black;
    }

    .psdk-stages-inner-present {
      color: var(--app-primary-color);
      font-weight: bold;
    }
    .psdk-stages-inner-future {
      color: var(--app-neutral-color);
    }
  </style>
`;

