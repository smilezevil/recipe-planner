import { useEffect } from 'react'
import { getErrorMessage } from '../shared/api/errors'
import { PAGE_SIZE } from '../shared/config'
import { useDocumentTitle } from '../shared/lib/useDocumentTitle'
import Pagination from '../shared/ui/Pagination'
import StatusMessage from '../shared/ui/StatusMessage'
import RecipeCard from '../features/recipes/components/RecipeCard'
import RecipeFilters from '../features/recipes/components/RecipeFilters'
import RecipeGrid from '../features/recipes/components/RecipeGrid'
import { useRecipeQueryParams } from '../features/recipes/hooks/useRecipeQueryParams'
import { usePrefetchRecipes, useRecipes, useRecipeTags } from '../features/recipes/hooks/useRecipes'
import './RecipesPage.scss'

function RecipesPage() {
    const { params, setSearch, setTag, setSort, setPage, resetFilters } = useRecipeQueryParams()
    const recipesQuery = useRecipes(params)
    const tagsQuery = useRecipeTags()
    const { prefetchList, prefetchRecipe } = usePrefetchRecipes()

    useDocumentTitle('Рецепти')

    const { page, search, tag, sort } = params
    const total = recipesQuery.data?.total ?? 0
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

    useEffect(() => {
        if (recipesQuery.isSuccess && !recipesQuery.isPlaceholderData && page < totalPages) {
            prefetchList({ page: page + 1, search, tag, sort })
        }
    }, [recipesQuery.isSuccess, recipesQuery.isPlaceholderData, page, search, tag, sort, totalPages, prefetchList])

    function renderResults() {
        if (recipesQuery.isPending) {
            return <StatusMessage variant="loading" title="Завантаження рецептів..." />
        }

        if (recipesQuery.isError) {
            return (
                <StatusMessage
                    variant="error"
                    title="Не вдалося завантажити рецепти"
                    text={getErrorMessage(recipesQuery.error)}
                    action={
                        <button type="button" className="recipes-page__retry" onClick={() => recipesQuery.refetch()}>
                            Спробувати ще
                        </button>
                    }
                />
            )
        }

        if (recipesQuery.data.recipes.length === 0) {
            return (
                <StatusMessage
                    variant="empty"
                    title="Рецептів не знайдено"
                    text="Спробуйте інший запит або скиньте фільтри."
                    action={
                        <button type="button" className="recipes-page__reset" onClick={resetFilters}>
                            Скинути фільтри
                        </button>
                    }
                />
            )
        }

        return (
            <>
                <RecipeGrid isDimmed={recipesQuery.isPlaceholderData}>
                    {recipesQuery.data.recipes.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} onPrefetch={prefetchRecipe} />
                    ))}
                </RecipeGrid>

                {totalPages > 1 && (
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        isDisabled={recipesQuery.isPlaceholderData}
                        onPageChange={setPage}
                    />
                )}
            </>
        )
    }

    return (
        <section className="recipes-page">
            <div className="recipes-page__header">
                <div>
                    <h1 className="recipes-page__title">Рецепти</h1>
                    <p className="recipes-page__subtitle">
                        {recipesQuery.isSuccess ? `Знайдено рецептів: ${total}` : 'Каталог рецептів DummyJSON'}
                        {search && ` · пошук «${search}»`}
                        {tag && ` · тег «${tag}»`}
                    </p>
                </div>
            </div>

            <RecipeFilters
                key={search}
                params={params}
                tags={tagsQuery.data ?? []}
                isTagsLoading={tagsQuery.isPending}
                onSearch={setSearch}
                onTagChange={setTag}
                onSortChange={setSort}
            />

            {renderResults()}
        </section>
    )
}

export default RecipesPage