export type Round = {
  numbers: number[]; // 9個
  target: number; // 3つの合計
  solutionIdxs: [number, number, number]; // 正解のインデックス
};
