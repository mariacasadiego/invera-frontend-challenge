import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePaginatedUsers } from '../usePaginatedUsers';
import { fetchUsersPaginated } from '@/services/userService';

jest.mock('@/services/userService');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  const Wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'TestWrapper';
  return Wrapper;
};

describe('usePaginatedUsers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches paginated users successfully', async () => {
    const mockData = {
      users: [
        { id: 1, name: 'User 1' },
        { id: 2, name: 'User 2' },
      ],
      total: 10,
    };

    fetchUsersPaginated.mockResolvedValue(mockData);

    const { result } = renderHook(
      () => usePaginatedUsers({ page: 1, limit: 10, query: '', sort: '', order: '' }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
    expect(fetchUsersPaginated).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      query: '',
      sort: '',
      order: '',
    });
  });

  it('handles search query', async () => {
    const mockData = {
      users: [{ id: 1, name: 'John' }],
      total: 1,
    };

    fetchUsersPaginated.mockResolvedValue(mockData);

    const { result } = renderHook(
      () => usePaginatedUsers({ page: 1, limit: 10, query: 'John', sort: '', order: '' }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(fetchUsersPaginated).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      query: 'John',
      sort: '',
      order: '',
    });
  });

  it('handles sorting parameters', async () => {
    const mockData = {
      users: [],
      total: 0,
    };

    fetchUsersPaginated.mockResolvedValue(mockData);

    const { result } = renderHook(
      () => usePaginatedUsers({ page: 1, limit: 10, query: '', sort: 'name', order: 'asc' }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(fetchUsersPaginated).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      query: '',
      sort: 'name',
      order: 'asc',
    });
  });

  it('handles fetch error', async () => {
    fetchUsersPaginated.mockRejectedValue(new Error('Failed to fetch'));

    const { result } = renderHook(
      () => usePaginatedUsers({ page: 1, limit: 10, query: '', sort: '', order: '' }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});

