import {LitElement, html} from 'lit-element';


export class GofCanvas extends LitElement {
  canvas: HTMLCanvasElement;

  render() {
    return html`
      <style>
        :host {
          background: green;
          display: block;
        }
        #canvas{
          width: 100%;
          height: 100%;
        }
      </style>
      
      <canvas id="canvas"></canvas>
    `;
  }

  getCanvas() {
    return this.canvas;
  }
}

customElements.define('gof-canvas', GofCanvas);
