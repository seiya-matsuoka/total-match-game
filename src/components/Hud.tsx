type Props = {
  target?: number;
  score?: number;
  timeLeft?: number;
};

export default function Hud({ target = 12, score = 0, timeLeft = 60 }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <div className="text-center">
        <div className="text-xs text-gray-500">ターゲット</div>
        <div className="min-w-16 rounded-lg border px-3 py-2 text-lg font-bold">{target}</div>
      </div>
      <div className="text-center">
        <div className="text-xs text-gray-500">スコア</div>
        <div className="min-w-16 rounded-lg border px-3 py-2 text-lg font-bold">{score}</div>
      </div>
      <div className="text-center">
        <div className="text-xs text-gray-500">残り時間</div>
        <div className="min-w-16 rounded-lg border px-3 py-2 text-lg font-bold">{timeLeft}s</div>
      </div>
    </div>
  );
}
