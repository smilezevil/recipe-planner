import { useToastStore } from '../model/toastStore'
import './Toaster.scss'

function Toaster() {
    const toasts = useToastStore((state) => state.toasts)
    const dismissToast = useToastStore((state) => state.dismissToast)

    return (
        <div className="toaster" aria-live="polite">
            {toasts.map((toast) => (
                <div key={toast.id} className={`toaster__toast toaster__toast--${toast.variant}`} role="status">
                    <p className="toaster__message">{toast.message}</p>
                    <button
                        type="button"
                        className="toaster__close"
                        onClick={() => dismissToast(toast.id)}
                        aria-label="Закрити повідомлення"
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    )
}

export default Toaster