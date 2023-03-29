import {notification} from 'antd'
type NotificationType = 'success' | 'info' | 'warning' | 'error'

export function showNotification(type: NotificationType, title: string, message: string) {
  notification[type]({
    description: message,
    message: title,
    duration: 3,
  })
}
