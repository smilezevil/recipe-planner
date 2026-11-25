import { useState } from 'react'
import { Link } from 'react-router'
import MealPlanForm from '../features/meal-plan/components/MealPlanForm'
import { DAY_LABELS, DAYS, MEAL_TYPE_LABELS, MEAL_TYPES } from '../features/meal-plan/lib/labels'
import type { MealPlanFormData } from '../features/meal-plan/model/mealPlanSchema'
import { useMealPlanStore } from '../features/meal-plan/model/mealPlanStore'
import type { MealPlanEntry } from '../features/meal-plan/model/types'
import { useDocumentTitle } from '../shared/lib/useDocumentTitle'
import { useToastStore } from '../shared/model/toastStore'
import Modal from '../shared/ui/Modal'
import StatusMessage from '../shared/ui/StatusMessage'
import './MealPlanPage.scss'

function sortByMealType(entries: MealPlanEntry[]): MealPlanEntry[] {
    return [...entries].sort((a, b) => MEAL_TYPES.indexOf(a.mealType) - MEAL_TYPES.indexOf(b.mealType))
}

function MealPlanPage() {
    const entries = useMealPlanStore((state) => state.entries)
    const updateEntry = useMealPlanStore((state) => state.updateEntry)
    const removeEntry = useMealPlanStore((state) => state.removeEntry)
    const clearPlan = useMealPlanStore((state) => state.clearPlan)
    const showToast = useToastStore((state) => state.showToast)

    const [editingEntry, setEditingEntry] = useState<MealPlanEntry | null>(null)
    const [isConfirmingClear, setIsConfirmingClear] = useState(false)

    useDocumentTitle('План харчування')

    const totalServings = entries.reduce((sum, entry) => sum + entry.servings, 0)

    function handleUpdate(values: MealPlanFormData) {
        if (!editingEntry) {
            return
        }

        updateEntry(editingEntry.id, values)
        showToast('Запис плану оновлено')
        setEditingEntry(null)
    }

    function handleRemove(entry: MealPlanEntry) {
        removeEntry(entry.id)
        showToast(`«${entry.recipeName}» прибрано з плану`, 'info')
    }

    function handleClear() {
        clearPlan()
        setIsConfirmingClear(false)
        showToast('План очищено', 'info')
    }

    return (
        <section className="meal-plan-page">
            <div className="meal-plan-page__header">
                <div>
                    <h1 className="meal-plan-page__title">План харчування</h1>
                    <p className="meal-plan-page__subtitle">
                        Страв у плані: {entries.length} · порцій: {totalServings}
                    </p>
                </div>

                {entries.length > 0 &&
                    (isConfirmingClear ? (
                        <div className="meal-plan-page__confirm">
                            <span>Очистити весь план?</span>
                            <button type="button" className="meal-plan-page__danger" onClick={handleClear}>
                                Так, очистити
                            </button>
                            <button type="button" className="meal-plan-page__secondary" onClick={() => setIsConfirmingClear(false)}>
                                Ні
                            </button>
                        </div>
                    ) : (
                        <button type="button" className="meal-plan-page__secondary" onClick={() => setIsConfirmingClear(true)}>
                            Очистити план
                        </button>
                    ))}
            </div>

            {entries.length === 0 ? (
                <StatusMessage
                    variant="empty"
                    title="План поки порожній"
                    text="Відкрийте рецепт і натисніть «Додати в план»."
                    action={
                        <Link className="meal-plan-page__primary" to="/recipes">
                            До каталогу
                        </Link>
                    }
                />
            ) : (
                <div className="meal-plan-page__days">
                    {DAYS.map((day) => {
                        const dayEntries = sortByMealType(entries.filter((entry) => entry.day === day))

                        return (
                            <section key={day} className="meal-plan-page__day">
                                <h2 className="meal-plan-page__day-title">{DAY_LABELS[day]}</h2>

                                {dayEntries.length === 0 ? (
                                    <p className="meal-plan-page__day-empty">Нічого не заплановано</p>
                                ) : (
                                    <ul className="meal-plan-page__entries">
                                        {dayEntries.map((entry) => (
                                            <li key={entry.id} className="meal-plan-page__entry">
                        <span className={`meal-plan-page__meal meal-plan-page__meal--${entry.mealType}`}>
                          {MEAL_TYPE_LABELS[entry.mealType]}
                        </span>
                                                <Link className="meal-plan-page__recipe" to={`/recipes/${entry.recipeId}`}>
                                                    {entry.recipeName}
                                                </Link>
                                                <span className="meal-plan-page__servings">Порцій: {entry.servings}</span>
                                                {entry.note && <p className="meal-plan-page__note">{entry.note}</p>}

                                                <div className="meal-plan-page__entry-actions">
                                                    <button
                                                        type="button"
                                                        className="meal-plan-page__link-button"
                                                        onClick={() => setEditingEntry(entry)}
                                                    >
                                                        Редагувати
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="meal-plan-page__link-button meal-plan-page__link-button--danger"
                                                        onClick={() => handleRemove(entry)}
                                                    >
                                                        Видалити
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </section>
                        )
                    })}
                </div>
            )}

            <Modal
                open={editingEntry !== null}
                title={editingEntry ? `Редагування: ${editingEntry.recipeName}` : ''}
                onClose={() => setEditingEntry(null)}
            >
                {editingEntry && (
                    <MealPlanForm
                        defaultValues={{
                            day: editingEntry.day,
                            mealType: editingEntry.mealType,
                            servings: editingEntry.servings,
                            note: editingEntry.note,
                        }}
                        submitLabel="Зберегти"
                        onSubmit={handleUpdate}
                        onCancel={() => setEditingEntry(null)}
                    />
                )}
            </Modal>
        </section>
    )
}

export default MealPlanPage