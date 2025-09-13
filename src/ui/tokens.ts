// src/ui/tokens.ts
export const pillCls =
  'rounded-full bg-white/95 px-3.5 py-1.5 text-[13px] font-medium text-slate-800 shadow-sm ring-2 ring-slate-300/80';

export const btnBase =
  'rounded-lg px-3.5 py-1.5 text-sm font-medium bg-white shadow-sm ring-2 transition hover:bg-slate-50 active:translate-y-[0.5px] focus-visible:outline-none';

export const btnNeutral = `${btnBase} text-slate-800 ring-slate-300/80`;
export const btnDanger = `${btnBase} text-rose-800  ring-rose-400/70`;
export const btnInfo = `${btnBase} text-blue-800  ring-blue-400/70`;

// もう一度 / スタート用（紺）
export const btnPrimaryNavy =
  'rounded-lg px-5 py-2 text-base font-semibold text-white shadow-sm ' +
  'bg-indigo-800 hover:bg-indigo-900 active:translate-y-[0.5px] ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300';
