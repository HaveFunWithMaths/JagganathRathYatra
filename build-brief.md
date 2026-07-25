# Jagannath Rath Yatra — Eulerian Walk Game
## Planning-Mode Project Brief

You are planning and then building a browser-based 2D puzzle game for kids aged 10–15, playable on both mobile and desktop. Read this whole brief before proposing a plan. Do not start writing implementation code yet — first produce the plan requested in Section 12.

---

## 1. Project Summary

**Game:** Jagannath Rath Yatra
**Core mechanic:** An Eulerian Walk / Eulerian Trail puzzle. The player is shown a graph (nodes + edges), picks a starting node, and must move a Jagannath avatar across every edge exactly once. Edges already traversed change color/state. Nodes may be revisited freely; edges may not. The player wins when every edge has been traversed. If the player reaches a node where every remaining edge from that node is already used, but untraversed edges still exist elsewhere in the graph, the run ends in a dead end.

**Modes:** Easy and Hard, each using one fixed, pre-authored graph (see Section 5 — do not generate or curate additional graphs, see Section 10).

---

## 2. Tech Stack (fixed)

- **React** (with **Vite** as the build tool)
- **SVG** for all graph rendering (nodes, edges, avatar path) — not Canvas, not a game engine
- **GSAP** (including the MotionPath plugin) for all animation: avatar movement along edges, edge state transitions, screen/scene transitions, victory and dead-end sequences
- **Tailwind CSS** for menus, HUD, buttons, and general UI chrome
- State management: your choice (React Context/useReducer or Zustand) — propose one in your plan with reasoning
- Sound is not required for this pass but keep the architecture open to adding it later (e.g. Howler.js) without a rewrite

---

## 3. Visual Direction: Cyberpunk

- Dark base palette (near-black / deep navy backgrounds) with neon accent colors — cyan, magenta/violet, and one warm gold/amber accent (nod to the temple gold of the source theme without depicting temple iconography literally).
- Edges read like circuit traces or data lines: dim/desaturated when untraversed, glowing/animated when the player is standing on an adjacent legal move, solid saturated neon once traversed.
- Nodes read like terminals or junction points — glowing ring, pulsing subtly when idle, brighter pulse when they're a currently-reachable destination.
- Use SVG filters (`feGaussianBlur` / glow stacks) for the neon-glow look rather than relying on box-shadow, since this is all SVG.
- Consider a light glitch/scanline effect available as a reusable visual motif — it's very on-theme for cyberpunk and useful for the dead-end sequence (see 7.5).
- **Provided assets:** a Jagannath character avatar image and a separate Jagannath image for the Main Menu (assets/jagannath-avatar.jpg` and `/assets/jagannath-menu.jpg`). These are likely rendered in a traditional/illustrative style, not natively cyberpunk. Avatar is circular. Plan a lightweight visual treatment to integrate them — e.g. a neon rim-light/outer-glow filter, a subtle duotone color grade matching the palette, or a holographic scanline overlay — so they don't look pasted onto the UI. Do not redraw or replace the artwork itself.
---
## 4. Typography:
- a technical/futuristic display font for headings and HUD numerals (something like Orbitron or Rajdhani from Google Fonts), paired with a clean, very readable body font — remember the audience is 10–15, so legibility beats stylization for anything the player must read quickly (progress counter, buttons).

---
## 5. Level Data (authoritative — use exactly these two graphs)

### 5.1 Easy Mode

Source: Graphviz, `neato` layout, explicit pinned positions. 9 nodes, 11 edges.

**Edges:**
`A-B, A-C, B-D, C-D, C-E, C-F, E-F, F-G, E-H, H-I, I-G`

**Degrees:** A=2, B=2, C=4, D=2, E=3, F=3, G=2, H=2, I=2
**Valid start/end nodes: E and F** (both degree 3 — this is an Eulerian trail, not a circuit)

**Normalized layout** (converted from the original Graphviz `pos` coordinates; 0–1 range, origin top-left, so this is ready to scale into any SVG `viewBox` — note the Y-axis was flipped during conversion, since Graphviz's Y increases upward and SVG's Y increases downward):

| Node | normX | normY |
|------|-------|-------|
| A | 0.37 | 0.00 |
| B | 0.80 | 0.00 |
| C | 0.37 | 0.27 |
| D | 0.80 | 0.27 |
| E | 0.00 | 0.71 |
| F | 0.37 | 0.71 |
| G | 1.00 | 0.71 |
| H | 0.17 | 1.00 |
| I | 0.80 | 1.00 |

This preserves the original shape: a top square (A/B/C/D), a triangle down to a middle row (C→E, C→F, E-F), the middle row extending to G, and a bottom pentagon-like run (E-H-I-G). No edges cross in this layout — treat Easy mode as fully planar, no bridge/hop rendering needed.

<details>
<summary>Raw Graphviz source (reference)</summary>

```
graph FromImage {
    layout=neato; overlap=false; splines=true;
    node [shape=circle, style=filled, fillcolor="#AED6F1", fontsize=14];
    edge [color="#34495E", penwidth=2];
    A [pos="2.72,6.37!"]; B [pos="5.08,6.37!"]; C [pos="2.72,4.82!"];
    D [pos="5.08,4.82!"]; E [pos="0.62,2.23!"]; F [pos="2.72,2.23!"];
    G [pos="6.23,2.23!"]; H [pos="1.58,0.57!"]; I [pos="5.08,0.57!"];
    A -- B; A -- C; B -- D; C -- D;
    C -- E; C -- F; E -- F; F -- G;
    E -- H; H -- I; I -- G;
}
```
</details>

### 5.2 Hard Mode

Source: Graphviz, no fixed positions — the structure is an implicit **6-column × 3-row grid** (confirmed by the vertical connectors matching column index exactly). 18 nodes, 31 edges.

**Grid layout formula** (normalized 0–1):
- Row 1 = A B C D E F, Row 2 = G H I J K L, Row 3 = M N O P Q R
- Column index 1–6 left to right within each row
- `normX = (column - 1) / 5`, `normY = (row - 1) / 2`

```
Row1:  A----B----C----D----E----F     (normY = 0.0)
Row2:  G----H----I----J----K----L     (normY = 0.5)
Row3:  M----N----O----P----Q----R     (normY = 1.0)
       col: 0  .2  .4  .6  .8  1.0  (normX)
```

**Edges, by category:**
- Row edges: `A-B B-C C-D D-E E-F` / `G-H H-I I-J J-K K-L` / `M-N N-O O-P P-Q Q-R`
- Vertical connectors (same column across rows): `A-G G-M`, `B-H H-N`, `C-I I-O`, `D-J J-P`, `E-K K-Q`, `F-L L-R`
- **Extra "skip" edges (these create crossings — see below):** `B-D`, `C-E`, `N-P`, `O-Q`

**Degrees:** all nodes are degree 2 or 4, **except G and L, which are degree 3.**
**Valid start/end nodes: G and L.**

**Crossing-edge handling — this is the important part the user flagged as needing careful treatment:**
- `B-D` and `C-E` are both in Row 1. `B-D` skips over column 3 (C); `C-E` skips over column 4 (D). If both are drawn as arcs bulging to the same side of the row, their spans overlap (columns 2–4 vs 3–5) and they will visually cross once, roughly between C and D.
- The same situation repeats in Row 3 with `N-P` and `O-Q`.
- Do not let these read as a false intersection/node. Render the crossing with a clear "hop" — e.g. one edge gets a small gap in its stroke where the other passes over it (circuit-board-trace style), or give the two arcs distinguishable curvature/z-ordering so it's unambiguous which line is which. This should be a reusable rendering utility, since the same crossing pattern occurs twice (Row 1 and Row 3).

<details>
<summary>Raw Graphviz source (reference)</summary>

```
graph EulerianPathProblem {
    layout=neato; overlap=false; splines=true;
    node [shape=circle, style=filled, fillcolor="#AED6F1", fontsize=14];
    edge [color="#34495E"];
    A -- B; B -- C; C -- D; D -- E; E -- F;
    G -- H; H -- I; I -- J; J -- K; K -- L;
    M -- N; N -- O; O -- P; P -- Q; Q -- R;
    A -- G; G -- M; B -- H; H -- N; C -- I; I -- O;
    D -- J; J -- P; E -- K; K -- Q; F -- L; L -- R;
    B -- D; C -- E; N -- P; O -- Q;
}
```
</details>

---

## 6. Screens & Flow

1. **Main Menu** — Jagannath main menu image, game title, Play button, mode selection entry point.
2. **Mode Select** — Easy / Hard.
3. **Game Screen** — the graph, the avatar, HUD (progress readout, undo button), node-selection state at the start of a run.
4. **Victory Screen** — triggered when all edges are traversed.
5. **Dead-End / Try Again Screen** — triggered when stuck with edges remaining. Per the original spec: camera zooms in on the Jagannath avatar at the stuck node, visually confirming there are no traversable edges left from that position.
6. Both end screens return to Mode Select or Main Menu.

---

## 7. Feature Requirements

### 7.1 Highlight legal next moves
From the avatar's current node, every untraversed incident edge should be visually distinguished (pulse/glow) so the player always knows their options at a glance — important for the target age group.

### 7.2 Undo
Maintain a move history stack (sequence of traversed edges in order). Undo pops the last move: reverts that edge to untraversed state, moves the avatar back to the previous node, updates progress readout and legal-move highlighting. Should work for multiple consecutive undos.

### 7.3 Progress readout
Live counter (e.g. "17 / 31 edges") plus a visual progress indicator, styled to match the cyberpunk HUD.

### 7.4 Mobile tap targets
Nodes need a comfortably large tap target (roughly 44×44px effective, even if the visible node graphic is smaller). Edges are thin lines and are much harder to hit precisely on a touchscreen — give each edge an invisible, wider hit-area path layered with the visible thin neon line, so taps near the edge still register without needing pixel-perfect precision.

### 7.5 Distinct victory vs. dead-end animation language
These should be immediately, unmistakably different, ideally readable before any text renders:
- **Victory:** warm/triumphant palette shift, a traversal energy pulse running back along the completed path, particle/burst effect, avatar celebration pose.
- **Dead-end:** camera zooms in tight on the avatar at the stuck node (per original spec), cooler/desaturated or red-tinted palette shift, a glitch/static visual beat fits the cyberpunk aesthetic well here and reinforces "system error" without needing extra text.

### 7.6 Crossing-edge rendering
See Section 5.2 — implement the bridge/hop treatment for the four flagged Hard-mode edges (`B-D`, `C-E`, `N-P`, `O-Q`).

### 7.7 Crossed Nodes
Once a Node is crossed, its color changes to indicate its crossed

---

## 8. Responsive Design: Mobile vs. Desktop

The layouts should not just scale the same design down — design each to use its available screen space well:
- **Desktop:** wider viewport allows the graph to sit centered with dedicated side or top HUD panels (progress, undo, mode indicator) rather than overlaying the graph.
- **Mobile:** prioritize the graph filling most of the vertical space; collapse HUD elements into a compact top or bottom bar within thumb reach. For the larger Hard-mode graph (18 nodes across a wide grid), consider whether pinch-zoom/pan is needed to avoid cramming, or whether the SVG `viewBox` + `preserveAspectRatio` scaling is sufficient — propose an approach in your plan.

---

## 9. Assets

Two images will be supplied:
- Jagannath character avatar (used as the moving token on the graph)
- Jagannath image for the Main Menu

Treat both as fixed, provided artwork (see Section 3 for visual integration approach). Do not generate replacement art for these.

---

## 10. Explicit Non-Goals (scope guardrails)

- Do **not** represent the three chariots (Jagannath/Balabhadra/Subhadra) — one avatar, one graph per run.
- Do **not** build kolam/rangoli-pattern visuals or reference them in the design.
- Do **not** curate or generate multiple graphs per difficulty — exactly the two graphs in Section 5, used as-is.

---

## 11. Suggested Starting Architecture (refine as needed in your plan)

- `App` → routes/state between Menu, Mode Select, Game, Victory, Dead-End
- `MainMenu`, `ModeSelect`, `VictoryScreen`, `DeadEndScreen` — mostly presentational
- `GameScreen` — composed of `GraphCanvas` (SVG graph + avatar), `HUD` (progress + undo), and game-state orchestration
- `graphAnalysis.ts` — degree computation, valid-start detection, dead-end/victory detection (pure functions, unit-testable, decoupled from React/GSAP)
- `levels/easy.ts`, `levels/hard.ts` — the structured node/edge/layout data from Section 5
- Animation logic (GSAP timelines for avatar movement, edge state changes, screen transitions) isolated in its own module/hook rather than scattered through components

---

## 12. What I want from Planning Mode

Before writing implementation code, produce a plan covering:

1. Final component/file architecture (confirm or revise Section 11)
2. State schema (current node, traversed-edge set, move history for undo, game phase)
3. The animation approach for: legal-move highlighting, avatar movement along an edge (GSAP MotionPath), edge state transitions, and the victory/dead-end sequences
4. Concrete rendering approach for the Hard-mode crossing edges (Section 5.2/7.6)
5. Concrete responsive strategy for mobile vs. desktop (Section 8)
6. Any open questions or assumptions you need me to confirm before implementation begins
