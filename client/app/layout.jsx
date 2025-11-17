import './globals.scss';
import ReactQueryClientProvider from './ReactQueryClientProvider';
import { ThemeProvider } from '@/contexts/ThemeContext';

export const metadata = {
  title: 'Invera Challenge',
  description: 'Frontend Challenge para Invera 🚀',
};

const RootLayout = ({ children }) => {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="bg-primary text-primary transition-colors duration-300">
        <ThemeProvider>
          <ReactQueryClientProvider>
            {children}
          </ReactQueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
