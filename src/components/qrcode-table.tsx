'use client'

import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { getTableLink } from '@/lib/utils'

interface QRCodeTableProps {
  token: string
  tableNumber: number
  width?: number
  font?: string
}

export default function TableQRCode({ token, tableNumber, width = 250, font = '20px Arial' }: QRCodeTableProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.height = width + 70
    canvas.width = width
    const canvasContext = canvas.getContext('2d')! // Dùng để vẽ hình học phẳng, văn bản, hình ảnh, và các hiệu ứng đồ họa hai chiều.
    // Thiết lập màu sắc
    canvasContext.fillStyle = '#fff'
    // Vẽ hình
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)
    canvasContext.font = font
    canvasContext.textAlign = 'center'
    canvasContext.fillStyle = '#000'
    canvasContext.fillText(`Bàn số ${tableNumber}`, canvas.width / 2, canvas.width + 20)
    canvasContext.fillText(`Quét mã QR để gọi món`, canvas.width / 2, canvas.width + 50)
    // Tạo một canvas ảo để vẽ QR code lên đó trước khi vẽ lên canvas thật
    const virtalCanvas = document.createElement('canvas')
    // Tạo nội dung mã QR (URL)
    const qrContent = getTableLink({ token, tableNumber })
    QRCode.toCanvas(
      virtalCanvas,
      qrContent,
      {
        width,
        margin: 4
      },
      function (error) {
        if (error) console.error(error)
        canvasContext.drawImage(virtalCanvas, 0, 0, width, width)
      }
    )

    // Dependency array: Chỉ vẽ lại khi link hoặc chiều rộng thay đổi
  }, [token, tableNumber, width])

  return (
    <div className='flex flex-col items-center gap-2'>
      <canvas ref={canvasRef} className='rounded-lg border shadow-sm' />
    </div>
  )
}
