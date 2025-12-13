import { useRef, useEffect } from 'react'

export default function useCamera() {
  const videoRef = useRef(null)
  let streamRef = useRef(null)

  const start = async (constraints = { video: true, audio: false }) => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error('Camera not supported')
    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    streamRef.current = stream
    if (videoRef.current) videoRef.current.srcObject = stream
    return stream
  }

  const stop = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    if (videoRef.current) videoRef.current.srcObject = null
  }

  // Try to query the Permissions API for camera state. Not supported in all browsers.
  const getPermissionState = async () => {
    if (!navigator.permissions || !navigator.permissions.query) return 'unknown'
    try {
      const status = await navigator.permissions.query({ name: 'camera' })
      return status.state // 'granted' | 'prompt' | 'denied'
    } catch (e) {
      return 'unknown'
    }
  }

  // Convenience method that tries to request camera permission / start the stream
  const requestPermission = async (constraints = { video: true, audio: false }) => {
    try {
      await start(constraints)
      return { granted: true }
    } catch (error) {
      return { granted: false, error }
    }
  }

  useEffect(() => {
    return () => stop()
  }, [])

  return { videoRef, start, stop, getPermissionState, requestPermission }
}
