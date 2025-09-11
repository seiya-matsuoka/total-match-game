import { formatMMSS } from '../lib/time';
import { cn } from '../lib/cn';

type BoxProps = {
  label?: string; // 枠内に表示するラベル
  tone: 'green' | 'blue' | 'orange';
  children: React.ReactNode; // 値（数字など）
  className?: string; // 行の比率指定など
};

function InfoBox({ label, children, tone, className }: BoxProps) {
  const tones = {
    green: 'bg-green-100 ring-green-500 text-green-900',
    blue: 'bg-blue-100 ring-blue-500 text-blue-900',
    orange: 'bg-orange-100 ring-orange-500 text-orange-900',
  } as const;

  return (
    <div className={cn('min-h-0', className)}>
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
        <div className="text-4xl sm:text-5xl font-extrabold">{children}</div>
      </div>
    </div>
  );
}

type SidebarProps = { target: number; timeLeft: number; score: number };

/** ボード(520px)と高さを合わせ、行配分は「高:低:低」 */
export default function Sidebar({ target, timeLeft, score }: SidebarProps) {
  return (
    <aside className="flex w-full max-w-[200px] flex-col gap-6 sm:h-[520px] sm:w-[200px]">
      {/* ターゲット：背高め（比率7） */}
      <InfoBox tone="green" className="flex-[7]">
        {target}
      </InfoBox>
      {/* 残り時間・正解数：背低め（比率4/4） */}
      <InfoBox label="のこり時間" tone="blue" className="flex-[4]">
        {formatMMSS(timeLeft)}
      </InfoBox>
      <InfoBox label="正解数" tone="orange" className="flex-[4]">
        {score}
      </InfoBox>
    </aside>
  );
}
