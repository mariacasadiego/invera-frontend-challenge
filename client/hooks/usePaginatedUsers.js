import { useQuery } from '@tanstack/react-query';
import { fetchUsersPaginated } from '@/services/userService';
import { ITEMS_PER_PAGE } from '@/utils/constants';

export const usePaginatedUsers = ({ page, limit = ITEMS_PER_PAGE, query, sort, order }) => {
  return useQuery({
    queryKey: ['paginatedUsers', page, limit, query, sort, order],
    queryFn: () => fetchUsersPaginated({ page, limit, query, sort, order }),
    keepPreviousData: true,
    staleTime: 30000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
