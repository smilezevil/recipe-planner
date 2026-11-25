import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoritesState {
    ids: number[]
    toggleFavorite: (id: number) => boolean
    removeFavorite: (id: number) => void
}

export const useFavoritesStore = create<FavoritesState>()(
    persist(
        (set, get) => ({
            ids: [],

            toggleFavorite: (id) => {
                const isFavorite = get().ids.includes(id)
                set((state) => ({
                    ids: isFavorite ? state.ids.filter((item) => item !== id) : [id, ...state.ids],
                }))
                return !isFavorite
            },

            removeFavorite: (id) => set((state) => ({ ids: state.ids.filter((item) => item !== id) })),
        }),
        { name: 'recipe-planner:favorites' },
    ),
)