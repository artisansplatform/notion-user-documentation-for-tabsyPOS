import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import Image from 'next/image'

export function ZoomableImage({ src, alt, caption, className = '' }) {
  return (
    <figure className={className}>
      <Zoom
        overlayBgColorEnd="rgba(0, 0, 0, 0.95)"
        zoomMargin={40}
      >
        <Image
          src={src}
          alt={alt || ''}
          className="w-full rounded-lg"
          loading="lazy"
          width={800}
          height={600}
          unoptimized
        />
      </Zoom>
      {caption && (
        <figcaption className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}