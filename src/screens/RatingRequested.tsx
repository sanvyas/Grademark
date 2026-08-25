import { useNavigate, useParams } from 'react-router-dom'

export default function RatingRequested() {
  const { barcode = '' } = useParams()
  const navigate = useNavigate()

  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-3.5 bg-[#0A0A0B] px-[26px] text-center text-white">
      <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ background: 'oklch(0.56 0.1 150)' }}>
        <svg width="20" height="20" viewBox="0 0 14 14">
          <path d="M2 7l4 4 6-8" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h1 className="text-[19px] font-extrabold">Thanks — we&apos;ll rate this soon</h1>
      <p className="max-w-xs text-sm leading-relaxed text-white/55">
        Barcode {barcode} isn&apos;t in our database yet. We&apos;ll let you know once this product has been graded.
      </p>
      <button
        type="button"
        onClick={() => navigate('/')}
        className="mt-2 flex h-[46px] items-center justify-center rounded-full bg-white px-[30px] text-sm font-bold text-[#1A1A1A]"
      >
        Done
      </button>
      <button type="button" onClick={() => navigate('/history')} className="mt-1 text-[13px] text-white/50">
        View scan history
      </button>
    </div>
  )
}
