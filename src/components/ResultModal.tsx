import * as Dialog from '@radix-ui/react-dialog';

type Props = { open: boolean; score: number; onRestart: () => void };
export default function ResultModal({ open, score, onRestart }: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onRestart()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/45" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-80 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-5 shadow-xl">
          <Dialog.Title className="text-lg font-bold">タイムアップ！</Dialog.Title>
          <p className="mt-2 text-sm text-gray-600">
            正解数：<b>{score}</b>
          </p>
          <div className="mt-4 flex justify-end">
            <button onClick={onRestart} className="rounded-md border px-3 py-1.5">
              もう一度
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
