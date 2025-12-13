import React, { useEffect, useRef } from 'react'

export default function FaceCanvas({ detections = [], videoRef }){
  const canvasRef = useRef(null)

  useEffect(()=>{
    const video = videoRef?.current
    const canvas = canvasRef.current
    if(!video || !canvas) return
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0,0,canvas.width, canvas.height)
    detections.forEach(det => {
      const { box } = det.detection
      ctx.strokeStyle = '#06b6d4'
      ctx.lineWidth = 2
      ctx.strokeRect(box.x, box.y, box.width, box.height)
      const label = det.label || ''
      ctx.fillStyle = 'rgba(8,145,178,0.9)'
      ctx.font = '16px sans-serif'
      ctx.fillText(label, box.x + 4, box.y + 20)
    })
  }, [detections, videoRef])

  return (
    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
  )
}
