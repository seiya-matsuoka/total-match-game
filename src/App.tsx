import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Sidebar from './components/Sidebar';
import Grid from './components/Grid';
import Settings from './components/Settings';
import HowTo from './components/HowTo';
import { Toaster, toast } from 'sonner';
import { generateRound } from './game/generateRound';
import type { Round } from './game/types';
import {
  loadConfig,
  saveConfig,
  type GameConfig,
  loadHighScore,
  updateHighScoreIfBest,
} from './game/config';
import { pillCls, pillNum, btnNeutral, btnDanger, btnInfo, btnPrimaryNavy } from './ui/tokens';

export default function App() {
  const [config, setConfig] = useState<GameConfig>(() => loadConfig());

  const [round, setRound] = useState<Round>(() => generateRound(loadConfig()));
  const [selectedIdxs, setSelectedIdxs] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(config.seconds);
  const [flashCorrect, setFlashCorrect] = useState(false);
  const [highScore, setHighScore] = useState(() => loadHighScore(config));

  // overlays
  const [showHelp, setShowHelp] = useState(false);
  const [ended, setEnded] = useState(false); // ★ タイムアップ

  const [focusIdx, setFocusIdx] = useState<number | null>(0);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [rollTick, setRollTick] = useState(0);

  const boardRef = useRef<HTMLDivElement>(null);
  const maxSelect = config.picksCount;

  const currentSum = useMemo(
    () => selectedIdxs.reduce((acc, idx) => acc + round.numbers[idx], 0),
    [selectedIdxs, round.numbers],
  );

  useEffect(() => {
    saveConfig(config);
    setHighScore(loadHighScore(config));
  }, [config]);

  function startGame() {
    setIsRunning(true);
    setEnded(false);
    setTimeLeft(config.seconds);
    setScore(0);
    const r = generateRound(config);
    setRound(r);
    setSelectedIdxs([]);
    setFocusIdx(0);
    setHoverIdx(null);
    setRollTick((t) => t + 1);
    requestAnimationFrame(() => boardRef.current?.focus());
  }
  function resetToSettings() {
    setHighScore(updateHighScoreIfBest(config, score));
    setIsRunning(false);
    setEnded(false);
    setTimeLeft(config.seconds);
    setSelectedIdxs([]);
    setFocusIdx(0);
    setHoverIdx(null);
  }
  function restart() {
    startGame();
  }

  const handleCellClick = useCallback(
    (i: number) => {
      setFocusIdx(i);
      if (!isRunning) return;
      setSelectedIdxs((prev) => {
        const has = prev.includes(i);
        const next = has ? prev.filter((x) => x !== i) : [...prev, i];
        if (next.length > maxSelect) next.length = maxSelect;
        return next;
      });
    },
    [isRunning, maxSelect],
  );

  // 判定
  useEffect(() => {
    if (!isRunning) return;
    if (selectedIdxs.length !== maxSelect) return;
    const sum = selectedIdxs.reduce((acc, idx) => acc + round.numbers[idx], 0);
    if (sum === round.target) {
      setScore((s) => s + 1);
      setFlashCorrect(true);
      toast.success('正解！');
      const t = setTimeout(() => {
        setFlashCorrect(false);
        const keepIdx = selectedIdxs[selectedIdxs.length - 1] ?? focusIdx ?? 0;
        setRound(generateRound(config));
        setSelectedIdxs([]);
        setFocusIdx(Math.min(keepIdx, round.size * round.size - 1));
        setHoverIdx(null);
        setRollTick((k) => k + 1);
      }, 500);
      return () => clearTimeout(t);
    } else {
      toast('ちがうみたい…');
      setSelectedIdxs([]);
      if (config.wrongMode === 'reroll') {
        setRound(generateRound(config));
        // フォーカスはそのまま
        setHoverIdx(null);
        setRollTick((k) => k + 1);
      }
    }
  }, [selectedIdxs, round, isRunning, config, maxSelect, focusIdx]);

  // タイマー（タイムアップ→盤面にオーバーレイ）
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          setIsRunning(false);
          setEnded(true);
          setHighScore(updateHighScoreIfBest(config, score));
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning, config, score]);

  // 盤面内のキーボード操作をグローバルに拾う
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!isRunning || ended || showHelp) return;
      if (config.controlMode !== 'keyboard') return;

      const el = e.target as HTMLElement | null;
      if (!el) return;
      const tag = el.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || el.isContentEditable) return;

      const size = round.size;
      const idx = focusIdx ?? 0;
      const row = Math.floor(idx / size);
      const col = idx % size;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          if (col > 0) setFocusIdx(idx - 1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (col < size - 1) setFocusIdx(idx + 1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (row > 0) setFocusIdx(idx - size);
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (row < size - 1) setFocusIdx(idx + size);
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          handleCellClick(idx);
          break;
        default:
          break;
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isRunning, ended, showHelp, config.controlMode, round.size, focusIdx, handleCellClick]);

  return (
    <main className="mx-auto min-h-svh max-w-5xl px-4 pb-12 pt-20 sm:px-6 sm:pb-18 sm:pt-28 -mt-3 sm:-mt-4">
      <Toaster richColors position="top-center" />

      <div className="mx-auto grid w-fit grid-cols-1 gap-8 sm:grid-cols-[200px_1fr] sm:gap-16 sm:items-start">
        <Sidebar
          target={round.target}
          timeLeft={timeLeft}
          score={score}
          gridSize={round.size}
          highScore={highScore}
        />

        <section className="relative">
          <div
            ref={boardRef}
            tabIndex={0}
            aria-label="number grid"
            className="relative inline-block aspect-square w-[min(90vw,420px)] rounded-xl bg-cyan-50 p-3 ring-8 ring-blue-700/60 shadow-md outline-none sm:size-[520px] sm:p-4 overflow-hidden"
            onMouseLeave={() => setHoverIdx(null)}
          >
            <Grid
              key={rollTick}
              className="animate-[pop_180ms_ease-out]"
              size={round.size}
              numbers={round.numbers}
              selectedIdxs={selectedIdxs}
              focusIdx={focusIdx}
              hoverIdx={hoverIdx}
              controlMode={config.controlMode}
              onHover={(i) => config.controlMode === 'mouse' && setHoverIdx(i)}
              onCellClick={handleCellClick}
              disabled={!isRunning || flashCorrect}
            />

            {/* 設定オーバーレイ（開始前） */}
            {!isRunning && !ended && (
              <div className="absolute inset-0 rounded-xl bg-white/90">
                <div className="grid h-full place-items-center">
                  <Settings config={config} onChange={setConfig} onStart={startGame} />
                </div>
              </div>
            )}

            {/* タイムアップオーバーレイ */}
            {ended && (
              <div className="absolute inset-0 grid place-items-center rounded-xl bg-white/90 p-4 sm:p-6">
                {/* 中央基準。-translate-y で“少し上”に見せる */}
                <div className="w-[92%] max-w-[640px] text-center -translate-y-1 sm:-translate-y-2">
                  <h2 className="text-[32px] sm:text-[42px] font-extrabold tracking-wide text-slate-800">
                    タイムアップ！
                  </h2>

                  {/* 記録：少し広めの余白 */}
                  <div className="mt-4 flex flex-wrap justify-center gap-3">
                    <span className={`${pillCls} px-4 py-1.5 text-base sm:text-lg`}>
                      スコア: {score}
                    </span>
                    <span className={`${pillCls} px-4 py-1.5 text-base sm:text-lg`}>
                      最高記録: {highScore}
                    </span>
                  </div>

                  {/* ボタン：間隔を確保。もう一度は紺色ソリッド */}
                  <div className="mt-6 flex justify-center gap-4">
                    <button className={btnPrimaryNavy} onClick={restart}>
                      もう一度
                    </button>
                    <button
                      className={`${btnNeutral} px-5 py-2 text-base`}
                      onClick={resetToSettings}
                    >
                      設定へ
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 説明 */}
            {showHelp && <HowTo onClose={() => setShowHelp(false)} />}

            {/* 正解フラッシュ */}
            {flashCorrect && (
              <div className="pointer-events-none absolute inset-0 grid place-items-center rounded-lg bg-emerald-200/70">
                <span className="text-4xl sm:text-5xl font-extrabold text-emerald-800">正解！</span>
              </div>
            )}
          </div>

          {/* ステータス行 */}
          <div
            className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm"
            aria-live="polite"
          >
            <div className="flex items-center gap-2">
              <span className={pillCls}>
                合計: <span className={pillNum}>{currentSum}</span>
              </span>
              <span className={pillCls}>
                選択: {selectedIdxs.length}/{maxSelect}
              </span>
              <span className={pillCls}>
                操作: {config.controlMode === 'mouse' ? 'マウス' : 'キーボード'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={pillCls}>
                最高記録: <span className={pillNum}>{highScore}</span>
              </span>
              <button type="button" className={btnInfo} onClick={() => setShowHelp(true)}>
                説明
              </button>
              <button type="button" className={btnDanger} onClick={resetToSettings}>
                リセット
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
