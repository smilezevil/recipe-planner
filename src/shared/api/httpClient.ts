import { API_URL } from '../config'
import { ApiError } from './errors'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface RequestOptions {
    method?: HttpMethod
    body?: unknown
    signal?: AbortSignal
}

export type QueryParams = Record<string, string | number | undefined>

export function toQueryString(params: QueryParams): string {
    const search = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
            search.set(key, String(value))
        }
    })

    const query = search.toString()
    return query ? `?${query}` : ''
}

async function readErrorMessage(response: Response): Promise<string> {
    try {
        const data = (await response.json()) as { message?: unknown }
        if (typeof data.message === 'string') {
            return data.message
        }
    } catch {
        return `Помилка запиту: ${response.status}`
    }

    return `Помилка запиту: ${response.status}`
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, signal } = options
    const hasBody = body !== undefined

    const response = await fetch(`${API_URL}${path}`, {
        method,
        signal,
        headers: hasBody ? { 'Content-Type': 'application/json' } : undefined,
        body: hasBody ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
        throw new ApiError(await readErrorMessage(response), response.status)
    }

    return (await response.json()) as T
}