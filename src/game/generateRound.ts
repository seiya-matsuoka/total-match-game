import type { Round } from './types';
import type { GameConfig } from './config';

const VALUE_MIN = 0;
const VALUE_MAX = 9; // 盤面の数値レンジは 0..9 のまま

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickKDistinctIdx(k: number, maxExclusive: number): number[] {
  const idxs = new Set<number>();
  while (idxs.size < k) idxs.add(randInt(0, maxExclusive - 1));
  return Array.from(idxs);
}

/**
 * config に基づいてラウンドを生成（必ず1解を内包）
 * - k = picksCount 個の正解セルを先に決める
 * - target を [0, min(targetMax, k*9)] から選ぶ
 * - 0..9 の範囲で k 値の和が target になるよう分割（常に解が存在するよう制約）
 * - 残りセルは 0..9 のランダム
 */
export function generateRound(config: GameConfig): Round {
  const size = config.gridSize;
  const cells = size * size;
  const k = config.picksCount;

  const numbers = Array.from({ length: cells }, () => 0);
  const solutionIdxs = pickKDistinctIdx(k, cells);

  const tMax = Math.min(config.targetMax, k * VALUE_MAX);
  const target = randInt(1, tMax); // 0 だと味気ないので 1..tMax

  // k個の非負整数（各<=9）で target を作る
  let remaining = target;
  const solutionValues: number[] = [];
  for (let i = 0; i < k; i++) {
    const r = k - i - 1; // 残りスロット
    const minRem = 0 * r; // = 0
    const maxRem = VALUE_MAX * r; // 残りで最大作れる合計
    const lo = Math.max(VALUE_MIN, remaining - maxRem);
    const hi = Math.min(VALUE_MAX, remaining - minRem);
    const v = randInt(lo, Math.max(lo, hi));
    solutionValues.push(v);
    remaining -= v;
  }
  // 念のためクリップ（理論上不要だが安全のため）
  if (remaining !== 0) {
    solutionValues[solutionValues.length - 1] += remaining;
  }

  solutionIdxs.forEach((idx, i) => {
    numbers[idx] = solutionValues[i];
  });

  const solutionSet = new Set<number>(solutionIdxs);
  for (let i = 0; i < cells; i++) {
    if (!solutionSet.has(i)) numbers[i] = randInt(VALUE_MIN, VALUE_MAX);
  }

  return { size, numbers, target, solutionIdxs };
}
