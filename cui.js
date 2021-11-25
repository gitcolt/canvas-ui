export const UNIT_SIZE = 10;

export class Panel {
  constructor(offsetX, offsetY, w, h) {
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.w = w;
    this.h = h;
    this.onRender = null;
    this.clicked = false;
    this.clickStartCallback = null;
  }

  registerClickStartCallback(callback) {
    this.clickStartCallback = callback;
  }

  render(ctx, _, x0, y0) {
    ctx.fillStyle = '#aaaaaa';
    ctx.fillRect(x0*UNIT_SIZE, y0*UNIT_SIZE, this.w*UNIT_SIZE, this.h*UNIT_SIZE)
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'purple';
    ctx.strokeRect(x0*UNIT_SIZE, y0*UNIT_SIZE, this.w*UNIT_SIZE, this.h*UNIT_SIZE)
  }

  checkBounds(xPx, yPx) {
      if (xPx >= this.offsetX*UNIT_SIZE &&
          xPx <= (this.offsetX + this.w)*UNIT_SIZE &&
          yPx >= this.offsetY*UNIT_SIZE &&
          yPx <= (this.offsetY + this.h)*UNIT_SIZE) {
        return true;
      } else
        return false;
  }
}

export class PanelGroup {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.panels = [];
  }

  onMouseDown(xPx, yPx) {
    let panel = this.panels.find(p => p.checkBounds(xPx - this.x*UNIT_SIZE, yPx - this.y*UNIT_SIZE));
    if (panel) {
      panel.clicked = true;
      if (panel.clickStartCallback)
        panel.clickStartCallback();
    }
  }

  onMouseUp(xPx, yPx) {
    let panel = this.panels.find(p => p.checkBounds(xPx - this.x*UNIT_SIZE, yPx - this.y*UNIT_SIZE));
    if (panel) {
      panel.clicked = false;
    }
  }

  addPanel(panel) {
    if (panel.w > this.w || panel.h > this.h) {
      console.error('panel does not fit within the panel group');
    }
    this.panels.push(panel);
  }
}

export function drawPanelGroup(ctx, panelGroup) {
  ctx.fillStyle = '#a8dd8c';
  ctx.fillRectUnits(panelGroup.x,
               panelGroup.y,
               panelGroup.w,
               panelGroup.h,
               UNIT_SIZE);

  panelGroup.panels.forEach(p => {

    if (p.render) {
      p.render(ctx, p.clicked,
        panelGroup.x + p.offsetX,
        panelGroup.y + p.offsetY,
        panelGroup.x + p.offsetX + p.w,
        panelGroup.y + p.offsetY + p.h,
      );
    }
  });
}
