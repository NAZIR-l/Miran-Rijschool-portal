import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'

const notifications = ref([
  {
    id: 1,
    type: "exam",
    title: "Theory Exam Result Available",
    message: "Your theory exam results from March 15th are now available. You passed with 85%!",
    timestamp: Date.now() - 3600000, // 1 hour ago
    read: false
  },
  {
    id: 2,
    type: "payment",
    title: "Payment Confirmation",
    message: "Your payment of €45.00 for practical exam booking has been processed successfully.",
    timestamp: Date.now() - 7200000, // 2 hours ago
    read: false
  },
  {
    id: 3,
    type: "announcement",
    title: "New PDF Material Added!",
    message: "Updated traffic signs study guide is now available in your downloads section.",
    timestamp: Date.now() - 86400000, // 1 day ago
    read: true
  },
  {
    id: 4,
    type: "exam",
    title: "Upcoming Exam Reminder",
    message: "Don't forget your practical exam scheduled for March 20th at 10:00 AM.",
    timestamp: Date.now() - 172800000, // 2 days ago
    read: false
  },
  {
    id: 5,
    type: "announcement",
    title: "System Maintenance Notice",
    message: "Scheduled maintenance on March 18th from 2:00-4:00 AM. Some features may be unavailable.",
    timestamp: Date.now() - 259200000, // 3 days ago
    read: true
  }
])

const refreshing = ref(false)

export function useNotifications() {
  const $q = useQuasar()

  // Computed properties
  const unreadCount = computed(() => 
    notifications.value.filter(n => !n.read).length
  )

  const hasUnread = computed(() => unreadCount.value > 0)

  // Utility functions
  function getNotificationIcon(type) {
    const icons = {
      exam: "assignment",
      payment: "payment",
      announcement: "campaign"
    }
    return icons[type] || "notifications"
  }

  function getNotificationColor(type) {
    const colors = {
      exam: "blue",
      payment: "green",
      announcement: "orange"
    }
    return colors[type] || "primary"
  }

  function formatTime(timestamp) {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) {
      return `${minutes} minutes ago`
    } else if (hours < 24) {
      return `${hours} hours ago`
    } else {
      return `${days} days ago`
    }
  }

  // Actions
  function markAsRead(notificationId) {
    const notification = notifications.value.find(n => n.id === notificationId)
    if (notification) {
      notification.read = true
      $q.notify({
        type: "positive",
        message: "Notification marked as read",
        position: "top"
      })
    }
  }

  function markAllAsRead() {
    notifications.value.forEach(n => n.read = true)
    $q.notify({
      type: "positive",
      message: "All notifications marked as read",
      position: "top"
    })
  }

  function dismissNotification(notificationId) {
    const index = notifications.value.findIndex(n => n.id === notificationId)
    if (index > -1) {
      notifications.value.splice(index, 1)
      $q.notify({
        type: "info",
        message: "Notification dismissed",
        position: "top"
      })
    }
  }

  function clearAllNotifications() {
    notifications.value = []
    $q.notify({
      type: "info",
      message: "All notifications cleared",
      position: "top"
    })
  }

  async function refreshNotifications() {
    refreshing.value = true
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      $q.notify({
        type: "positive",
        message: "Notifications refreshed",
        position: "top"
      })
    } catch (error) {
      $q.notify({
        type: "negative",
        message: "Failed to refresh notifications",
        position: "top"
      })
    } finally {
      refreshing.value = false
    }
  }

  // Add new notification (for demo purposes)
  function addNotification(notification) {
    const newNotification = {
      id: Date.now(),
      timestamp: Date.now(),
      read: false,
      ...notification
    }
    notifications.value.unshift(newNotification)
  }

  return {
    notifications: computed(() => notifications.value),
    unreadCount,
    hasUnread,
    refreshing: computed(() => refreshing.value),
    getNotificationIcon,
    getNotificationColor,
    formatTime,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    clearAllNotifications,
    refreshNotifications,
    addNotification
  }
}

