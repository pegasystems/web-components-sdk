import {
  LitElement, html, customElement, property
} from '@lion/core';

//  NOTE: need to import any custom-element that you want to render
//  Otherwise, the tag shows up but the constructor, connectedCallback, etc.
//  don't get called.
import '../ViewContainer';
import '../AppEntry';

@customElement('hello-world')
class HelloWorldElem extends LitElement {
  @property({type: String}) title:string = "default title";
  @property({type: String}) description:string = "default description";

  render(){
       return html`
      <style>
      .container {
        padding: 5px;
        text-align: center;
        background: #c8e7fd;
      }
      .container h1 {
        font-size: 18px;
      }
      .container p {
        font-size: 14px;
      }
      </style>
      <div class="container">
      <h1>${this.title}</h1>
      <p>${this.description}</p>
      </div>
      `;
  }
}

export default HelloWorldElem;