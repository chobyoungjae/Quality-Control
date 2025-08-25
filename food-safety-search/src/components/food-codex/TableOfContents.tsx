'use client'

import React, { useState } from 'react'
import { ChevronRight, ChevronDown, FileText, Folder, FolderOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TOCItem } from '@/types/food-codex'

interface TableOfContentsProps {
  items: TOCItem[]
  onItemClick: (item: TOCItem) => void
  selectedItemId?: string
  className?: string
}

interface TOCItemComponentProps {
  item: TOCItem
  onItemClick: (item: TOCItem) => void
  selectedItemId?: string
  defaultExpanded?: boolean
}

const TOCItemComponent: React.FC<TOCItemComponentProps> = ({
  item,
  onItemClick,
  selectedItemId,
  defaultExpanded = false
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const hasChildren = item.children && item.children.length > 0
  const isSelected = item.id === selectedItemId

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (hasChildren) {
      setIsExpanded(!isExpanded)
    }
    
    // PDF URL이 있는 경우에만 클릭 이벤트 전달
    if (item.pdfUrl || !hasChildren) {
      onItemClick(item)
    }
  }

  const getIcon = () => {
    if (!hasChildren) {
      return <FileText className="h-4 w-4 text-gray-500" />
    }
    return isExpanded ? (
      <FolderOpen className="h-4 w-4 text-blue-600" />
    ) : (
      <Folder className="h-4 w-4 text-gray-500" />
    )
  }

  const getChevron = () => {
    if (!hasChildren) return null
    return isExpanded ? (
      <ChevronDown className="h-3 w-3 text-gray-400" />
    ) : (
      <ChevronRight className="h-3 w-3 text-gray-400" />
    )
  }

  return (
    <div className="select-none">
      <div
        className={cn(
          "flex items-center gap-1 px-2 py-1.5 rounded-md cursor-pointer transition-colors",
          "hover:bg-gray-100 dark:hover:bg-gray-800",
          isSelected && "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400",
          item.level === 1 && "font-semibold"
        )}
        style={{ paddingLeft: `${item.level * 12}px` }}
        onClick={handleClick}
      >
        {getChevron()}
        {getIcon()}
        <span className="flex-1 text-sm">
          <span className="text-gray-500 dark:text-gray-400 mr-1">
            {item.sectionNumber}
          </span>
          {item.title}
          {item.id === 'section5-13' && (
            <span className="ml-2 text-xs text-orange-600 dark:text-orange-400">★ 주요</span>
          )}
        </span>
      </div>
      
      {hasChildren && isExpanded && (
        <div className="ml-2">
          {item.children!.map(child => (
            <TOCItemComponent
              key={child.id}
              item={child}
              onItemClick={onItemClick}
              selectedItemId={selectedItemId}
              defaultExpanded={false}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  items,
  onItemClick,
  selectedItemId,
  className
}) => {
  return (
    <div className={cn("overflow-y-auto", className)}>
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
          식품공전 목차
        </h2>
        <div className="space-y-1">
          {items.map(item => (
            <TOCItemComponent
              key={item.id}
              item={item}
              onItemClick={onItemClick}
              selectedItemId={selectedItemId}
              defaultExpanded={item.id === 'section5'} // 제5장 기본 펼침
            />
          ))}
        </div>
      </div>
    </div>
  )
}