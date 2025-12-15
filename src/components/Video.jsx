export function Video({ src, controls = true }) {
  return (
    <video
      src={src}
      controls={controls}
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  )
}
