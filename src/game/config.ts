export type GridSize = 3 | 4 | 5;
export type WrongMode = 'keep' | 'reroll';
export type ControlMode = 'mouse' | 'keyboard';

export type GameConfig = {
  gridSize: GridSize;
  picksCount: 3 | 4 | 5;
  targetMax: 20 | 25 | 30 | 35 | 40;
  seconds: number;
  wrongMode: WrongMode;
  controlMode: ControlMode;
};

export const DEFAULT_CONFIG: GameConfig = {
  gridSize: 3,
  picksCount: 3,
  targetMax: 20,
  seconds: 60,
  wrongMode: 'keep',
  controlMode: 'mouse',
};

const STORAGE_PREFIX = 'tmg:v1:';

const KEY_CONFIG = `${STORAGE_PREFIX}config`;

export const ALL_PICKS_OPTIONS: Array<GameConfig['picksCount']> = [3, 4, 5];
export const ALL_TARGET_MAX_OPTIONS: Array<GameConfig['targetMax']> = [20, 25, 30, 35, 40];

export function picksOptionsForSize(size: GridSize): Array<3 | 4 | 5> {
  if (size === 3) return [3];
  if (size === 4) return [3, 4];
  return [3, 4, 5];
}
export function targetMaxOptionsForSize(size: GridSize): Array<GameConfig['targetMax']> {
  if (size === 3) return [20, 25, 30];
  if (size === 4) return [20, 25, 30, 35];
  return [20, 25, 30, 35, 40];
}

export function loadConfig(): GameConfig {
  try {
    const raw = localStorage.getItem(KEY_CONFIG);
    const parsed = raw ? ((JSON.parse(raw) as Partial<GameConfig>) ?? {}) : {};
    const base: GameConfig = { ...DEFAULT_CONFIG, ...parsed };

    // クランプ
    const pickAllowed = picksOptionsForSize(base.gridSize);
    if (!pickAllowed.includes(base.picksCount)) base.picksCount = pickAllowed[0];
    const tAllowed = targetMaxOptionsForSize(base.gridSize);
    if (!tAllowed.includes(base.targetMax)) base.targetMax = tAllowed[0];

    return base;
  } catch {
    return DEFAULT_CONFIG;
  }
}
export function saveConfig(cfg: GameConfig) {
  localStorage.setItem(KEY_CONFIG, JSON.stringify(cfg));
}

export const GRID_SIZE_OPTIONS: GridSize[] = [3, 4, 5];
export const WRONG_MODE_OPTIONS: WrongMode[] = ['keep', 'reroll'];
export const CONTROL_MODE_OPTIONS: ControlMode[] = ['mouse', 'keyboard'];

// --- 保存済み設定 ---
export type SavedConfig = { id: string; name: string; config: GameConfig; createdAt: number };

const KEY_SAVED = `${STORAGE_PREFIX}saved-presets`;
const MAX_SAVED = 4; //

export function loadSavedConfigs(): SavedConfig[] {
  try {
    const raw = localStorage.getItem(KEY_SAVED);
    return raw ? (JSON.parse(raw) as SavedConfig[]) : [];
  } catch {
    return [];
  }
}
export function saveSavedConfigs(list: SavedConfig[]) {
  localStorage.setItem(KEY_SAVED, JSON.stringify(list));
}
export function addSavedConfig(name: string, cfg: GameConfig) {
  const list = loadSavedConfigs();
  const id = globalThis.crypto && 'randomUUID' in crypto ? crypto.randomUUID() : String(Date.now());
  const next = [{ id, name, config: cfg, createdAt: Date.now() }, ...list].slice(0, MAX_SAVED);
  saveSavedConfigs(next);
}
export function deleteSavedConfig(id: string) {
  const list = loadSavedConfigs().filter((x) => x.id !== id);
  saveSavedConfigs(list);
}

// --- ハイスコア ---
const KEY_SCORES = `${STORAGE_PREFIX}scores`;

type ScoreTable = Record<string, number>;

function scoreKey(cfg: GameConfig) {
  return [
    `g${cfg.gridSize}`,
    `k${cfg.picksCount}`,
    `t${cfg.targetMax}`,
    `s${cfg.seconds}`,
    `w${cfg.wrongMode}`,
  ].join('|');
}
export function loadHighScore(cfg: GameConfig): number {
  try {
    const raw = localStorage.getItem(KEY_SCORES);
    if (!raw) return 0;
    const table = JSON.parse(raw) as ScoreTable;
    return table[scoreKey(cfg)] ?? 0;
  } catch {
    return 0;
  }
}
export function updateHighScoreIfBest(cfg: GameConfig, score: number): number {
  const key = scoreKey(cfg);
  let table: ScoreTable = {};
  try {
    const raw = localStorage.getItem(KEY_SCORES);
    table = raw ? (JSON.parse(raw) as ScoreTable) : {};
  } catch {
    table = {};
  }
  const best = Math.max(score, table[key] ?? 0);
  table[key] = best;
  localStorage.setItem(KEY_SCORES, JSON.stringify(table));
  return best;
}

// すべてのゲームデータ（設定/ハイスコア/保存済み設定）を削除する
export function resetAllData(): void {
  try {
    localStorage.removeItem(KEY_CONFIG);
    localStorage.removeItem(KEY_SCORES);
    localStorage.removeItem(KEY_SAVED);
  } catch {
    // noop
  }
}
