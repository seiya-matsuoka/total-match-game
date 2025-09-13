export type Round = {
  size: number; // NxN
  numbers: number[]; // 長さ size*size
  target: number; // k個の合計
  solutionIdxs: number[]; // 長さ k
};
