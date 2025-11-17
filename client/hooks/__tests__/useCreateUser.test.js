import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCreateUser } from '../useCreateUser';
import { createUser } from '@/services/userService';

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

describe('useCreateUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('creates user successfully', async () => {
    const newUser = {
      name: 'New User',
      email: 'new@example.com',
      phone: '123-456-7890',
    };

    const createdUser = { id: 1, ...newUser };
    createUser.mockResolvedValue(createdUser);

    const { result } = renderHook(() => useCreateUser(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(newUser);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(createUser).toHaveBeenCalledWith(newUser, expect.any(Object));
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

    createUser.mockResolvedValue({ id: 1 });

    const { result } = renderHook(() => useCreateUser(), {
      wrapper,
    });

    result.current.mutate({ name: 'Test' });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    jest.advanceTimersByTime(100);

    await waitFor(() => {
      expect(invalidateQueriesSpy).toHaveBeenCalled();
      expect(refetchQueriesSpy).toHaveBeenCalled();
    });
  });

  it('handles creation error', async () => {
    const error = new Error('Failed to create user');
    createUser.mockRejectedValue(error);

    const { result } = renderHook(() => useCreateUser(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ name: 'Test' });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
  });
});

