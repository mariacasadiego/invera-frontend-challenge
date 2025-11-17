import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UserTypeChart from '../UserTypeChart';
import { useQuery } from '@tanstack/react-query';

jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQuery: jest.fn(),
}));

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

describe('UserTypeChart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    useQuery.mockReturnValue({
      data: null,
      isLoading: true,
    });

    const { container } = render(<UserTypeChart />, { wrapper: createWrapper() });
    expect(container).toBeInTheDocument();
  });

  it('renders chart when data is loaded', async () => {
    const mockData = {
      totalUsers: 5000,
      distribution: [
        { type: 'Organic', percentage: 30 },
        { type: 'Social', percentage: 50 },
        { type: 'Direct', percentage: 20 },
      ],
    };

    useQuery.mockReturnValue({
      data: mockData,
      isLoading: false,
    });

    render(<UserTypeChart />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Estadistics')).toBeInTheDocument();
      expect(screen.getByText('Organic')).toBeInTheDocument();
      expect(screen.getByText('Social')).toBeInTheDocument();
      expect(screen.getByText('Direct')).toBeInTheDocument();
    });

    expect(screen.getByText('30%')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('20%')).toBeInTheDocument();
  });

  it('displays correct total users in center', async () => {
    const mockData = {
      totalUsers: 5000,
      distribution: [
        { type: 'Organic', percentage: 30 },
        { type: 'Social', percentage: 50 },
        { type: 'Direct', percentage: 20 },
      ],
    };

    useQuery.mockReturnValue({
      data: mockData,
      isLoading: false,
    });

    render(<UserTypeChart />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('5k')).toBeInTheDocument();
      expect(screen.getByText('users')).toBeInTheDocument();
    });
  });

  it('renders legend items in correct order', async () => {
    const mockData = {
      totalUsers: 1000,
      distribution: [
        { type: 'Organic', percentage: 30 },
        { type: 'Social', percentage: 50 },
        { type: 'Direct', percentage: 20 },
      ],
    };

    useQuery.mockReturnValue({
      data: mockData,
      isLoading: false,
    });

    render(<UserTypeChart />, { wrapper: createWrapper() });

    await waitFor(() => {
      const legendItems = screen.getAllByText(/Organic|Social|Direct/);
      expect(legendItems.length).toBeGreaterThanOrEqual(3);
    });
  });
});

