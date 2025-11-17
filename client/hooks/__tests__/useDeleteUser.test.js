import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDeleteUser } from '../useDeleteUser';
import { deleteUser } from '@/services/userService';

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

describe('useDeleteUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deletes user successfully', async () => {
    deleteUser.mockResolvedValue(1);

    const { result } = renderHook(() => useDeleteUser(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(1);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(deleteUser).toHaveBeenCalledWith(1, expect.any(Object));
  });

  it('invalidates queries on success', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    deleteUser.mockResolvedValue(1);

    const { result } = renderHook(() => useDeleteUser(), {
      wrapper,
    });

    result.current.mutate(1);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    await waitFor(() => {
      expect(invalidateQueriesSpy).toHaveBeenCalled();
    });
  });

  it('handles delete error', async () => {
    const error = new Error('Failed to delete user');
    deleteUser.mockRejectedValue(error);

    const { result } = renderHook(() => useDeleteUser(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(1);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
  });
});

