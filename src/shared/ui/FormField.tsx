import type { ReactNode } from 'react'
import './FormField.scss'

interface FormFieldProps {
    label: string
    htmlFor: string
    error?: string
    hint?: string
    children: ReactNode
}

function FormField({ label, htmlFor, error, hint, children }: FormFieldProps) {
    return (
        <div className={`form-field ${error ? 'form-field--invalid' : ''}`}>
            <label className="form-field__label" htmlFor={htmlFor}>
                {label}
            </label>
            {children}
            {error ? (
                <p className="form-field__error" role="alert">
                    {error}
                </p>
            ) : (
                hint && <p className="form-field__hint">{hint}</p>
            )}
        </div>
    )
}

export default FormField