import { cn } from '../lib/cn';
import type { ControlMode } from '../game/config';

type Props = {
  size: number;
  numbers: number[];
  selectedIdxs: number[];
  focusIdx?: number | null;
  hoverIdx?: number | null; // ★ 追加
  controlMode: ControlMode; // ★ 追加
  onCellClick: (index: number) => void;
  onHover?: (index: number | null) => void; // ★ 追加
  disabled?: boolean;
  className?: string; // ★ 追加（アニメ付与用）
};

export default function Grid({
  size,
  numbers,
  selectedIdxs,
  focusIdx,
  hoverIdx,
  controlMode,
  onCellClick,
  onHover,
  disabled,
  className,
}: Props) {
  return (
    <div
      className={cn('grid h-full w-full gap-2 sm:gap-3', className)}
      style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
      onMouseLeave={() => onHover?.(null)}
    >
      {numbers.map((n, i) => {
        const selected = selectedIdxs.includes(i);
        const isFocusLike = controlMode === 'keyboard' ? focusIdx === i : hoverIdx === i;

        return (
          <button
            key={i}
            type="button"
            aria-label={`cell-${i + 1}`}
            aria-pressed={selected}
            disabled={disabled}
            onClick={() => onCellClick(i)}
            onMouseEnter={() => onHover?.(i)}
            className={cn(
              'w-full aspect-square select-none rounded-md font-extrabold tracking-tight transition',
              size === 5
                ? 'text-2xl sm:text-3xl'
                : size === 4
                  ? 'text-3xl sm:text-4xl'
                  : 'text-4xl sm:text-5xl',
              'ring-4 shadow-sm focus:outline-none',
              selected
                ? 'bg-orange-300 text-yellow-900 ring-orange-600 animate-[select_140ms_ease-out] scale-[.98]'
                : 'bg-cyan-200 text-blue-900 ring-blue-700/60 hover:bg-cyan-100',
              disabled && 'opacity-60 pointer-events-none',
              isFocusLike && 'outline-[3px] outline-fuchsia-500/80 outline-offset-2',
            )}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}
