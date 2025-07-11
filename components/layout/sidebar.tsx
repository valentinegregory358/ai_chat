'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  MessageSquare, 
  Plus, 
  History, 
  Settings, 
  Menu,
  X,
  Trash2,
  Edit3
} from 'lucide-react'
import { useChatStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { cn, formatRelativeTime, truncateText } from '@/lib/utils'

export function Sidebar() {
  const pathname = usePathname()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  
  const {
    conversations,
    currentConversationId,
    sidebarCollapsed,
    createConversation,
    deleteConversation,
    updateConversation,
    setCurrentConversation,
    toggleSidebar,
  } = useChatStore()

  const handleNewChat = () => {
    const id = createConversation()
    setCurrentConversation(id)
  }

  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    deleteConversation(id)
  }

  const handleEditTitle = (id: string, title: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setEditingId(id)
    setEditTitle(title)
  }

  const handleSaveTitle = (id: string) => {
    if (editTitle.trim()) {
      updateConversation(id, { title: editTitle.trim() })
    }
    setEditingId(null)
    setEditTitle('')
  }

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      handleSaveTitle(id)
    } else if (e.key === 'Escape') {
      setEditingId(null)
      setEditTitle('')
    }
  }

  const navigation = [
    { name: 'Chat', href: '/', icon: MessageSquare },
    { name: 'History', href: '/history', icon: History },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  if (sidebarCollapsed) {
    return (
      <div className="fixed left-0 top-0 z-40 h-full w-16 bg-[var(--bg-card)] border-r border-[var(--border-light)] flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="mb-4"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNewChat}
          className="mb-4"
        >
          <Plus className="h-5 w-5" />
        </Button>

        <nav className="flex flex-col space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "w-12 h-12",
                    isActive && "bg-[var(--bg-section)] text-[var(--text-primary)]"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </Button>
              </Link>
            )
          })}
        </nav>
      </div>
    )
  }

  return (
    <div className="fixed left-0 top-0 z-40 h-full w-80 bg-[var(--bg-card)] border-r border-[var(--border-light)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border-light)]">
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Cursor</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <Button
          onClick={handleNewChat}
          className="w-full justify-start"
          variant="gradient"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Navigation */}
      <nav className="px-4 pb-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    isActive && "bg-[var(--bg-section)] text-[var(--text-primary)]"
                  )}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Button>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Conversations List */}
      <div className="flex-1 overflow-hidden">
        <div className="px-4 pb-2">
          <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-2">
            Recent Conversations
          </h3>
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 space-y-1">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={cn(
                "group relative rounded-lg p-3 cursor-pointer transition-colors hover:bg-[var(--bg-section)]",
                currentConversationId === conversation.id && "bg-[var(--bg-section)]"
              )}
              onClick={() => setCurrentConversation(conversation.id)}
            >
              {editingId === conversation.id ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={() => handleSaveTitle(conversation.id)}
                  onKeyDown={(e) => handleKeyDown(e, conversation.id)}
                  className="w-full bg-transparent text-sm font-medium text-[var(--text-primary)] border-none outline-none"
                  autoFocus
                />
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                        {truncateText(conversation.title, 30)}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        {formatRelativeTime(conversation.updatedAt)}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => handleEditTitle(conversation.id, conversation.title, e)}
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-500 hover:text-red-600"
                        onClick={(e) => handleDeleteConversation(conversation.id, e)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {conversation.messages.length > 0 && (
                    <p className="text-xs text-[var(--text-muted)] mt-2 line-clamp-2">
                      {truncateText(conversation.messages[conversation.messages.length - 1]?.content || '', 60)}
                    </p>
                  )}
                </>
              )}
            </div>
          ))}
          
          {conversations.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="h-8 w-8 text-[var(--text-muted)] mx-auto mb-2" />
              <p className="text-sm text-[var(--text-muted)]">No conversations yet</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Start a new chat to begin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}