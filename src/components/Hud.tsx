type Props = { target: number; score: number; timeLeft?: number };

export default function Hud({ target, score, timeLeft }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <div className="text-center">
        <div className="text-xs text-gray-500">ターゲット</div>
        <div className="min-w-16 rounded-lg border px-3 py-2 text-lg font-bold">{target}</div>
      </div>
      <div className="text-center">
        <div className="text-xs text-gray-500">正解数</div>
        <div className="min-w-16 rounded-lg border px-3 py-2 text-lg font-bold">{score}</div>
      </div>
      <div className="text-center">
        <div className="text-xs text-gray-500">残り時間</div>
        <div className="min-w-16 rounded-lg border px-3 py-2 text-lg font-bold">
          {timeLeft ?? 60}s
        </div>
      </div>
    </div>
  );
}
