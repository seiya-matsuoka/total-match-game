import { cn } from '../lib/cn';

type Props = {
  numbers: number[];
  selectedIdxs: number[];
  onCellClick: (index: number) => void;
  disabled?: boolean;
};

export default function Grid({ numbers, selectedIdxs, onCellClick, disabled }: Props) {
  return (
    <div className="grid h-full w-full grid-cols-3 gap-2 sm:gap-3">
      {numbers.map((n, i) => {
        const selected = selectedIdxs.includes(i);
        return (
          <button
            key={i}
            type="button"
            aria-label={`cell-${i + 1}`}
            disabled={disabled}
            onClick={() => onCellClick(i)}
            className={cn(
              'w-full aspect-square select-none rounded-md text-4xl sm:text-5xl font-extrabold tracking-tight transition',
              'ring-4 shadow-sm focus:outline-none focus-visible:ring-4',
              selected
                ? 'bg-orange-300 text-yellow-900 ring-orange-600'
                : 'bg-cyan-200 text-blue-900 ring-blue-700/60 hover:bg-cyan-100',
              disabled && 'opacity-60 pointer-events-none',
            )}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}
