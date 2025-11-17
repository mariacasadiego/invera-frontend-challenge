import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UserStats from '../UserStats';
import { useStats } from '@/hooks/useStats';

jest.mock('@/hooks/useStats');

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

describe('UserStats', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    useStats.mockReturnValue({ data: null, isLoading: true, error: null });

    render(<UserStats />, { wrapper: createWrapper() });

    expect(screen.queryByText('Total Users')).not.toBeInTheDocument();
  });

  it('renders stats cards when data is loaded', async () => {
    const mockData = {
      totalUsers: 1000,
      newUsers: 200,
      topUsers: 50,
      otherUsers: 750,
    };

    useStats.mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null
    });

    render(<UserStats />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Total Users')).toBeInTheDocument();
      expect(screen.getByText('New Users')).toBeInTheDocument();
      expect(screen.getByText('Top Users')).toBeInTheDocument();
      expect(screen.getByText('Other Users')).toBeInTheDocument();
    });

    expect(screen.getByText('1000')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('750')).toBeInTheDocument();
  });

  it('renders error state', () => {
    useStats.mockReturnValue({
      data: null,
      isLoading: false,
      error: { message: 'Error loading stats' }
    });

    render(<UserStats />, { wrapper: createWrapper() });

    expect(screen.getByText(/error al cargar/i)).toBeInTheDocument();
  });

  it('renders correct icons for each stat', async () => {
    const mockData = {
      totalUsers: 1000,
      newUsers: 200,
      topUsers: 50,
      otherUsers: 750,
    };

    useStats.mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null
    });

    render(<UserStats />, { wrapper: createWrapper() });

    await waitFor(() => {
      const images = screen.getAllByRole('img');
      expect(images.length).toBe(4);
    });
  });
});

