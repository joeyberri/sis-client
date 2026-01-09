import { render, screen } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { Alert, AlertTitle, AlertDescription } from '../alert';

describe('Alert', () => {
  it('renders with default variant', () => {
    render(<Alert>Default alert</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveClass('bg-card', 'text-card-foreground');
  });

  it('renders with destructive variant', () => {
    render(<Alert variant='destructive'>Error alert</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('text-destructive', 'bg-card');
  });

  it('applies custom className', () => {
    render(<Alert className='custom-alert'>Custom alert</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('custom-alert');
  });

  it('passes through other props', () => {
    render(<Alert data-testid='test-alert'>Test alert</Alert>);
    expect(screen.getByTestId('test-alert')).toBeInTheDocument();
  });
});

describe('AlertTitle', () => {
  it('renders title correctly', () => {
    render(<AlertTitle>Alert Title</AlertTitle>);
    const title = screen.getByText('Alert Title');
    expect(title).toHaveClass('col-start-2', 'font-medium');
  });

  it('applies custom className', () => {
    render(<AlertTitle className='custom-title'>Custom Title</AlertTitle>);
    const title = screen.getByText('Custom Title');
    expect(title).toHaveClass('custom-title');
  });
});

describe('AlertDescription', () => {
  it('renders description correctly', () => {
    render(<AlertDescription>Alert description text</AlertDescription>);
    const description = screen.getByText('Alert description text');
    expect(description).toHaveClass('text-muted-foreground', 'col-start-2');
  });

  it('applies custom className', () => {
    render(
      <AlertDescription className='custom-desc'>
        Custom description
      </AlertDescription>
    );
    const description = screen.getByText('Custom description');
    expect(description).toHaveClass('custom-desc');
  });
});

describe('Alert composition', () => {
  it('renders complete alert with title and description', () => {
    render(
      <Alert>
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          This is a warning message with additional details.
        </AlertDescription>
      </Alert>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Warning')).toBeInTheDocument();
    expect(
      screen.getByText('This is a warning message with additional details.')
    ).toBeInTheDocument();
  });

  it('renders destructive alert with icon placeholder', () => {
    render(
      <Alert variant='destructive'>
        <svg data-testid='icon' />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Something went wrong</AlertDescription>
      </Alert>
    );

    expect(screen.getByRole('alert')).toHaveClass('text-destructive');
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});
