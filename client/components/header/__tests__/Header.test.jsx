import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Header from '../Header';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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

describe('Header', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders title correctly', () => {
    render(<Header />, { wrapper: createWrapper() });
    expect(screen.getByText('Users')).toBeInTheDocument();
  });

  it('renders Add User button', () => {
    render(<Header />, { wrapper: createWrapper() });
    expect(screen.getByText('Add User')).toBeInTheDocument();
  });

  it('opens modal when Add User button is clicked', async () => {
    render(<Header />, { wrapper: createWrapper() });

    const addButton = screen.getByText('Add User');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(/add new user/i)).toBeInTheDocument();
    });
  });

  it('has correct button styling', () => {
    render(<Header />, { wrapper: createWrapper() });
  
    const addButton = screen.getByText('Add User');
    expect(addButton).toHaveClass('add-user-button');
  });
});

