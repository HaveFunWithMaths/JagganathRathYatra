import { GameScreen } from './screens/GameScreen'
import { MainMenu } from './screens/MainMenu'
import { ModeSelect } from './screens/ModeSelect'
import { useGameStore } from './state/gameStore'

function App() {
  const phase = useGameStore((s) => s.phase)

  if (phase === 'menu') return <MainMenu />
  if (phase === 'modeSelect') return <ModeSelect />
  return <GameScreen />
}

export default App
