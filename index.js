import {PanelGroup, Panel, drawPanelGroup} from './cui';
import {mix, RenderButtonMixin, RenderDynamicTextMixin, RenderStaticTextMixin} from './cuiMixins';
import {writeDebugString} from './debug';

const can = document.querySelector('#can');
can.width = window.innerWidth;
can.height = window.innerHeight;
const ctx = can.getContext('2d');

ctx.fillRectUnits = function(x, y, w, h, unitSize) {
  this.fillRect(x * unitSize, y * unitSize, w * unitSize, h * unitSize);
};

const panelGroup = new PanelGroup(10, 10, 40, 30);
let o = {
  songName: 'physical precense',
  count: 0
};

const TextButtonPanel = mix(Panel)
  .with(RenderButtonMixin, RenderDynamicTextMixin(o, 'count',
                                                  {
                                                    color: 'blue'
                                                  }
                                                ));

const counter = new TextButtonPanel(0, 0, 10, 4);
counter.registerClickStartCallback(_ => {
  o.count++;
  console.log(o.count);
});

const panels = [
  // row 0
  counter,
  new (mix(Panel).with(RenderButtonMixin))(10, 0, 10, 4),
  new (mix(Panel).with(RenderButtonMixin))(20, 0, 10, 4),

  // row 1
  new (mix(Panel).with(RenderButtonMixin, RenderStaticTextMixin('hello')))(0, 4, 10, 4),
  new (RenderButtonMixin(Panel))(10, 4, 10, 4),
  new TextButtonPanel(20, 4, 10, 4),
];

panels.forEach(p => {
  panelGroup.addPanel(p);
});

document.addEventListener('mousemove', e => {
  debugMsg = `x: ${e.clientX}, y: ${e.clientY}`;
});

document.addEventListener('mousedown', e => {
  panelGroup.onMouseDown(e.clientX, e.clientY);
});

document.addEventListener('mouseup', e => {
  panelGroup.onMouseUp(e.clientX, e.clientY);
});

let debugMsg = '';
(function loop() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, can.width, can.height);

  drawPanelGroup(ctx, panelGroup);

  writeDebugString(ctx, debugMsg);

  requestAnimationFrame(loop);
})();

