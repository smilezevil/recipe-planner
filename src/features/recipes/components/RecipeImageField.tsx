import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { getErrorMessage } from '../../../shared/api/errors'
import { resizeImage } from '../../../shared/lib/resizeImage'
import FormField from '../../../shared/ui/FormField'
import './RecipeImageField.scss'

const MAX_FILE_SIZE = 5 * 1024 * 1024

interface RecipeImageFieldProps {
    value: string
    onChange: (value: string) => void
    error?: string
}

function RecipeImageField({ value, onChange, error }: RecipeImageFieldProps) {
    const [isProcessing, setIsProcessing] = useState(false)
    const [fileError, setFileError] = useState<string | null>(null)

    async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]
        event.target.value = ''

        if (!file) {
            return
        }

        if (!file.type.startsWith('image/')) {
            setFileError('Оберіть файл зображення')
            return
        }

        if (file.size > MAX_FILE_SIZE) {
            setFileError('Файл завеликий, максимум 5 МБ')
            return
        }

        setIsProcessing(true)

        try {
            onChange(await resizeImage(file))
            setFileError(null)
        } catch (resizeError) {
            setFileError(getErrorMessage(resizeError))
        } finally {
            setIsProcessing(false)
        }
    }

    function handleRemove() {
        onChange('')
        setFileError(null)
    }

    return (
        <FormField
            label="Фото"
            htmlFor="recipe-image"
            error={fileError ?? error}
            hint="Необовʼязково. JPG, PNG або WEBP до 5 МБ"
        >
            <div className="recipe-image-field">
                <input
                    id="recipe-image"
                    className="recipe-image-field__input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />

                {value ? (
                    <>
                        <img className="recipe-image-field__preview" src={value} alt="Фото рецепта" />
                        <div className="recipe-image-field__actions">
                            <label className="recipe-image-field__change" htmlFor="recipe-image">
                                Змінити фото
                            </label>
                            <button type="button" className="recipe-image-field__remove" onClick={handleRemove}>
                                Прибрати фото
                            </button>
                        </div>
                    </>
                ) : (
                    <label className="recipe-image-field__empty" htmlFor="recipe-image">
                        {isProcessing ? 'Обробка фото...' : '📷 Додати фото'}
                    </label>
                )}
            </div>
        </FormField>
    )
}

export default RecipeImageField