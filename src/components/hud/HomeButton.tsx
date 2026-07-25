import { useGameStore } from '../../state/gameStore'

export function HomeButton() {
  const goToMenu = useGameStore((s) => s.goToMenu)

  return (
    <button
      onClick={goToMenu}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan/40 bg-void/50 text-cyan transition-all hover:bg-cyan/20 active:scale-95 shadow-[0_0_10px_rgba(45,226,255,0.2)]"
      title="Home (Main Menu)"
      aria-label="Home Menu"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    </button>
  )
}
