import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: Date
  read: boolean
}

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([
    {
      id: '1',
      title: 'New Task Assigned',
      message: 'You have been assigned to a new task: "Update customer database"',
      type: 'info',
      timestamp: new Date(),
      read: false
    },
    {
      id: '2',
      title: 'System Update',
      message: 'A new system update is available. Please update at your earliest convenience.',
      type: 'warning',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      read: false
    },
    {
      id: '3',
      title: 'Meeting Reminder',
      message: 'Team meeting starts in 30 minutes',
      type: 'info',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      read: true
    },
    {
      id: '4',
      title: 'Document Approved',
      message: 'Your document "Q2 Report" has been approved',
      type: 'success',
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      read: true
    },
    {
      id: '5',
      title: 'New Message',
      message: 'You have received a new message from John Doe',
      type: 'info',
      timestamp: new Date(Date.now() - 172800000), // 2 days ago
      read: true
    }
  ])

  const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)
  const latestNotifications = computed(() => notifications.value.slice(0, 5))

  function markAsRead(id: string) {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.read = true
    }
  }

  function markAllAsRead() {
    notifications.value.forEach(n => n.read = true)
  }

  return {
    notifications,
    unreadCount,
    latestNotifications,
    markAsRead,
    markAllAsRead
  }
}) 