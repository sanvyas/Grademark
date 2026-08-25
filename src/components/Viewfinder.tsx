export function Viewfinder({ active }: { active: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="relative h-56 w-full max-w-xs">
        {(['top-4 left-4 border-l-4 border-t-4 rounded-tl-2xl', 'top-4 right-4 border-r-4 border-t-4 rounded-tr-2xl', 'bottom-4 left-4 border-l-4 border-b-4 rounded-bl-2xl', 'bottom-4 right-4 border-r-4 border-b-4 rounded-br-2xl'] as const).map(
          (pos) => (
            <span key={pos} className={`absolute h-8 w-8 border-white/90 ${pos}`} />
          ),
        )}
        {active && (
          <div className="absolute inset-x-4 top-4 h-0.5 animate-scan-line rounded-full bg-accent shadow-[0_0_12px_2px_rgba(34,197,94,0.7)]" />
        )}
      </div>
    </div>
  )
}
