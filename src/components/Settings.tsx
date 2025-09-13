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
  const MAX_NAME = 16; // ★ ボタンに被らない程度

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
    <div className="relative w-full max-w-[520px] rounded-xl bg-white p-3 text-[13px] shadow">
      {/* 上部バー：スタートのみ（目立つ） */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold">設定</h2>
        <button
          className="rounded-lg bg-purple-700 px-6 py-2.5 text-base font-bold text-white shadow hover:opacity-90"
          onClick={onStart}
        >
          スタート
        </button>
      </div>

      {/* 2カラム配置 */}
      <div className="mb-3 grid grid-cols-2 gap-3">
        {/* 操作 */}
        <div>
          <div className="mb-1 font-semibold text-gray-700">操作</div>
          <div className="flex flex-wrap gap-2">
            {CONTROL_MODE_OPTIONS.map((m) => (
              <button
                key={m}
                className={[
                  'rounded-md border px-2.5 py-1',
                  m === config.controlMode ? 'bg-gray-900 text-white' : 'bg-white',
                ].join(' ')}
                onClick={() => update('controlMode', m)}
              >
                {m === 'mouse' ? 'マウス' : 'キーボード'}
              </button>
            ))}
          </div>
        </div>

        {/* グリッド */}
        <div>
          <div className="mb-1 font-semibold text-gray-700">グリッド</div>
          <div className="flex flex-wrap gap-2">
            {GRID_SIZE_OPTIONS.map((g) => (
              <button
                key={g}
                className={[
                  'rounded-md border px-2.5 py-1',
                  g === config.gridSize ? 'bg-gray-900 text-white' : 'bg-white',
                ].join(' ')}
                onClick={() => update('gridSize', g)}
              >
                {g} × {g}
              </button>
            ))}
          </div>
        </div>

        {/* 選択するマス数（常に全候補を表示、許容外はdisabled） */}
        <div>
          <div className="mb-1 font-semibold text-gray-700">選択するマス数</div>
          <div className="flex flex-wrap gap-2">
            {ALL_PICKS_OPTIONS.map((k) => {
              const ok = pickAllowed.includes(k);
              return (
                <button
                  key={k}
                  disabled={!ok}
                  className={[
                    'rounded-md border px-2.5 py-1',
                    k === config.picksCount ? 'bg-gray-900 text-white' : 'bg-white',
                    !ok ? 'cursor-not-allowed opacity-40' : '',
                  ].join(' ')}
                  onClick={() => ok && update('picksCount', k)}
                >
                  {k}
                </button>
              );
            })}
          </div>
        </div>

        {/* ターゲット最大（常に全候補表示、許容外はdisabled） */}
        <div>
          <div className="mb-1 font-semibold text-gray-700">ターゲット最大</div>
          <div className="flex flex-wrap gap-2">
            {ALL_TARGET_MAX_OPTIONS.map((t) => {
              const ok = targetAllowed.includes(t);
              return (
                <button
                  key={t}
                  disabled={!ok}
                  className={[
                    'rounded-md border px-2.5 py-1',
                    t === config.targetMax ? 'bg-gray-900 text-white' : 'bg-white',
                    !ok ? 'cursor-not-allowed opacity-40' : '',
                  ].join(' ')}
                  onClick={() => ok && update('targetMax', t)}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* 不正解時 + 右端に保存ボタン（同一行・同じ高さ） */}
        {/* 不正解時（行の右端に「保存」） */}
        <div className="col-span-2">
          <div className="mb-1 font-semibold text-gray-700">不正解時</div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              {WRONG_MODE_OPTIONS.map((m) => (
                <button
                  key={m}
                  className={[
                    'rounded-md border px-2.5 py-1',
                    m === config.wrongMode ? 'bg-gray-900 text-white' : 'bg-white',
                  ].join(' ')}
                  onClick={() => update('wrongMode', m)}
                >
                  {m === 'keep' ? '問題継続' : '問題切替'}
                </button>
              ))}
            </div>

            <button
              className={[
                'rounded-md border px-2.5 py-1',
                isSaveDisabled ? 'cursor-not-allowed opacity-50' : '',
              ].join(' ')}
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

      {/* 保存済み（常に 2×2 レイアウトで固定） */}
      <div>
        <div className="mb-1 font-semibold text-gray-700">保存済み</div>
        <div className="grid grid-cols-2 grid-rows-2 gap-2">
          {saved.map((s) => (
            <div
              key={s.id}
              onClick={() => applyPreset(s.id)}
              className="relative h-24 cursor-pointer rounded-lg border p-2 hover:bg-gray-50"
            >
              <button
                className="absolute right-2 top-2 rounded border px-2 py-0.5 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  removePreset(s.id);
                }}
              >
                削除
              </button>
              <div className="truncate pr-10 text-[13px] font-semibold">{s.name}</div>
              <div className="mt-1 line-clamp-2 text-[12.5px] leading-tight text-gray-700">
                {summarize(s.config)}
              </div>
            </div>
          ))}

          {/* プレースホルダーで 4 枚ぶん確保（透明） */}
          {Array.from({ length: Math.max(0, 4 - saved.length) }).map((_, i) => (
            <div key={`ph-${i}`} className="h-24 rounded-lg border p-2 opacity-0" />
          ))}
        </div>
      </div>

      {/* 保存名モーダル */}
      {showSave && (
        <div className="absolute inset-0 grid place-items-center rounded-xl bg-black/20">
          <div className="w-[min(92vw,360px)] rounded-lg bg-white p-3 shadow-lg ring-1 ring-black/10">
            <div className="mb-2 text-sm font-semibold">設定名を入力</div>
            <input
              className="w-full rounded-md border px-2.5 py-1"
              value={saveName}
              maxLength={MAX_NAME}
              onChange={(e) => setSaveName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && doSave()}
              autoFocus
            />
            <div className="mt-3 flex justify-end gap-2">
              <button className="rounded-md border px-2.5 py-1" onClick={() => setShowSave(false)}>
                キャンセル
              </button>
              <button
                className="rounded-md bg-blue-600 px-3 py-1.5 text-white disabled:cursor-not-allowed disabled:opacity-50"
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
