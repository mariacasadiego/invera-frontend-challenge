import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../ThemeContext';

const TestComponent = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('light', 'dark');
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });

  it('provides default dark theme', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });
  });

  it('toggles theme correctly', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Toggle')).toBeInTheDocument();
    });

    const toggleButton = screen.getByText('Toggle');
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByTestId('theme')).toHaveTextContent('light');
    });
  });

  it('saves theme to localStorage', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Toggle')).toBeInTheDocument();
    });

    const toggleButton = screen.getByText('Toggle');
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(localStorage.getItem('theme')).toBe('light');
    });
  });

  it('applies theme class to document element', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    const toggleButton = screen.getByText('Toggle');
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  it('loads saved theme from localStorage', async () => {
    localStorage.setItem('theme', 'light');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('theme')).toHaveTextContent('light');
    });
  });

  it('uses default theme when used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => { });

    render(<TestComponent />);

    expect(screen.getByTestId('theme')).toHaveTextContent('dark');

    consoleError.mockRestore();
  });
});

