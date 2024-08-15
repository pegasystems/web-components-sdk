import { html } from "lit";

export const todoStyles = html`
  <style>
    .psdk-display-divider {
      border-bottom: 0.0625rem solid var(--app-neutral-light-color);
    }

    .psdk-todo {
      padding: 0.5rem;
    }

    .psdk-todo-header {
      display: inline-flex;
    }

    .psdk-todo-text {
      padding: 0.5rem 0.625rem;
      font-size: 1.1rem;
      font-weight: bold;
    }

    .psdk-assignment-count {
      background-color: var(--app-primary-light-color);
      margin: 0.5rem;
      border-radius: 45%;
      padding: 0.15rem 0.4rem;
    }

    .psdk-todo-id {
      color: var(--app-primary-color);
      cursor: pointer;
    }

    .psdk-avatar {
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
      display: flex;
      background: var(--app-primary-color);
      color: white;
      font-weight: bold;
      font-size: 1.25rem;
    }

    .psdk-todo-assignment {
      display: inline-flex;
      width: 100%;
      padding: 0.625rem 0rem;
    }

    .psdk-todo-assignment-data {
      display: inline-flex;
    }

    .psdk-todo-assignment-status {
      background-color: var(--app-neutral-light-color);
      border-radius: 0.125rem;
      color: darkslategray;
      font-size: 0.75rem;
      font-weight: bold;
      line-height: calc(0.5rem * 2.5);
      height: calc(0.5rem * 2.5);
      padding: 0 0.5rem;
      text-transform: uppercase;
    }

    .psdk-todo-assignment-task {
      color: var(--app-neutral-color);
    }

    .psdk-todo-assignment-action {
      display: inline-flex;
    }

    .psdk-todo-card {
      width: 100%;
      padding-left: 0.625rem;
    }

    .psdk-todo-show-more {
      width: 100%;
      text-align: center;
    }
  </style>
`;

