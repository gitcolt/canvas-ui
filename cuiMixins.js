import {UNIT_SIZE} from './cui';

export let mix = superclass => new MixinBuilder(superclass);

class MixinBuilder {
  constructor(superclass) {
    this.superclass = superclass;
  }

  with(...mixins) {
    return mixins.reduce((c, mixin) => mixin(c), this.superclass);
  }
}

export const RenderStaticTextMixin = (text,
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

      ctx.fillText(text, x, y);
    }
  }

export const RenderDynamicTextMixin = (o, prop,
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
