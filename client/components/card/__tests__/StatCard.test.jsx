import { render, screen } from '@testing-library/react';
import StatCard from '../StatCard';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} alt={props.alt || ''} />;
  },
}));

describe('StatCard', () => {
  const defaultProps = {
    title: 'Total Users',
    value: '1000',
    iconSrc: '/assets/icons/userGroupIcon.svg',
  };

  it('renders title and value correctly', () => {
    render(<StatCard {...defaultProps} />);

    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('1000')).toBeInTheDocument();
  });

  it('renders icon with correct alt text', () => {
    render(<StatCard {...defaultProps} />);

    const image = screen.getByAltText('Total Users');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/assets/icons/userGroupIcon.svg');
  });

  it('renders three dots button', () => {
    render(<StatCard {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('applies correct styling classes', () => {
    const { container } = render(<StatCard {...defaultProps} />);
    const card = container.firstChild;

    expect(card).toHaveClass('card');
    expect(card).toHaveClass('relative');
    expect(card).toHaveClass('p-5');
    expect(card).toHaveClass('rounded-md');
    expect(card).toHaveClass('w-full');
    expect(card).toHaveClass('h-[80px]');
  });

  it('renders with different props', () => {
    const props = {
      title: 'New Users',
      value: '250',
      iconSrc: '/assets/icons/usersIcon.svg',
    };

    render(<StatCard {...props} />);

    expect(screen.getByText('New Users')).toBeInTheDocument();
    expect(screen.getByText('250')).toBeInTheDocument();
  });
});

