# Recipe Planner

Підсумковий проєкт курсу React (лабораторна №12, тема №4 — **Recipe Planner**).
Каталог рецептів із пошуком, фільтром за тегом, сортуванням і сторінками, деталі рецепта,
обране, тижневий план харчування та власні рецепти (з фото та редагуванням).

**Deployed version:** https://YOUR-PROJECT.vercel.app

## Стек

- React 19, TypeScript, Vite
- React Router 8 (Declarative Mode, lazy routes)
- TanStack Query — server state
- Zustand (+ `persist`) — client/UI state
- React Hook Form + Zod — форми та валідація
- SCSS + BEM
- API: [DummyJSON](https://dummyjson.com/docs/recipes) — `recipes`, `recipes/tags`, `users`

## Запуск

```bash
npm install
cp .env.example .env
npm run dev
```

Інші команди: `npm run lint`, `npm run build`, `npm run preview`.

| Змінна         | Опис                   | Значення за замовчуванням |
| -------------- | ---------------------- | ------------------------- |
| `VITE_API_URL` | Базова адреса REST API | `https://dummyjson.com`   |

## Маршрути

| Адреса                         | Сторінка                     |
| ------------------------------ | ---------------------------- |
| `/recipes?q=&tag=&sort=&page=` | каталог (query params)       |
| `/recipes/:recipeId`           | деталі рецепта (route param) |
| `/recipes/new`                 | форма нового рецепта         |
| `/recipes/:recipeId/edit`      | редагування власного рецепта |
| `/favorites`                   | обране                       |
| `/meal-plan`                   | план харчування              |
| `/my-recipes`                  | власні рецепти               |
| `*`                            | 404                          |

## Архітектура (feature-first)

```
src/
├── app/          App (маршрути), AppProviders, queryClient, layout (Header, AppLayout)
├── pages/        сторінки — збирають фічі в екрани
├── features/
│   ├── recipes/    api (repository, DTO, mappers, query keys), hooks (queries, mutation),
│   │               model (types, Zod-схема, myRecipesStore), components (RecipeCard, RecipeForm…)
│   ├── authors/    repository + useAuthor (автор рецепта)
│   ├── favorites/  favoritesStore + FavoriteButton
│   ├── meal-plan/  mealPlanStore, Zod-схема, MealPlanForm, AddToPlanButton
│   └── theme/      themeStore + ThemeToggle
└── shared/       api (httpClient, errors), ui (StatusMessage, Pagination, Modal, FormField, Toaster),
                  model (toastStore), lib, styles
```

Напрямок залежностей: `app → pages → features → shared`. Фічі не імпортують одна одну —
їх поєднують сторінки. Компоненти не знають про HTTP: дані йдуть
`API → httpClient → repository (DTO → модель) → TanStack Query hook → сторінка → UI`.

## Server state і client state

| Server state — TanStack Query                 | Client state — Zustand (`persist` у localStorage) |
| --------------------------------------------- | ------------------------------------------------- |
| список рецептів (`['recipes','list',params]`) | обране — тільки id рецептів                       |
| рецепт (`['recipes','detail',id]`)            | план харчування (CRUD записів)                    |
| теги (`['recipes','tags']`)                   | власні рецепти (створення, редагування, фото)     |
| автор (`['authors',id]`)                      | тема (світла / темна)                             |
| створення рецепта — `useMutation`             | тости (без persist)                               |

Фільтри, сортування та сторінка зберігаються **лише в URL** — без дублювання в store.

## Обов’язковий функціонал

- 2+ пов’язані ресурси: рецепти, теги, автори (`recipe.userId → /users/:id`)
- пошук, фільтр за тегом, сортування, пагінація — у query params
- dynamic route `/recipes/:recipeId`
- mutation: `POST /recipes/add` (pending, помилка, «Спробувати ще»)
- 2 форми з Zod: план харчування (create/edit) і рецепт (create/edit)
- CRUD плану харчування і власних рецептів (client-owned)
- необовʼязкове фото рецепта: стискається в браузері до 800px і зберігається як data URL
- loading / error / empty / success стани, повтор невдалих запитів
- повторно використовувані компоненти: `RecipeCard`, `RecipeForm`, `StatusMessage`, `Pagination`, `Modal`, `FormField`

## Розширення

1. **Lazy routes** — усі сторінки через `React.lazy` + `Suspense`.
2. **Prefetch** — деталі рецепта при наведенні на картку, наступна сторінка каталогу.
3. **Dependent queries** — автор завантажується після рецепта (`enabled: authorId !== null`).
4. **Темна тема з persistence** — `themeStore` + `persist`.

## Обмеження DummyJSON

DummyJSON не зберігає змін: `POST /recipes/add` повертає рецепт, але в каталозі він не з’явиться.
Тому створений рецепт зберігається в `myRecipesStore` як client-owned дані.
Редагування і видалення власних рецептів теж відбуваються локально: на сервері їх немає.
Авторизація не потрібна — усі користувацькі дані зберігаються лише в браузері користувача.

## Deployment

Vercel: імпортувати GitHub-репозиторій → Framework **Vite** → Deploy.
`vercel.json` перенаправляє всі адреси на `index.html`, щоб працювали маршрути SPA.