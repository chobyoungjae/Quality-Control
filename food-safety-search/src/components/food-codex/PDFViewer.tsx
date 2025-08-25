'use client'

import React, { useState, useEffect } from 'react'
import { Loader2, AlertCircle, ZoomIn, ZoomOut, RotateCw, Download, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PDFViewerProps {
  url: string
  pageNumber?: number
  className?: string
  title?: string
}

export const PDFViewer: React.FC<PDFViewerProps> = ({
  url,
  pageNumber = 1,
  className,
  title
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [scale, setScale] = useState(100)

  // PDF URL에 페이지 번호 추가
  const pdfUrlWithPage = pageNumber > 1 ? `${url}#page=${pageNumber}` : url

  useEffect(() => {
    setIsLoading(true)
    setError(null)
  }, [url, pageNumber])

  const handleLoad = () => {
    setIsLoading(false)
    setError(null)
  }

  const handleError = () => {
    setIsLoading(false)
    setError('PDF 파일을 불러올 수 없습니다.')
  }

  const handleZoomIn = () => {
    if (scale < 200) {
      setScale(scale + 25)
    }
  }

  const handleZoomOut = () => {
    if (scale > 50) {
      setScale(scale - 25)
    }
  }

  const handleResetZoom = () => {
    setScale(100)
  }

  const handleDownload = () => {
    window.open(url, '_blank')
  }

  const handleFullscreen = () => {
    const iframe = document.getElementById('pdf-iframe') as HTMLIFrameElement
    if (iframe) {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen()
      }
    }
  }

  return (
    <div className={cn("flex flex-col h-full bg-gray-100 dark:bg-gray-800", className)}>
      {/* 툴바 */}
      <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          {title && (
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {title}
            </h3>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={handleZoomOut}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            title="축소"
            disabled={scale <= 50}
          >
            <ZoomOut className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </button>
          
          <span className="px-2 text-sm text-gray-600 dark:text-gray-400">
            {scale}%
          </span>
          
          <button
            onClick={handleZoomIn}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            title="확대"
            disabled={scale >= 200}
          >
            <ZoomIn className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </button>
          
          <button
            onClick={handleResetZoom}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            title="원본 크기"
          >
            <RotateCw className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </button>
          
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
          
          <button
            onClick={handleFullscreen}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            title="전체 화면"
          >
            <Maximize2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </button>
          
          <button
            onClick={handleDownload}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            title="다운로드"
          >
            <Download className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* PDF 컨텐츠 */}
      <div className="flex-1 relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-10">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                PDF 파일을 불러오는 중...
              </p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-10">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                다시 시도
              </button>
            </div>
          </div>
        )}
        
        <iframe
          id="pdf-iframe"
          src={pdfUrlWithPage}
          className="w-full h-full border-0"
          style={{
            transform: `scale(${scale / 100})`,
            transformOrigin: 'top left',
            width: `${100 * (100 / scale)}%`,
            height: `${100 * (100 / scale)}%`
          }}
          onLoad={handleLoad}
          onError={handleError}
          title={title || "PDF Document"}
        />
      </div>
    </div>
  )
}