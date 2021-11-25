const UNIT_SIZE = 10;

export let mix = superclass => new MixinBuilder(superclass);

class MixinBuilder {
  constructor(superclass) {
    this.superclass = superclass;
  }

  with(...mixins) {
    return mixins.reduce((c, mixin) => mixin(c), this.superclass);
  }
}

export const RenderTextMixin = (o, prop,
  {
    textBaseline = 'middle',
    textAlign = 'center',
    color = '#eeeeee',
    paddingLeft = 0,
  } = {}) =>
  superclass => class extends superclass {
    render(ctx, clicked, x0, y0, x1, y1) {
      if (super.render)
        super.render(...arguments);

      ctx.fillStyle = color;
      ctx.textBaseline = textBaseline;
      ctx.textAlign = textAlign;
      let x;
      let y = (y0 + (y1 - y0)/2)*UNIT_SIZE;
      switch (textAlign) {
        case 'left':
          x = (x0 + paddingLeft)*UNIT_SIZE;
          break;
        case 'center':
          x = (x0 + (x1 - x0)/2)*UNIT_SIZE;
          break;
        default:
          console.error(`Unknown 'textAlign' value '${textAlign}'`);
      }

      ctx.fillText(o[prop], x, y);
    }
};

export const RenderTextCenteredMixin = (o, prop) =>
  superclass => class extends superclass {
    render(ctx, clicked, x0, y0, x1, y1) {
      if (super.render)
        super.render(...arguments);

      ctx.fillStyle = '#eeeeee';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillText(o[prop],
        (x0 + (x1 - x0)/2)*UNIT_SIZE,
        (y0 + (y1 - y0)/2)*UNIT_SIZE,
        (x1 - x0)*UNIT_SIZE);
    }
  };

export const RenderButtonMixin = superclass => class extends superclass {
  render(ctx, clicked, x0, y0, x1, y1) {
    if (super.render)
      super.render(ctx, clicked, x0, y0, x1, y1);

    const asdf = 4;
    // top
    ctx.strokeStyle = clicked ? '#330000' : 'white';
    ctx.beginPath();
    ctx.lineWidth = asdf;
    ctx.moveTo(x0*UNIT_SIZE, y0*UNIT_SIZE + ctx.lineWidth/2);
    ctx.lineTo(x1*UNIT_SIZE, y0*UNIT_SIZE + ctx.lineWidth/2);
    ctx.stroke();
    //left
    ctx.beginPath();
    ctx.lineWidth = asdf/2;
    ctx.moveTo(x0*UNIT_SIZE + ctx.lineWidth/2, y1*UNIT_SIZE);
    ctx.lineTo(x0*UNIT_SIZE + ctx.lineWidth/2, y0*UNIT_SIZE);
    ctx.stroke();
    // bottom
    ctx.strokeStyle = clicked ? 'white' : '#330000';
    ctx.beginPath();
    ctx.lineWidth = asdf;
    ctx.moveTo(x0*UNIT_SIZE, y1*UNIT_SIZE - ctx.lineWidth/2);
    ctx.lineTo(x1*UNIT_SIZE, y1*UNIT_SIZE - ctx.lineWidth/2);
    ctx.stroke();
    // right
    ctx.beginPath();
    ctx.lineWidth = asdf/2;
    ctx.moveTo(x1*UNIT_SIZE - ctx.lineWidth/2, y0*UNIT_SIZE);
    ctx.lineTo(x1*UNIT_SIZE - ctx.lineWidth/2, y1*UNIT_SIZE);
    ctx.stroke();
    // corner
    ctx.strokeStyle = 'lightgray';
    ctx.beginPath();
    ctx.moveTo(x1*UNIT_SIZE - ctx.lineWidth/2, y0*UNIT_SIZE);
    ctx.lineTo(x1*UNIT_SIZE - ctx.lineWidth/2, y0*UNIT_SIZE + asdf);
    ctx.stroke();
  }
};

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
