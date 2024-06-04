import { html } from '@lion/core';

export const mashupMainScreenStyles = html`
  <style>

.cc-banner {
    font-size: 24px;
    text-align: center;
    width: 100%;
    padding: 20px;
}

.uplus-banner {
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
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;  
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
    display:flex; 
    flex-direction: row;
}

.cc-info-pega {
    width: 50%; 
    display: flex; 
    flex-direction: column;
}

.uplus-info {
    display:flex; 
    flex-direction: row;
    justify-content: center;
    margin-top: 5rem;
}

.uplus-info-pega {
    min-width: 40rem;
    // width: 50%; 
    // display: flex; 
    // flex-direction: column; 
    // margin-left: 25%;
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
    width: 700px; 
    margin: 20px; 
    border-radius: 10px;
}


  </style>
`;