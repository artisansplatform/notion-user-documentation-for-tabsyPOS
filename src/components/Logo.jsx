import Image from 'next/image'

export function Logomark(props) {
  return (
    <Image src="/images/favicon.png" width={32} height={32} alt="Logo" {...props} unoptimized />
  )
}

export function Logo(props) {
  return (
    <div className="flex items-center gap-3">
      <Image src="/images/favicon.png" width={32} height={32} alt="Logo" {...props} unoptimized />
      <p className="font-display font-medium text-slate-900 dark:text-white">TabsyPOS</p>
    </div>
  )
}
