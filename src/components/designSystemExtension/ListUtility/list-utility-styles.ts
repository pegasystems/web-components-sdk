import { html } from '@lion/core';

export const listUtilityStyles = html`
  <style>

lion-button {
    background-color: transparent;
    padding-left: 0px;
}

.psdk-icon {
    padding: 0rem 0.125rem;
    min-width: unset;
}

.psdk-utility-divider {
    border-bottom: 0.0625rem solid var(--app-neutral-light-color);
}

.psdk-utility-view-all {
    width: 100%;
    display: flex;
    justify-content: center;
    color: var(--app-primary-color);
}

.psdk-utility-count {
    background: var(--app-primary-light-color);
    border-radius: calc(1.125 * 0.5rem);
    color: black;
    display: inline-block;
    font-size: 0.75rem;
    font-weight: bold;
    text-align: center;
    width: 1.125rem;

    vertical-align: top;
    margin: 0 0 0.313rem 1rem;
}

.psdk-utility .header-text {
    font-size: 1rem;
    font-weight: bold;
    padding-bottom: 0.3125rem;
    text-align: left;
    display: inline-block;
}

.psdk-utility .header-icon {
    display: inline-block;
}

.psdk-utility {
    width: 100%;
    padding: 0.625rem 0rem;
    text-align: left;
    background-color: var(--app-form-color);
    border-radius: 0.6125rem;
    margin: 0.3125rem 0rem;
    position: relative;
}
.psdk-utility .header {
    text-align: left;
    display: flex;
    align-items: center;;
}

.psdk-utility-svg-icon {
    width: 1.4rem;
    display: inline-block;
}

.psdk-settings-svg-icon {
    width: 1.4rem;
    display: inline-block;
    filter: var(--app-primary-color-filter);
}


.psdk-utility .message {
    text-align: center;
}

.psdk-utility-menu {
    position: relative;
    display: inline-block;
    text-align: right;
}

.psdk-action-menu-content {
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  left: calc(100% - 180px);
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  text-align: left;
}

.psdk-action-menu-content.show {
    display: block;
}

.psdk-action-menu-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.psdk-action-menu-content a:hover {background-color: #ddd}


.psdk-utility-card {
    display: flex;
    flex-direction: row;
    padding: 0.5rem;
}

.psdk-utility-card-icon {
    flex-grow: 1;
    max-width: 2.813rem;
}

.psdk-utility-card-svg-icon {
    width: 2.5rem;
    display: inline-block;
}

.psdk-utility-card-main {
    flex-grow: 2;
    max-width: 16.563rem;
}

.psdk-utility-card-main-primary-url {
    color: var(--app-primary-color);
}

.psdk-utility-card-main-primary-url .mat-button.mat-primary {
    padding-left: 0px;
}

.psdk-utility-card-main-primary-label {
    font-weight: bold;
}

.psdk-utility-card-actions {
    flex-grow: 1;
    text-align: right;
}

.psdk-utility-card-action-svg-icon {
    width: 1.4rem;
    display: inline-block;
}

.psdk-utility-card-actions-svg-icon {
    width: 1.4rem;
    display: inline-block;
    vertical-align: middle;
    filter: var(--app-primary-color-filter);
}

.psdk-utility-card-action-actions-svg-icon {
    width: 1.4rem;
    display: inline-block;
    vertical-align: bottom;  
}
  </style>
`;