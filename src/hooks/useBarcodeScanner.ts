import { useCallback, useEffect, useRef, useState } from 'react'
import type { IScannerControls } from '@zxing/browser'

export type ScannerStatus = 'idle' | 'requesting-permission' | 'scanning' | 'denied' | 'unsupported' | 'error'

interface DetectedBarcode {
  rawValue: string
}

interface BarcodeDetectorLike {
  detect(source: CanvasImageSource): Promise<DetectedBarcode[]>
}

type BarcodeDetectorConstructor = new (options?: { formats?: string[] }) => BarcodeDetectorLike

// Feature-detected via a loose cast rather than a global `declare` — avoids clashing with
// whatever (if any) BarcodeDetector typings the installed TS/DOM lib version ships.
function getBarcodeDetectorConstructor(): BarcodeDetectorConstructor | undefined {
  return (window as unknown as { BarcodeDetector?: BarcodeDetectorConstructor }).BarcodeDetector
}

const BARCODE_FORMATS = ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'qr_code']

export function useBarcodeScanner({ onDetect, enabled }: { onDetect: (barcode: string) => void; enabled: boolean }) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number | null>(null)
  const zxingControlsRef = useRef<IScannerControls | null>(null)
  const [status, setStatus] = useState<ScannerStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  // Kept in a ref so the detection loop always calls the latest callback without
  // needing to restart the camera when the consumer's onDetect identity changes.
  const onDetectRef = useRef(onDetect)
  onDetectRef.current = onDetect

  const stop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    zxingControlsRef.current?.stop()
    zxingControlsRef.current = null
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
  }, [])

  useEffect(() => {
    if (!enabled) {
      stop()
      setStatus('idle')
      return
    }

    let cancelled = false

    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus('unsupported')
        setError('Camera access is not supported in this browser.')
        return
      }

      setStatus('requesting-permission')
      setError(null)

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        })
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }
        streamRef.current = stream

        const video = videoRef.current
        if (!video) return
        video.srcObject = stream
        video.setAttribute('playsinline', 'true')
        await video.play()
        if (cancelled) return
        setStatus('scanning')

        const DetectorCtor = getBarcodeDetectorConstructor()
        if (DetectorCtor) {
          const detector = new DetectorCtor({ formats: BARCODE_FORMATS })
          const loop = async () => {
            if (cancelled || !videoRef.current) return
            try {
              const results = await detector.detect(videoRef.current)
              if (results.length > 0) {
                onDetectRef.current(results[0].rawValue)
                return
              }
            } catch {
              // Transient per-frame decode errors are expected; keep scanning.
            }
            rafRef.current = requestAnimationFrame(loop)
          }
          rafRef.current = requestAnimationFrame(loop)
        } else {
          // Only browsers without the native BarcodeDetector (notably Safari) pay for this
          // ~150KB dependency — Chrome/Android never fetches it.
          const { BrowserMultiFormatReader } = await import('@zxing/browser')
          if (cancelled) return
          const reader = new BrowserMultiFormatReader()
          const controls = await reader.decodeFromStream(stream, video, (result) => {
            if (result) onDetectRef.current(result.getText())
          })
          if (cancelled) {
            controls.stop()
            return
          }
          zxingControlsRef.current = controls
        }
      } catch (err) {
        if (cancelled) return
        const name = err instanceof DOMException ? err.name : ''
        if (name === 'NotAllowedError' || name === 'PermissionDeniedError' || name === 'SecurityError') {
          setStatus('denied')
          setError('Camera permission was denied.')
        } else {
          setStatus('error')
          setError(err instanceof Error ? err.message : 'Could not start the camera.')
        }
      }
    }

    start()

    return () => {
      cancelled = true
      stop()
    }
  }, [enabled, stop])

  return { videoRef, status, error }
}
