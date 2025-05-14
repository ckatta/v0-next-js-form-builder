"use client"

import * as React from "react"

type ToastProps = {
  id?: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

type ToasterToast = ToastProps & {
  id: string
  dismiss: () => void
}

const ToastContext = React.createContext<{
  toasts: ToasterToast[]
  toast: (props: ToastProps) => void
  dismiss: (toastId: string) => void
}>({
  toasts: [],
  toast: () => {},
  dismiss: () => {},
})

export const useToast = () => {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToasterToast[]>([])

  const toast = (props: ToastProps) => {
    const id = props.id || String(Date.now())
    const newToast = {
      ...props,
      id,
      dismiss: () => dismiss(id),
    }

    setToasts((prev) => [...prev, newToast])

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      dismiss(id)
    }, 5000)
  }

  const dismiss = (toastId: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== toastId))
  }

  return <ToastContext.Provider value={{ toasts, toast, dismiss }}>{children}</ToastContext.Provider>
}

export { ToastContext }
