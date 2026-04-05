import { useQuery } from '@tanstack/react-query';
import { fetchAdDetails } from '../api/fetch-ad-details.ts';

export function useAdDetails(id: string | undefined) {
    return useQuery({
        queryKey: ['ad-details', id],
        queryFn: ({ signal }) => {
            if (!id) throw new Error('ID не указан');
            return fetchAdDetails(id, signal);
        },
        enabled: Boolean(id),
        staleTime: 5 * 60 * 1000,
    });
}