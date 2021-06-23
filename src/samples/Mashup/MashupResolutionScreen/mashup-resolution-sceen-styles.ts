import { html } from '@lion/core';

export const mashupResolutionScreenStyles = html`
  <style>

.cc-resolution {
    display: flex;
    flex-direction: row;
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
    font-size: 60px
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
    background-color: $app-secondary-color;
    font-size: 25px;
    font-weight: bold;
    border-radius: 25px;
    border: 0px;
    margin: 20px;
    padding: 10px 30px;
}


  </style>
`;