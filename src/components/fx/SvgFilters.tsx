/**
 * Shared <defs> mounted once near the SVG root. Glow stacks use feGaussianBlur
 * + feMerge (not box-shadow) since every visual in this game is SVG-native.
 */
export function SvgFilters() {
  return (
    <defs>
      <GlowFilter id="glow-cyan" color="#2de2ff" />
      <GlowFilter id="glow-magenta" color="#ff3df0" />
      <GlowFilter id="glow-gold" color="#ffb02e" />
      <GlowFilter id="glow-danger" color="#ff3b4e" />
      <GlowFilter id="glow-soft" color="#8fd8ff" deviation={2} />

      {/* Duotone grade for the provided illustrative artwork: desaturate,
          then remap shadows -> deep navy, highlights -> warm gold. */}
      <filter id="duotone-cyberpunk" colorInterpolationFilters="sRGB">
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncR type="table" tableValues="0.02 1.0" />
          <feFuncG type="table" tableValues="0.03 0.69" />
          <feFuncB type="table" tableValues="0.08 0.18" />
        </feComponentTransfer>
      </filter>

      <clipPath id="avatar-clip">
        <circle cx="50" cy="50" r="48" />
      </clipPath>
    </defs>
  )
}

function GlowFilter({
  id,
  color,
  deviation = 3.5,
}: {
  id: string
  color: string
  deviation?: number
}) {
  return (
    // Fixed, absolute filter region (userSpaceOnUse) rather than a percentage
    // of the element's own bounding box: perfectly horizontal/vertical edges
    // have a zero-width or zero-height geometry bbox, and objectBoundingBox
    // percentages of zero collapse the whole filter region to nothing —
    // silently clipping the entire stroke away. A generous absolute region
    // covers every node/edge/avatar position in both level canvases.
    <filter id={id} filterUnits="userSpaceOnUse" x={-400} y={-400} width={2400} height={1600}>
      <feFlood floodColor={color} result="flood" />
      <feComposite in="flood" in2="SourceAlpha" operator="in" result="tinted" />
      <feGaussianBlur in="tinted" stdDeviation={deviation} result="blurA" />
      <feGaussianBlur in="tinted" stdDeviation={deviation * 2.2} result="blurB" />
      <feMerge>
        <feMergeNode in="blurB" />
        <feMergeNode in="blurA" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  )
}
