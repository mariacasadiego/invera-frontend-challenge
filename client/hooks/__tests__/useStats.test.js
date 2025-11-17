import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useStats } from '../useStats';
import { fetchStats } from '@/services/statsService';

jest.mock('@/services/statsService');
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

describe('useStats', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches stats successfully', async () => {
    const mockStats = {
      totalUsers: 1000,
      newUsers: 200,
      topUsers: 50,
      otherUsers: 750,
    };

    fetchStats.mockResolvedValue(mockStats);

    const { result } = renderHook(() => useStats(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockStats);
    expect(fetchStats).toHaveBeenCalledTimes(1);
  });

  it('handles fetch error', async () => {
    const errorMessage = 'Failed to fetch stats';
    fetchStats.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useStats(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeTruthy();
  });

  it('returns loading state initially', () => {
    fetchStats.mockImplementation(() => new Promise(() => { }));

    const { result } = renderHook(() => useStats(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });
});

