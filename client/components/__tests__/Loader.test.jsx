import { render } from '@testing-library/react';
import Loader from '../Loader';

describe('Loader', () => {
  it('renders loader component', () => {
    const { container } = render(<Loader />);
    const loader = container.firstChild;
    
    expect(loader).toBeInTheDocument();
    expect(loader).toHaveClass('fixed');
    expect(loader).toHaveClass('inset-0');
  });

  it('has correct z-index', () => {
    const { container } = render(<Loader />);
    const loader = container.firstChild;
    
    expect(loader).toHaveClass('z-50');
  });

  it('renders spinning animation', () => {
    const { container } = render(<Loader />);
    const spinner = container.querySelector('.animate-spin');
    
    expect(spinner).toBeInTheDocument();
  });
});

