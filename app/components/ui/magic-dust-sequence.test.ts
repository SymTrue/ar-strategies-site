import { describe, expect, it } from 'vitest';
import { BufferAttribute } from 'three';
import { advanceSequence, createLiveBuffers, type SequenceTarget } from './magic-dust-sequence';

// Each item's buffers are filled with a marker so we can tell which one the
// particles are currently forming: 1 = NOTICED, 2 = REMEMBERED, 3 = CHOSEN.
function makeTargets(): SequenceTarget[] {
  return [1, 2, 3].map((marker) => ({
    dest: new Float32Array(6).fill(marker),
    delays: new Float32Array(2).fill(marker * 10),
  }));
}

// Run the loop the way MagicDustCore's frame loop does: the geometry attribute
// is built on the live buffer, and each deconstruct advances to the next item.
function playLoops(targets: SequenceTarget[], steps: number) {
  const live = createLiveBuffers(targets[0]);
  const attr = new BufferAttribute(live.dest, 3);
  let index = 0;
  const shown = [attr.array[0]];
  for (let step = 0; step < steps; step++) {
    index = advanceSequence(live, targets, index);
    shown.push(attr.array[0]);
  }
  return shown;
}

describe('MagicDust sequence playback', () => {
  it('plays every item, in order, on every loop', () => {
    // Two full loops plus the wrap back to the start. Regression for the About
    // page showing NOTICED once at load and then CHOSEN in its place forever.
    expect(playLoops(makeTargets(), 6)).toEqual([1, 2, 3, 1, 2, 3, 1]);
  });

  it('never mutates the source targets', () => {
    const targets = makeTargets();
    const before = targets.map((t) => ({ dest: Array.from(t.dest), delays: Array.from(t.delays) }));
    const live = createLiveBuffers(targets[0]);
    let index = 0;
    for (let step = 0; step < 6; step++) index = advanceSequence(live, targets, index);

    targets.forEach((t, i) => {
      expect(Array.from(t.dest)).toEqual(before[i].dest);
      expect(Array.from(t.delays)).toEqual(before[i].delays);
    });
  });

  it('starts on the first item without sharing its memory', () => {
    const targets = makeTargets();
    const live = createLiveBuffers(targets[0]);

    expect(live.dest).not.toBe(targets[0].dest);
    expect(live.delays).not.toBe(targets[0].delays);
    expect(Array.from(live.dest)).toEqual(Array.from(targets[0].dest));
    expect(Array.from(live.delays)).toEqual(Array.from(targets[0].delays));
  });
});
