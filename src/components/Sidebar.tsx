import { formatMMSS } from '../lib/time';
import { cn } from '../lib/cn';

type BoxProps = {
  label?: string;
  tone: 'green' | 'blue' | 'orange';
  children: React.ReactNode;
  valueSizeClass: string;
  cornerNote?: string;
  className?: string;
};

function InfoBox({ label, children, tone, valueSizeClass, cornerNote, className }: BoxProps) {
  const tones = {
    green: 'bg-green-100 ring-green-500 text-green-900',
    blue: 'bg-blue-100 ring-blue-500 text-blue-900',
    orange: 'bg-orange-100 ring-orange-500 text-orange-900',
  } as const;

  return (
    <div className={cn('min-h-[104px] sm:min-h-0', className)}>
      <div
        className={cn(
          'relative grid h-full place-items-center rounded-xl px-4 py-2 leading-none',
          'ring-4 shadow-[inset_0_1px_0_rgba(255,255,255,.6)]',
          tones[tone],
        )}
      >
        {label && (
          <div className="absolute left-3 top-2 text-sm font-semibold text-slate-700/85">
            {label}
          </div>
        )}
        {cornerNote && (
          <div className="absolute right-2 top-2 rounded bg-black/10 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
            {cornerNote}
          </div>
        )}
        <div className={cn('font-extrabold', valueSizeClass)}>{children}</div>
      </div>
    </div>
  );
}

type SidebarProps = {
  target: number;
  timeLeft: number;
  score: number;
  gridSize: number;
  highScore: number;
};

export default function Sidebar({ target, timeLeft, score, gridSize, highScore }: SidebarProps) {
  const valueSize =
    gridSize === 5
      ? 'text-3xl sm:text-4xl'
      : gridSize === 4
        ? 'text-4xl sm:text-5xl'
        : 'text-5xl sm:text-6xl';

  return (
    /**
     * PC      : 左サイドに縦並び
     * モバイル: 3カラムのグリッドを横並びでグリッド上部に表示
     */
    <aside
      className={cn(
        'grid grid-cols-3 gap-3 w-full',
        'sm:flex sm:w-[200px] sm:h-[520px] sm:flex-col sm:gap-6 sm:grid-cols-1',
      )}
    >
      {/* ターゲット */}
      <InfoBox tone="green" valueSizeClass={valueSize} className="sm:flex-[7]">
        {target}
      </InfoBox>

      {/* 残り時間 */}
      <InfoBox label="のこり時間" tone="blue" valueSizeClass={valueSize} className="sm:flex-[4]">
        {formatMMSS(timeLeft)}
      </InfoBox>

      {/* 正解数 */}
      <InfoBox
        label="正解数"
        tone="orange"
        valueSizeClass={valueSize}
        className="sm:flex-[4]"
        cornerNote={`最高: ${highScore}`}
      >
        {score}
      </InfoBox>
    </aside>
  );
}
