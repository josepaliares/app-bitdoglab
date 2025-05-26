
export type Note =
  | "C"
  | "C#"
  | "D"
  | "D#"
  | "E"
  | "F"
  | "F#"
  | "G"
  | "G#"
  | "A"
  | "A#"
  | "B";

export type Octave = number; // geralmente de 0 a 8

// Offset de semitons em relação ao A4 (440Hz)
const noteOffsets: Record<Note, number> = {
  C: -9,
  "C#": -8,
  D: -7,
  "D#": -6,
  E: -5,
  F: -4,
  "F#": -3,
  G: -2,
  "G#": -1,
  A: 0,
  "A#": 1,
  B: 2,
};

export function noteToFrequency(note: Note, octave: Octave): number {
  const offset = noteOffsets[note];
  const semitonesFromA4 = offset + (octave - 4) * 12;
  return 440 * Math.pow(2, semitonesFromA4 / 12);
}