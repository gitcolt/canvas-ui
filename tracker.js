export class Note {
  constructor() {
    this.name = null;
    this.octave = null;
  }
}

export class Row {
  constructor() {
    this.note = null;
    this.sample = null;
    this.effect = null;
    this.param = null;
  }
}

export class Track {
  constructor() {
    this.rows = [];
  }
}

export function initTrack(track) {
  for (let i = 0; i < 10; i++) {
    const row = new Row();
    row.note = new Note('C#', 2);
    row.sample = 1;
    row.effect = 10;
    row.param = 255;
    track.rows.push(row);
  }
}

