import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UserTable from '../UserTable';
import { usePaginatedUsers } from '@/hooks/usePaginatedUsers';
import { useDeleteUser } from '@/hooks/useDeleteUser';

jest.mock('@/hooks/usePaginatedUsers');
jest.mock('@/hooks/useDeleteUser');

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

const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    location: 'New York',
    company: 'Acme Inc',
    status: 'Online',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '098-765-4321',
    location: 'Los Angeles',
    company: 'Tech Corp',
    status: 'Offline',
  },
];

describe('UserTable', () => {
  const mockDeleteUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useDeleteUser.mockReturnValue({
      mutate: mockDeleteUser,
      isPending: false,
    });
  });

  it('renders loading state', () => {
    usePaginatedUsers.mockReturnValue({
      data: null,
      isLoading: true,
      isFetching: false,
    });

    render(<UserTable />, { wrapper: createWrapper() });

    expect(screen.queryByText('All Users')).not.toBeInTheDocument();
  });

  it('renders users table when data is loaded', async () => {
    usePaginatedUsers.mockReturnValue({
      data: {
        users: mockUsers,
        total: 2,
      },
      isLoading: false,
      isFetching: false,
    });

    render(<UserTable />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('All Users')).toBeInTheDocument();
    });

    const johnDoeElements = screen.getAllByText('John Doe');
    expect(johnDoeElements.length).toBeGreaterThan(0);

    const janeSmithElements = screen.getAllByText('Jane Smith');
    expect(janeSmithElements.length).toBeGreaterThan(0);
  });

  it('displays correct pagination info', async () => {
    usePaginatedUsers.mockReturnValue({
      data: {
        users: mockUsers,
        total: 2,
      },
      isLoading: false,
      isFetching: false,
    });

    render(<UserTable />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText(/1 - 2/)).toBeInTheDocument();
      expect(screen.getByText(/of 2/)).toBeInTheDocument();
    });
  });

  it('handles search input', async () => {
    usePaginatedUsers.mockReturnValue({
      data: {
        users: mockUsers,
        total: 2,
      },
      isLoading: false,
      isFetching: false,
    });

    render(<UserTable />, { wrapper: createWrapper() });

    const searchInput = screen.getByPlaceholderText('Search for...');
    fireEvent.change(searchInput, { target: { value: 'John' } });

    await waitFor(() => {
      expect(searchInput).toHaveValue('John');
    });
  });

  it('handles checkbox selection', async () => {
    usePaginatedUsers.mockReturnValue({
      data: {
        users: mockUsers,
        total: 2,
      },
      isLoading: false,
      isFetching: false,
    });

    render(<UserTable />, { wrapper: createWrapper() });

    await waitFor(() => {
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThan(0);

      fireEvent.click(checkboxes[1]);
    });
  });

  it('handles select all checkbox', async () => {
    usePaginatedUsers.mockReturnValue({
      data: {
        users: mockUsers,
        total: 2,
      },
      isLoading: false,
      isFetching: false,
    });

    render(<UserTable />, { wrapper: createWrapper() });

    await waitFor(() => {
      const checkboxes = screen.getAllByRole('checkbox');
      const selectAllCheckbox = checkboxes[0];
      fireEvent.click(selectAllCheckbox);
    });
  });

  it('opens edit modal when edit button is clicked', async () => {
    usePaginatedUsers.mockReturnValue({
      data: {
        users: mockUsers,
        total: 2,
      },
      isLoading: false,
      isFetching: false,
    });

    render(<UserTable />, { wrapper: createWrapper() });

    await waitFor(() => {
      const editButtons = screen.getAllByLabelText('Editar usuario');
      fireEvent.click(editButtons[0]);
    });

    await waitFor(() => {
      expect(screen.getByText('Edit User')).toBeInTheDocument();
    });
  });

  it('calls delete function when delete button is clicked', async () => {
    usePaginatedUsers.mockReturnValue({
      data: {
        users: mockUsers,
        total: 2,
      },
      isLoading: false,
      isFetching: false,
    });

    render(<UserTable />, { wrapper: createWrapper() });

    await waitFor(() => {
      const deleteButtons = screen.getAllByLabelText('Eliminar usuario');
      fireEvent.click(deleteButtons[0]);
    });

    await waitFor(() => {
      expect(screen.getByText('Confirmar eliminación')).toBeInTheDocument();
    });

    const confirmDeleteButton = screen.getByText('Eliminar');
    fireEvent.click(confirmDeleteButton);

    await waitFor(() => {
      expect(mockDeleteUser).toHaveBeenCalledWith(1);
    });
  });

  it('handles pagination next button', async () => {
    const moreUsers = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      phone: `123-456-${i + 1}`,
      location: 'City',
      company: 'Company',
      status: 'Online',
    }));

    usePaginatedUsers.mockReturnValue({
      data: {
        users: moreUsers.slice(0, 10),
        total: 20,
      },
      isLoading: false,
      isFetching: false,
    });

    render(<UserTable />, { wrapper: createWrapper() });

    await waitFor(() => {
      const nextButton = screen.getByText('Next');
      expect(nextButton).toBeInTheDocument();
      fireEvent.click(nextButton);
    });
  });

  it('disables prev button on first page', async () => {
    usePaginatedUsers.mockReturnValue({
      data: {
        users: mockUsers,
        total: 2,
      },
      isLoading: false,
      isFetching: false,
    });

    render(<UserTable />, { wrapper: createWrapper() });

    await waitFor(() => {
      const prevButton = screen.getByText('Prev');
      expect(prevButton).toBeDisabled();
    });
  });
});

