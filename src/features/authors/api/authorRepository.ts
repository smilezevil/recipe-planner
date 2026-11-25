import { request } from '../../../shared/api/httpClient'
import type { Author } from '../model/types'

interface ApiUser {
    id: number
    firstName: string
    lastName: string
    username: string
    image?: string
}

function toAuthor(dto: ApiUser): Author {
    return {
        id: dto.id,
        fullName: `${dto.firstName} ${dto.lastName}`,
        username: dto.username,
        image: dto.image ?? '',
    }
}

export const authorRepository = {
    async getById(id: number, signal?: AbortSignal): Promise<Author> {
        const data = await request<ApiUser>(`/users/${id}?select=firstName,lastName,username,image`, {
            signal,
        })
        return toAuthor(data)
    },
}