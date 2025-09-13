import { useEffect, useMemo, useState } from 'react';
import {
  GRID_SIZE_OPTIONS,
  WRONG_MODE_OPTIONS,
  CONTROL_MODE_OPTIONS,
  picksOptionsForSize,
  targetMaxOptionsForSize,
  ALL_PICKS_OPTIONS,
  ALL_TARGET_MAX_OPTIONS,
  type GameConfig,
  saveConfig,
  loadSavedConfigs,
  addSavedConfig,
  deleteSavedConfig,
  type SavedConfig,
} from '../game/config';
import { btnPrimaryNavy } from '../ui/tokens';

type Props = { config: GameConfig; onChange: (n: GameConfig) => void; onStart: () => void };

function summarize(cfg: GameConfig) {
  const mode = cfg.controlMode === 'keyboard' ? 'キーボード' : 'マウス';
  const wrong = cfg.wrongMode === 'keep' ? '問題継続' : '問題切替';
  return `${mode}, ${cfg.gridSize}×${cfg.gridSize}, ${cfg.picksCount}, ${cfg.targetMax}, ${wrong}`;
}
function sameConfig(a: GameConfig, b: GameConfig) {
  return (
    a.gridSize === b.gridSize &&
    a.picksCount === b.picksCount &&
    a.targetMax === b.targetMax &&
    a.seconds === b.seconds &&
    a.wrongMode === b.wrongMode &&
    a.controlMode === b.controlMode
  );
}

// セグメントボタンの共通トーン
const segBase =
  'rounded-md px-3 py-1.5 text-sm shadow-sm ring-2 transition focus-visible:outline-none';
const segOn = 'bg-slate-900 text-white ring-slate-900';
const segOff = 'bg-white text-slate-800 ring-slate-300 hover:bg-slate-50';
const segDisabled = 'opacity-45 cursor-not-allowed';

export default function Settings({ config, onChange, onStart }: Props) {
  function update<K extends keyof GameConfig>(key: K, value: GameConfig[K]) {
    const next = { ...config, [key]: value };
    if (key === 'gridSize') {
      const size = value as GameConfig['gridSize'];
      const pickAllowed = picksOptionsForSize(size);
      if (!pickAllowed.includes(next.picksCount)) next.picksCount = pickAllowed[0];
      const tAllowed = targetMaxOptionsForSize(size);
      if (!tAllowed.includes(next.targetMax)) next.targetMax = tAllowed[0];
    }
    onChange(next);
    saveConfig(next);
  }

  const pickAllowed = useMemo(() => picksOptionsForSize(config.gridSize), [config.gridSize]);
  const targetAllowed = useMemo(() => targetMaxOptionsForSize(config.gridSize), [config.gridSize]);

  const [saved, setSaved] = useState<SavedConfig[]>(() => loadSavedConfigs());
  useEffect(() => setSaved(loadSavedConfigs()), []);

  const [showSave, setShowSave] = useState(false);
  const [saveName, setSaveName] = useState(() => `設定${saved.length + 1}`);
  const MAX_NAME = 16;

  const isDuplicate = saved.some((s) => sameConfig(s.config, config));
  const isSaveDisabled = isDuplicate || saved.length >= 4;

  function openSave() {
    if (isSaveDisabled) return;
    setSaveName(`設定${loadSavedConfigs().length + 1}`);
    setShowSave(true);
  }
  function doSave() {
    if (isSaveDisabled) return;
    addSavedConfig(saveName.trim() || `設定${loadSavedConfigs().length + 1}`, config);
    setSaved(loadSavedConfigs());
    setShowSave(false);
  }
  function applyPreset(id: string) {
    const item = saved.find((s) => s.id === id);
    if (!item) return;
    onChange(item.config);
    saveConfig(item.config);
  }
  function removePreset(id: string) {
    deleteSavedConfig(id);
    setSaved(loadSavedConfigs());
  }

  return (
    <div className="relative w-full max-w-[520px] rounded-xl bg-white p-4 text-[13px] ring-2 ring-slate-300/80 shadow-sm sm:p-6">
      {/* 上部バー */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">設定</h2>
        <button className={btnPrimaryNavy} onClick={onStart}>
          スタート
        </button>
      </div>

      {/* 2カラム配置 */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        {/* 操作 */}
        <div>
          <div className="mb-1 text-[13px] font-medium text-slate-600">操作</div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="操作">
            {CONTROL_MODE_OPTIONS.map((m) => (
              <button
                key={m}
                className={`${segBase} ${m === config.controlMode ? segOn : segOff}`}
                onClick={() => update('controlMode', m)}
              >
                {m === 'mouse' ? 'マウス' : 'キーボード'}
              </button>
            ))}
          </div>
        </div>

        {/* グリッド */}
        <div>
          <div className="mb-1 text-[13px] font-medium text-slate-600">グリッド</div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="グリッド">
            {GRID_SIZE_OPTIONS.map((g) => (
              <button
                key={g}
                className={`${segBase} ${g === config.gridSize ? segOn : segOff}`}
                onClick={() => update('gridSize', g)}
              >
                {g} × {g}
              </button>
            ))}
          </div>
        </div>

        {/* 選択するマス数 */}
        <div>
          <div className="mb-1 text-[13px] font-medium text-slate-600">選択するマス数</div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="選択するマス数">
            {ALL_PICKS_OPTIONS.map((k) => {
              const ok = pickAllowed.includes(k);
              const on = k === config.picksCount;
              return (
                <button
                  key={k}
                  disabled={!ok}
                  className={`${segBase} ${on ? segOn : segOff} ${ok ? '' : segDisabled}`}
                  onClick={() => ok && update('picksCount', k)}
                >
                  {k}
                </button>
              );
            })}
          </div>
        </div>

        {/* ターゲット最大 */}
        <div>
          <div className="mb-1 text-[13px] font-medium text-slate-600">ターゲット最大</div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="ターゲット最大">
            {ALL_TARGET_MAX_OPTIONS.map((t) => {
              const ok = targetAllowed.includes(t);
              const on = t === config.targetMax;
              return (
                <button
                  key={t}
                  disabled={!ok}
                  className={`${segBase} ${on ? segOn : segOff} ${ok ? '' : segDisabled}`}
                  onClick={() => ok && update('targetMax', t)}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* 不正解時 + 保存 */}
        <div className="col-span-2">
          <div className="mb-1 text-[13px] font-medium text-slate-600">不正解時</div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2" role="group" aria-label="不正解時">
              {WRONG_MODE_OPTIONS.map((m) => (
                <button
                  key={m}
                  className={`${segBase} ${m === config.wrongMode ? segOn : segOff}`}
                  onClick={() => update('wrongMode', m)}
                >
                  {m === 'keep' ? '問題継続' : '問題切替'}
                </button>
              ))}
            </div>

            <button
              className={`rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium shadow-sm hover:bg-slate-50 active:translate-y-[0.5px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-200 ${isSaveDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
              disabled={isSaveDisabled}
              onClick={openSave}
              title={
                isSaveDisabled ? '同じ設定は保存できません（または保存数上限）' : 'この設定を保存'
              }
            >
              保存
            </button>
          </div>
        </div>
      </div>

      {/* 保存済み（2×2固定） */}
      <div>
        <div className="mb-2 text-[13px] font-medium text-slate-600">保存済み</div>
        <div className="grid grid-cols-2 grid-rows-2 gap-3">
          {saved.map((s) => (
            <div
              key={s.id}
              onClick={() => applyPreset(s.id)}
              className="relative h-[72px] cursor-pointer rounded-lg bg-white p-2.5 ring-2 ring-slate-300/80 shadow-sm transition hover:bg-slate-50"
              title="クリックで適用"
            >
              <button
                className="absolute right-2 top-2 rounded-md border border-rose-300 bg-rose-50 px-2 py-0.5 text-xs text-rose-700 shadow-sm hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200"
                onClick={(e) => {
                  e.stopPropagation();
                  removePreset(s.id);
                }}
              >
                削除
              </button>
              <div className="truncate pr-8 text-[13px] font-semibold text-slate-800">{s.name}</div>
              <div className="mt-0.5 line-clamp-2 text-[12px] leading-[1.15] text-slate-600">
                {summarize(s.config)}
              </div>
            </div>
          ))}

          {/* プレースホルダーも同じ高さ */}
          {Array.from({ length: Math.max(0, 4 - saved.length) }).map((_, i) => (
            <div
              key={`ph-${i}`}
              className="h-[72px] rounded-lg bg-slate-50 p-2.5 ring-2 ring-slate-200/70"
            />
          ))}
        </div>
      </div>

      {/* 保存名モーダル */}
      {showSave && (
        <div className="absolute inset-0 grid place-items-center rounded-xl bg-black/20">
          <div className="w-[min(92vw,360px)] rounded-lg bg-white p-4 shadow-lg ring-2 ring-slate-300/80">
            <div className="mb-2 text-sm font-semibold text-slate-800">設定名を入力</div>
            <input
              className="w-full rounded-md border border-slate-300 px-2.5 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-200"
              value={saveName}
              maxLength={MAX_NAME}
              onChange={(e) => setSaveName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && doSave()}
              autoFocus
            />
            <div className="mt-3 flex justify-end gap-2">
              <button
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-200"
                onClick={() => setShowSave(false)}
              >
                キャンセル
              </button>
              <button
                className="rounded-lg bg-[#1436C2] px-4 py-2 text-sm font-bold text-white shadow-sm hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={doSave}
                disabled={isSaveDisabled}
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
