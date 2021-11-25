export function writeDebugString(ctx, str) {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, 400, 30);

  ctx.font = '20px sans-serif';
  ctx.fillStyle = 'black';
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  ctx.fillText(str, 10, 5);
};

