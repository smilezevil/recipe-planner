import { useQuery } from '@tanstack/react-query'
import { authorRepository } from '../api/authorRepository'

export function useAuthor(authorId: number | null) {
    return useQuery({
        queryKey: ['authors', authorId],
        queryFn: ({ signal }) => authorRepository.getById(authorId as number, signal),
        enabled: authorId !== null,
        staleTime: 5 * 60_000,
    })
}