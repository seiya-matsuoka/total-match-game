import Hud from './components/Hud';
import Grid from './components/Grid';

export default function App() {
  return (
    <main className="mx-auto flex min-h-svh max-w-screen-sm flex-col items-center gap-6 p-4">
      <header className="mt-4 text-center">
        <h1 className="text-2xl font-bold">Total Match Game</h1>
        <p className="text-sm text-gray-500">3つ選んで合計をターゲットに合わせよう</p>
      </header>

      {/* ダミー値表示。ロジックは今後追加 */}
      <Hud target={12} score={0} timeLeft={60} />
      <Grid />

      <footer className="mt-auto flex gap-2">
        <button type="button" className="rounded-lg border px-3 py-1.5">
          リセット
        </button>
        <button type="button" className="rounded-lg border px-3 py-1.5">
          選択クリア
        </button>
      </footer>
    </main>
  );
}
