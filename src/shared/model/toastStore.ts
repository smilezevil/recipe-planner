import { create } from 'zustand'
import { TOAST_DURATION_MS } from '../config'

export type ToastVariant = 'success' | 'error' | 'info'

export interface Toast {
    id: number
    message: string
    variant: ToastVariant
}

interface ToastState {
    toasts: Toast[]
    showToast: (message: string, variant?: ToastVariant) => void
    dismissToast: (id: number) => void
}

export const useToastStore = create<ToastState>()((set, get) => ({
    toasts: [],

    showToast: (message, variant = 'success') => {
        const id = Date.now() + Math.random()
        set((state) => ({ toasts: [...state.toasts.slice(-2), { id, message, variant }] }))
        setTimeout(() => get().dismissToast(id), TOAST_DURATION_MS)
    },

    dismissToast: (id) => {
        set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }))
    },
}))