import type { ToastItem } from './toast-context'

type Notification = Omit<ToastItem, 'id'>
type Listener = (notification: Notification) => void

const listeners = new Set<Listener>()

export function notify(notification: Notification) {
  listeners.forEach((listener) => listener(notification))
}

export function subscribeToNotifications(listener: Listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function notifySuccess(title: string, description?: string) {
  notify({ title, description, variant: 'success' })
}

export function notifyError(title: string, error?: unknown) {
  const description = error instanceof Error ? error.message : typeof error === 'string' ? error : undefined
  notify({ title, description, variant: 'error', duration: 6000 })
}
