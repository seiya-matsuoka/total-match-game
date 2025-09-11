import type { Round } from './types';

const RNG_MIN = 0;
const RNG_MAX = 9; // 0〜9

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick3DistinctIdx(): [number, number, number] {
  const idxs = new Set<number>();
  while (idxs.size < 3) idxs.add(randInt(0, 8));
  return Array.from(idxs) as [number, number, number];
}

/** 正解が必ず存在するラウンドを生成（先に解を決める方式） */
export function generateRound(): Round {
  const numbers = Array.from({ length: 9 }, () => 0);
  const solutionIdxs = pick3DistinctIdx();

  const a = randInt(RNG_MIN, RNG_MAX);
  const b = randInt(RNG_MIN, RNG_MAX);
  const c = randInt(RNG_MIN, RNG_MAX);
  const target = a + b + c;

  numbers[solutionIdxs[0]] = a;
  numbers[solutionIdxs[1]] = b;
  numbers[solutionIdxs[2]] = c;

  const solutionSet = new Set<number>(solutionIdxs);
  for (let i = 0; i < 9; i++) {
    if (!solutionSet.has(i)) numbers[i] = randInt(RNG_MIN, RNG_MAX);
  }

  return { numbers, target, solutionIdxs };
}
