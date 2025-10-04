type Props = { onClose: () => void };

export default function HowTo({ onClose }: Props) {
  return (
    <div className="absolute inset-0 grid place-items-center rounded-xl bg-blue-950/70">
      {/* 盤面内で“内容に合わせた高さ”。横切れしないよう幅・余白を最適化 */}
      <div
        className="
          w-[95%] max-w-[560px]
          max-h-[96%] overflow-y-auto overscroll-contain
          rounded-xl bg-[#0a4fb8] p-3 text-white ring-4 ring-blue-200 sm:p-4
        "
      >
        {/* 見出し（コンパクト） */}
        <div className="mb-2 text-center text-[14px] font-bold leading-snug sm:mb-3 sm:text-[15px]">
          パネルから選んで
          <br />
          ターゲットの数字になるようにしよう
        </div>

        {/* ====== 例：左サイドバー + 3×3 ====== */}
        <div className="mx-auto w-fit flex items-start gap-3 sm:gap-4">
          {/* 左サイドバー */}
          <div className="flex w-[88px] shrink-0 flex-col items-stretch gap-2 sm:w-[104px] sm:gap-3">
            {/* ターゲット */}
            <div className="grid h-[132px] place-items-center rounded-lg bg-green-200 text-3xl font-extrabold text-green-900 ring-4 ring-green-600 sm:h-[144px]">
              10
            </div>
            {/* のこり時間 */}
            <div className="h-[36px] rounded-lg bg-blue-200 px-1.5 py-1 text-center ring-2 ring-blue-700/60 sm:h-[40px]">
              <div className="text-[11px] leading-none text-blue-900/80">のこり時間</div>
              <div className="text-[15px] font-bold leading-tight text-blue-950 sm:text-[16px]">
                1:00
              </div>
            </div>
            {/* 正解数 */}
            <div className="h-[36px] rounded-lg bg-orange-100 px-1.5 py-1 text-center ring-2 ring-orange-500/60 sm:h-[40px]">
              <div className="text-[11px] leading-none text-orange-900/80">正解数</div>
              <div className="text-[15px] font-bold leading-tight text-orange-800 sm:text-[16px]">
                0
              </div>
            </div>
          </div>

          {/* 右：3×3（横幅を少し抑えて切れないように） */}
          <div className="w-[218px] shrink-0 sm:w-[252px]">
            <div
              className="grid gap-2 sm:gap-3"
              style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}
            >
              {[
                { n: 1 },
                { n: 3, pick: true },
                { n: 4 },
                { n: 9 },
                { n: 0 },
                { n: 8 },
                { n: 6 },
                { n: 2, pick: true },
                { n: 5, pick: true },
              ].map((c, i) => (
                <div
                  key={i}
                  className={[
                    'grid w-full aspect-square place-items-center rounded-md font-extrabold ring-4',
                    'text-lg sm:text-xl',
                    c.pick
                      ? 'bg-yellow-300 text-yellow-900 ring-yellow-600'
                      : 'bg-cyan-200 text-blue-900 ring-blue-700/60',
                  ].join(' ')}
                >
                  {c.n}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ====== 足し算の例：中央配置、少し拡大 ====== */}
        <div className="mt-3 flex items-center justify-center gap-3 sm:mt-4 sm:gap-4">
          <div className="rounded-md bg-green-200 px-3.5 py-1.5 text-[22px] font-extrabold text-green-900 ring-2 ring-green-600 sm:text-[24px]">
            10
          </div>
          <div className="text-[22px] font-bold sm:text-[24px]">＝</div>
          {['3', '2', '5'].map((v, i) => (
            <div key={i} className="flex items-center">
              <div className="rounded-md bg-green-200 px-3 py-1 text-[22px] font-extrabold text-green-900 ring-2 ring-green-600 sm:text-[24px]">
                {v}
              </div>
              {i < 2 && <span className="mx-3 text-[22px] font-bold sm:text-[24px]">＋</span>}
            </div>
          ))}
        </div>

        {/* ====== とじる：下が見切れないよう確実に余白を確保 ====== */}
        <div className="mt-3 pb-1 text-center sm:mt-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-white px-7 py-2 text-base font-semibold text-blue-700 shadow ring-2 ring-blue-200 transition hover:scale-[1.02] sm:px-8 sm:py-2.5 sm:text-lg"
          >
            とじる
          </button>
        </div>
      </div>
    </div>
  );
}
