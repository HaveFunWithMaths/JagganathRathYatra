import type { Level, LevelNode } from '../../levels'
import type { Point } from '../../logic/graphAnalysis'

export interface ViewBoxConfig {
  width: number
  height: number
  padX: number
  padY: number
}

const VIEWBOX: Record<Level['id'], ViewBoxConfig> = {
  easy: { width: 800, height: 800, padX: 100, padY: 100 },
  hard: { width: 1400, height: 560, padX: 110, padY: 110 },
}

export function getViewBoxConfig(levelId: Level['id']): ViewBoxConfig {
  return VIEWBOX[levelId]
}

export function toPoint(node: LevelNode, cfg: ViewBoxConfig): Point {
  return {
    x: cfg.padX + node.normX * (cfg.width - 2 * cfg.padX),
    y: cfg.padY + node.normY * (cfg.height - 2 * cfg.padY),
  }
}

/** Crossing-edge `bend` is authored as a fraction of the level's inner height. */
export function scaleBend(bend: number, cfg: ViewBoxConfig): number {
  return bend * (cfg.height - 2 * cfg.padY)
}

export function nodePointMap(level: Level, cfg: ViewBoxConfig): Map<string, Point> {
  const map = new Map<string, Point>()
  for (const node of level.nodes) map.set(node.id, toPoint(node, cfg))
  return map
}
