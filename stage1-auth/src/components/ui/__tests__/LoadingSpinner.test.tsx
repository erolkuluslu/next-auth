import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '../LoadingSpinner';

describe('LoadingSpinner Component', () => {
  it('should render with default props', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByLabelText('Loading...');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('animate-spin', 'rounded-full', 'border-b-2');
  });

  it('should render different sizes correctly', () => {
    const { rerender } = render(<LoadingSpinner size="sm" />);
    expect(screen.getByLabelText('Loading...')).toHaveClass('h-4 w-4');

    rerender(<LoadingSpinner size="md" />);
    expect(screen.getByLabelText('Loading...')).toHaveClass('h-8 w-8');

    rerender(<LoadingSpinner size="lg" />);
    expect(screen.getByLabelText('Loading...')).toHaveClass('h-12 w-12');
  });

  it('should render different colors correctly', () => {
    const { rerender } = render(<LoadingSpinner color="blue" />);
    expect(screen.getByLabelText('Loading...')).toHaveClass('border-blue-600');

    rerender(<LoadingSpinner color="white" />);
    expect(screen.getByLabelText('Loading...')).toHaveClass('border-white');

    rerender(<LoadingSpinner color="gray" />);
    expect(screen.getByLabelText('Loading...')).toHaveClass('border-gray-600');
  });

  it('should apply custom className', () => {
    render(<LoadingSpinner className="custom-spinner" />);
    expect(screen.getByLabelText('Loading...')).toHaveClass('custom-spinner');
  });

  it('should have proper accessibility attributes', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByLabelText('Loading...');
    
    expect(spinner).toHaveAttribute('aria-label', 'Loading...');
  });

  it('should combine size and color classes correctly', () => {
    render(<LoadingSpinner size="lg" color="white" />);
    const spinner = screen.getByLabelText('Loading...');
    
    expect(spinner).toHaveClass('h-12 w-12', 'border-white');
  });

  it('should render with all props combined', () => {
    render(
      <LoadingSpinner 
        size="sm" 
        color="blue" 
        className="extra-class" 
      />
    );
    
    const spinner = screen.getByLabelText('Loading...');
    expect(spinner).toHaveClass(
      'h-4 w-4',
      'border-blue-600',
      'extra-class',
      'animate-spin',
      'rounded-full',
      'border-b-2'
    );
  });
});