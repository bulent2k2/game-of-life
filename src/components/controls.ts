import { $ } from 'carbonium';
import { fromEvent, combine, Cuprum } from "cuprum";
import { GofGameOfLife } from "./gameoflife";

export class GofControls extends HTMLElement {
  gameoflife: GofGameOfLife;
  started: boolean;
  timer: NodeJS.Timeout;
  generation: number;
  generationElement: HTMLElement;
  speed: number;
  size$: Cuprum<number>;
  newShape$: Cuprum<Cell[]>;
  nextShape$: Cuprum<Cell[]>;
  nextGeneration$: Cuprum<void>;
  resize$: Cuprum<Event>;
  info$: Cuprum<Event>;
  collection: Collection;
  redraw$: Cuprum<Cell[]>;

  constructor() {
    super();

    this.attachShadow({mode: 'open'});

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          justify-content:  center;
          flex-wrap: wrap;
          align-items:  center;
        }
        
        img {
          vertical-align: bottom;
          margin-left: 30px;
        }
        
        :host > * {
          margin: 0 0.5vw;
        }
        
        input[type="range"] {
          width: 80px;
          vertical-align: bottom;
        }
        
        .generation {
          font-family: helvetica, arial, sans-serif;
          font-size: smaller;
          margin-left: 2em;
        }
      </style>
      
      <form>
        <select id="shapes">
        </select>
        <input id="next" type="button" value="Next">
        <input id="start" type="button" value="Start">
        <label class="generation" title="Generations" aria-label="Generations">0</label>
        <nowrap>
          <img src="pix/speeddial.svg" alt="" width="20" height="20">
          <input id="speed" type="range" min="10" max="500" step="49" value="10" title="Speed dial" aria-label="Speed dial">
        </nowrap>
        <nowrap>
          <img src="pix/grid.svg" alt="" width="20" height="20">
          <input id="size" type="range" min="2" max="11" value="2" title="Grid size" aria-label="Grid size">
        </nowrap>
        <input id="info" type="button" value="Info">
      </form>
    `;
  }

  connectedCallback() {
    this.gameoflife = new GofGameOfLife();
    this.started = false;
    this.timer = null;
    this.generation = 0;
    this.generationElement = $('.generation', this.shadowRoot);
    this.collection = this.getCollection();
    this.newShape$ = new Cuprum<Cell[]>();
    this.nextShape$ = new Cuprum<Cell[]>();
    this.nextGeneration$ = new Cuprum<void>();
    this.resize$ = fromEvent(window, 'resize');
  }

  init(redraw$: Cuprum<Cell[]>, toggle$:Cuprum<ClickEvent>) {
    this.redraw$ = redraw$;

    this.info$ = fromEvent($('#info', this.shadowRoot), 'click');

    toggle$.subscribe((event) => {
      this.setGeneration(0);
    });

    const shapesSelect = $('#shapes', this.shadowRoot);
    this.collection.forEach((shape, i) => {
      const option = document.createElement('option');
      option.text = shape.name;
      shapesSelect.appendChild(option);
    });
    shapesSelect.addEventListener('change', (e) => {
      this.setGeneration(0);
      this.newShape$.dispatch(this.collection[shapesSelect.selectedIndex].data);
    });
    this.newShape$.dispatch(this.collection[1].data);

    $('#next', this.shadowRoot).addEventListener('click', () => {
      this.nextGeneration$.dispatch();
    });

    const sizeChange$ = fromEvent($('#size', this.shadowRoot), 'change');
    const sizeInput$ = fromEvent($('#size', this.shadowRoot), 'input');
    this.size$ = combine(sizeChange$, sizeInput$)
      .map(() => 13 - parseInt($('#size', this.shadowRoot).value));

    this.size$.dispatch(11);

    const speed = $('#speed', this.shadowRoot);
    this.speed = 520 - parseInt(speed.value);
    speed.addEventListener('change', speedListener.bind(this));
    speed.addEventListener('input', speedListener.bind(this));

    function speedListener() {
      this.speed = 520 - parseInt(speed.value);
      if (this.started) {
        this.animate1();
      }
    }

    const startStop = $('#start', this.shadowRoot);
    startStop.addEventListener('click', () => {
      this.started = !this.started;
      if (this.started) {
        startStop.value = 'Stop';
        this.animate1();
      } else {
        startStop.value = 'Start';
        clearInterval(this.timer);
      }
    });

    this.nextGeneration$.subscribe(()=>{
      let shape = this.redraw$.value();
      shape = this.gameoflife.next(shape);
      this.nextShape$.dispatch(shape);

      this.setGeneration(this.generation + 1);
    });
  }

  getCollection() {
    return [
      {name: "Clear", data: []},
      {name: "Glider", data: [[1, 0], [2, 1], [2, 2], [1, 2], [0, 2]]},
      {name: "Small Exploder", data: [[0, 1], [0, 2], [1, 0], [1, 1], [1, 3], [2, 1], [2, 2]]},
      {
        name: "Exploder",
        data: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [2, 0], [2, 4], [4, 0], [4, 1], [4, 2], [4, 3], [4, 4]],
      },
      {name: "10 Cell Row", data: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0]]},
      {
        name: "Lightweight spaceship",
        data: [[0, 1], [0, 3], [1, 0], [2, 0], [3, 0], [3, 3], [4, 0], [4, 1], [4, 2]],
      },
      {
        name: "Tumbler",
        data: [[0, 3], [0, 4], [0, 5], [1, 0], [1, 1], [1, 5], [2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [5, 0], [5, 1], [5, 5], [6, 3], [6, 4], [6, 5]],
      },
      {
        name: "Gosper Glider Gun",
        data: [[0, 2], [0, 3], [1, 2], [1, 3], [8, 3], [8, 4], [9, 2], [9, 4], [10, 2], [10, 3], [16, 4], [16, 5], [16, 6], [17, 4], [18, 5], [22, 1], [22, 2], [23, 0], [23, 2], [24, 0], [24, 1], [24, 12], [24, 13], [25, 12], [25, 14], [26, 12], [34, 0], [34, 1], [35, 0], [35, 1], [35, 7], [35, 8], [35, 9], [36, 7], [37, 8]],
      }
    ];
  }

  setGeneration(gen: number) {
    this.generation = gen;
    this.generationElement.innerHTML = gen.toString(10);
  }

  animate1() {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.nextGeneration$.dispatch();
    }, this.speed);
  }
}

customElements.define('gof-controls', GofControls);

