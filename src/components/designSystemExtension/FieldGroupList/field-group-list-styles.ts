import { LitElement, html, nothing, css } from "lit";
import { customElement, property } from "lit/decorators.js";

export const fieldGroupListStyles = html`
  <style>
    .field-group-list-item-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1em 0;
      font-weight: 500;
    }
    .psdk-utility-button {
      background: none;
      border: none;
      cursor: pointer;
      display: flex;
    }
    .psdk-utility-card-action-svg-icon {
      width: 1.4rem;
    }
    .btn {
      display: inline-block;
      text-align: center;
      vertical-align: middle;
      user-select: none;
      background-color: transparent;
      border: none;
      padding: 0.375rem 0.75rem;
      font-size: 1rem;
    }
    .btn-link {
      font-weight: 400;
      color: #007bff;
      text-decoration: none;
    }
    .btn-link:hover {
      color: #0056b3;
      text-decoration: underline;
      cursor: pointer;
    }
  </style>
`;
