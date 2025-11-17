import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUpdateUser } from '../useUpdateUser';
import { updateUser } from '@/services/userService';

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

describe('useUpdateUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('updates user successfully', async () => {
    const updates = { name: 'Updated Name' };
    const updatedUser = { id: 1, ...updates };
    updateUser.mockResolvedValue(updatedUser);

    const { result } = renderHook(() => useUpdateUser(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ id: 1, updates });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(updateUser).toHaveBeenCalledWith({ id: 1, updates }, expect.any(Object));
  });

  it('invalidates queries on success', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');
    const refetchQueriesSpy = jest.spyOn(queryClient, 'refetchQueries');

    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    updateUser.mockResolvedValue({ id: 1 });

    const { result } = renderHook(() => useUpdateUser(), {
      wrapper,
    });

    result.current.mutate({ id: 1, updates: { name: 'Test' } });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    jest.advanceTimersByTime(100);

    await waitFor(() => {
      expect(invalidateQueriesSpy).toHaveBeenCalled();
      expect(refetchQueriesSpy).toHaveBeenCalled();
    });
  });

  it('handles update error', async () => {
    const error = new Error('Failed to update user');
    updateUser.mockRejectedValue(error);

    const { result } = renderHook(() => useUpdateUser(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ id: 1, updates: { name: 'Test' } });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
  });
});

