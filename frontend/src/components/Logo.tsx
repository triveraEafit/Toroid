// Toroid brand mark (concentric toroid ellipses) exported from Figma.
interface LogoProps {
  size?: number
  withName?: boolean
  nameColor?: string
}

export function Logo({ size = 32, withName = true, nameColor = '#fff' }: LogoProps) {
  const w = (41 / 32) * size
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
      <img src="/toroid-glyph.svg" width={w} height={size} alt="" aria-hidden="true" />
      {withName && (
        <span style={{ fontWeight: 700, fontSize: '1.25rem', color: nameColor }}>Toroid</span>
      )}
    </span>
  )
}
