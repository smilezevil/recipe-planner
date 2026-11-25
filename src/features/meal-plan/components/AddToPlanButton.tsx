import { useState } from 'react'
import { useToastStore } from '../../../shared/model/toastStore'
import Modal from '../../../shared/ui/Modal'
import { DAY_LABELS, MEAL_TYPE_LABELS } from '../lib/labels'
import type { MealPlanFormData } from '../model/mealPlanSchema'
import { useMealPlanStore } from '../model/mealPlanStore'
import MealPlanForm from './MealPlanForm'
import './AddToPlanButton.scss'

interface AddToPlanButtonProps {
    recipeId: number
    recipeName: string
    defaultServings: number
}

function AddToPlanButton({ recipeId, recipeName, defaultServings }: AddToPlanButtonProps) {
    const [isOpen, setIsOpen] = useState(false)
    const addEntry = useMealPlanStore((state) => state.addEntry)
    const showToast = useToastStore((state) => state.showToast)

    function handleSubmit(values: MealPlanFormData) {
        addEntry({ id: recipeId, name: recipeName }, values)
        showToast(`Додано в план: ${DAY_LABELS[values.day]}, ${MEAL_TYPE_LABELS[values.mealType].toLowerCase()}`)
        setIsOpen(false)
    }

    return (
        <>
            <button type="button" className="add-to-plan-button" onClick={() => setIsOpen(true)}>
                📅 Додати в план
            </button>

            <Modal open={isOpen} title={`«${recipeName}» у план`} onClose={() => setIsOpen(false)}>
                <MealPlanForm
                    defaultValues={{ day: 'mon', mealType: 'dinner', servings: defaultServings, note: '' }}
                    submitLabel="Додати"
                    onSubmit={handleSubmit}
                    onCancel={() => setIsOpen(false)}
                />
            </Modal>
        </>
    )
}

export default AddToPlanButton