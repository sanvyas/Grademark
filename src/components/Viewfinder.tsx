export function Viewfinder({ scanning = false }: { scanning?: boolean }) {
  return (
    <div className="relative h-[150px] w-[250px]">
      <div
        className="absolute -inset-4 animate-gm-pulse rounded-[22px]"
        style={{
          boxShadow: '0 0 0 1px rgba(255,255,255,0.06)',
          background: 'radial-gradient(closest-side, rgba(255,255,255,0.08), transparent)',
        }}
      />
      <span className="absolute left-0 top-0 h-[26px] w-[26px] rounded-tl-md border-l-[3px] border-t-[3px] border-white/90" />
      <span className="absolute right-0 top-0 h-[26px] w-[26px] rounded-tr-md border-r-[3px] border-t-[3px] border-white/90" />
      <span className="absolute bottom-0 left-0 h-[26px] w-[26px] rounded-bl-md border-b-[3px] border-l-[3px] border-white/90" />
      <span className="absolute bottom-0 right-0 h-[26px] w-[26px] rounded-br-md border-b-[3px] border-r-[3px] border-white/90" />
      {scanning && (
        <div
          className="absolute inset-x-0 top-1/2 h-0.5 animate-gm-scanline"
          style={{ background: 'oklch(0.75 0.12 150)', boxShadow: '0 0 14px oklch(0.75 0.12 150)' }}
        />
      )}
    </div>
  )
}
