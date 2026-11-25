import type { ReactNode } from 'react'
import './StatusMessage.scss'

type StatusVariant = 'loading' | 'error' | 'empty'

interface StatusMessageProps {
    variant: StatusVariant
    title: string
    text?: string
    action?: ReactNode
}

function StatusMessage({ variant, title, text, action }: StatusMessageProps) {
    return (
        <div
            className={`status-message status-message--${variant}`}
            role={variant === 'error' ? 'alert' : 'status'}
        >
            {variant === 'loading' && <span className="status-message__spinner" aria-hidden="true" />}
            <p className="status-message__title">{title}</p>
            {text && <p className="status-message__text">{text}</p>}
            {action && <div className="status-message__action">{action}</div>}
        </div>
    )
}

export default StatusMessage