import { useEffect, useMemo, useState } from 'react';
import Sidebar from './components/Sidebar';
import Grid from './components/Grid';
import { Toaster, toast } from 'sonner';
import ResultModal from './components/ResultModal';
import { generateRound } from './game/generateRound';
import type { Round } from './game/types';

const INITIAL_TIME = 60;

export default function App() {
  const [round, setRound] = useState<Round>(() => generateRound());
  const [selectedIdxs, setSelectedIdxs] = useState<number[]>([]);
  const [score, setScore] = useState(0);

  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [showStart, setShowStart] = useState(true);
  const [flashCorrect, setFlashCorrect] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const currentSum = useMemo(
    () => selectedIdxs.reduce((acc, idx) => acc + round.numbers[idx], 0),
    [selectedIdxs, round.numbers],
  );

  function handleCellClick(i: number) {
    if (!isRunning) return;
    setSelectedIdxs((prev) => {
      const has = prev.includes(i);
      const next = has ? prev.filter((x) => x !== i) : [...prev, i];
      return next.slice(0, 3);
    });
  }

  useEffect(() => {
    if (!isRunning) return;
    if (selectedIdxs.length !== 3) return;
    const sum = selectedIdxs.reduce((acc, idx) => acc + round.numbers[idx], 0);
    if (sum === round.target) {
      setScore((s) => s + 1);
      setFlashCorrect(true);
      toast.success('正解！');
      const t = setTimeout(() => {
        setFlashCorrect(false);
        setRound(generateRound());
        setSelectedIdxs([]);
      }, 600);
      return () => clearTimeout(t);
    } else {
      toast('ちがうみたい…もう一度！');
      setSelectedIdxs([]);
    }
  }, [selectedIdxs, round, isRunning]);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          setIsRunning(false);
          setShowResult(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  function startGame() {
    setShowStart(false);
    setIsRunning(true);
    setTimeLeft(INITIAL_TIME);
    setScore(0);
    setRound(generateRound());
    setSelectedIdxs([]);
  }

  function restart() {
    setShowResult(false);
    setShowStart(true);
    setIsRunning(false);
    setTimeLeft(INITIAL_TIME);
    setSelectedIdxs([]);
  }

  return (
    <main className="mx-auto min-h-svh max-w-4xl p-4 sm:p-6">
      <Toaster richColors position="top-center" />

      <div className="mx-auto grid w-fit grid-cols-1 gap-6 sm:grid-cols-[200px_1fr] sm:gap-14 sm:items-start">
        <Sidebar target={round.target} timeLeft={timeLeft} score={score} />

        <section className="relative">
          {/* ← ステータス（合計/選択）は上ではなく、ボードの下に移動 */}
          <div className="relative inline-block aspect-square w-[min(90vw,420px)] rounded-xl bg-cyan-50 p-3 ring-8 ring-blue-700/60 shadow-md sm:size-[520px] sm:p-4">
            <Grid
              numbers={round.numbers}
              selectedIdxs={selectedIdxs}
              onCellClick={handleCellClick}
              disabled={!isRunning || flashCorrect}
            />

            {showStart && (
              <button
                onClick={startGame}
                className="absolute inset-0 grid place-items-center rounded-lg bg-yellow-200/90"
              >
                <span className="text-4xl sm:text-5xl font-extrabold text-purple-700 drop-shadow">
                  スタート！
                </span>
              </button>
            )}

            {flashCorrect && (
              <div className="pointer-events-none absolute inset-0 grid place-items-center rounded-lg bg-emerald-200/70">
                <span className="text-4xl sm:text-5xl font-extrabold text-emerald-800">正解！</span>
              </div>
            )}
          </div>

          {/* ステータス行（合計/選択）— 下側に分離して配置 */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-700">
              合計: {currentSum}
            </span>
            {isRunning && (
              <span className="rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-700">
                選択: {selectedIdxs.length}/3
              </span>
            )}
          </div>
        </section>
      </div>
      <ResultModal open={showResult} score={score} onRestart={restart} />
    </main>
  );
}
