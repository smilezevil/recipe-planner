import { useEffect, useId, useRef } from 'react'
import type { MouseEvent, ReactNode, SyntheticEvent } from 'react'
import './Modal.scss'

interface ModalProps {
    open: boolean
    title: string
    onClose: () => void
    children: ReactNode
}

function Modal({ open, title, onClose, children }: ModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const titleId = useId()

    useEffect(() => {
        const dialog = dialogRef.current
        if (!dialog) {
            return
        }

        if (open && !dialog.open) {
            dialog.showModal()
            dialog.querySelector<HTMLElement>('input, select, textarea')?.focus()
        }

        if (!open && dialog.open) {
            dialog.close()
        }
    }, [open])

    function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
        event.preventDefault()
        onClose()
    }

    function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
        if (event.target === event.currentTarget) {
            onClose()
        }
    }

    return (
        <dialog
            ref={dialogRef}
            className="modal"
            aria-labelledby={titleId}
            onCancel={handleCancel}
            onClick={handleBackdropClick}
        >
            {open && (
                <div className="modal__content">
                    <div className="modal__header">
                        <h2 id={titleId} className="modal__title">
                            {title}
                        </h2>
                        <button type="button" className="modal__close" onClick={onClose} aria-label="Закрити">
                            ×
                        </button>
                    </div>
                    {children}
                </div>
            )}
        </dialog>
    )
}

export default Modal