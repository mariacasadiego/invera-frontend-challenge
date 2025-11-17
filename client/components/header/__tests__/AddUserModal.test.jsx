import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddUserModal from '../AddUserModal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCreateUser } from '@/hooks/useCreateUser';
import { useUpdateUser } from '@/hooks/useUpdateUser';

jest.mock('@/hooks/useCreateUser');
jest.mock('@/hooks/useUpdateUser');

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

describe('AddUserModal', () => {
  const mockCreateUser = jest.fn();
  const mockUpdateUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useCreateUser.mockReturnValue({
      mutate: mockCreateUser,
      isPending: false,
    });
    useUpdateUser.mockReturnValue({
      mutate: mockUpdateUser,
      isPending: false,
    });
  });

  it('does not render when isOpen is false', () => {
    render(<AddUserModal isOpen={false} onClose={jest.fn()} />, { wrapper: createWrapper() });
    expect(screen.queryByText(/add new user/i)).not.toBeInTheDocument();
  });

  it('renders in create mode when no user prop', () => {
    render(<AddUserModal isOpen={true} onClose={jest.fn()} />, { wrapper: createWrapper() });

    expect(screen.getByText('Add New User')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Phone')).toBeInTheDocument();
  });

  it('renders in edit mode when user prop is provided', () => {
    const user = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      location: 'New York',
      company: 'Acme',
      status: 'Online',
    };

    render(<AddUserModal isOpen={true} onClose={jest.fn()} user={user} />, { wrapper: createWrapper() });

    expect(screen.getByText('Edit User')).toBeInTheDocument();
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123-456-7890')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<AddUserModal isOpen={true} onClose={onClose} />, { wrapper: createWrapper() });

    const closeButton = screen.getByText('✕');
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('updates form fields when typing', () => {
    render(<AddUserModal isOpen={true} onClose={jest.fn()} />, { wrapper: createWrapper() });

    const nameInput = screen.getByPlaceholderText('Name');
    fireEvent.change(nameInput, { target: { value: 'New User' } });

    expect(nameInput).toHaveValue('New User');
  });

  it('submits form in create mode', async () => {
    const onClose = jest.fn();
    render(<AddUserModal isOpen={true} onClose={onClose} />, { wrapper: createWrapper() });

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'New User' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'new@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Phone'), { target: { value: '123-456-7890' } });

    const submitButton = screen.getByText('Add User');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalledWith({
        name: 'New User',
        email: 'new@example.com',
        phone: '123-456-7890',
        location: '',
        company: '',
        status: 'Offline',
      });
    });
  });

  it('submits form in edit mode', async () => {
    const user = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      location: 'New York',
      company: 'Acme',
      status: 'Online',
    };

    const onClose = jest.fn();
    render(<AddUserModal isOpen={true} onClose={onClose} user={user} />, { wrapper: createWrapper() });

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Updated Name' } });

    const submitButton = screen.getByText('Update User');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith({
        id: 1,
        updates: expect.objectContaining({
          name: 'Updated Name',
        }),
      });
    });
  });

  it('prevents body scroll when modal is open', () => {
    render(<AddUserModal isOpen={true} onClose={jest.fn()} />, { wrapper: createWrapper() });

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores body scroll when modal closes', () => {
    const { rerender } = render(
      <AddUserModal isOpen={true} onClose={jest.fn()} />,
      { wrapper: createWrapper() }
    );

    expect(document.body.style.overflow).toBe('hidden');

    rerender(<AddUserModal isOpen={false} onClose={jest.fn()} />);

    expect(document.body.style.overflow).toBe('unset');
  });

  it('shows loading state when creating', () => {
    useCreateUser.mockReturnValue({
      mutate: mockCreateUser,
      isPending: true,
    });

    render(<AddUserModal isOpen={true} onClose={jest.fn()} />, { wrapper: createWrapper() });

    expect(screen.getByText('Adding...')).toBeInTheDocument();
  });

  it('shows loading state when updating', () => {
    const user = { id: 1, name: 'John', email: 'john@example.com' };
    useUpdateUser.mockReturnValue({
      mutate: mockUpdateUser,
      isPending: true,
    });

    render(<AddUserModal isOpen={true} onClose={jest.fn()} user={user} />, { wrapper: createWrapper() });

    expect(screen.getByText('Updating...')).toBeInTheDocument();
  });
});

