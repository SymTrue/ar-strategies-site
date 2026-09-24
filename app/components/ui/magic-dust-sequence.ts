/* Playback buffers for MagicDust's text/shape sequence, kept separate from
   the per-item source data.

   Why this exists: three's BufferAttribute stores the array it is given by
   reference (`this.array = array`, no copy), and R3F passes <bufferAttribute
   args> straight to that constructor. The component used to build its
   geometry on `targets[0].dest`, so every advance - `attr.array.set(next)` -
   was writing into the first item's own positions. The first word played once
   at load, then its data held whatever was copied in last: on the About page,
   NOTICED became CHOSEN from the second loop onward (playback went
   NOTICED, REMEMBERED, CHOSEN, CHOSEN, REMEMBERED, CHOSEN, ...).

   The GPU attribute now owns a copy; the sequence's source arrays are only
   ever read. Create these once (e.g. inside a useState initializer): R3F
   rebuilds the attribute whenever an `args` entry changes identity, so a copy
   made during render would reset the animation on every re-render. */

export interface SequenceTarget {
  dest: Float32Array;
  delays: Float32Array;
}

export interface LiveBuffers {
  dest: Float32Array;
  delays: Float32Array;
}

/** Working copies the geometry is built on, starting on the first item. */
export function createLiveBuffers(first: SequenceTarget): LiveBuffers {
  return { dest: new Float32Array(first.dest), delays: new Float32Array(first.delays) };
}

/** Load the next item into the live buffers; returns its index. The caller
    still owns flagging the GPU attributes with `needsUpdate`. */
export function advanceSequence(live: LiveBuffers, targets: SequenceTarget[], index: number): number {
  const next = (index + 1) % targets.length;
  live.dest.set(targets[next].dest);
  live.delays.set(targets[next].delays);
  return next;
}
