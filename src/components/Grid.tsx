type Props = {
  numbers?: number[]; // 9要素想定。未指定なら 1..9 を仮表示
  onCellClick?: (index: number) => void; // 後で実装予定
};

export default function Grid({ numbers, onCellClick }: Props) {
  const cells = numbers ?? Array.from({ length: 9 }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-3 gap-3">
      {cells.map((n, i) => (
        <button
          key={i}
          type="button"
          aria-label={`cell-${i + 1}`}
          className="h-20 w-20 rounded-xl border text-2xl font-bold"
          onClick={() => onCellClick?.(i)}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
