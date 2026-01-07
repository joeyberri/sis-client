import { render, screen } from '@testing-library/react';
import { ModuleGuard } from '../module-guard';
import { ModuleProvider } from '@/context/modules/module-context';

const MockComponent = () => <div>Protected Content</div>;

describe('ModuleGuard', () => {
  it('should show content when module is enabled', () => {
    render(
      <ModuleProvider
        defaultTier='standard'
        customEnabledModules={['students']}
      >
        <ModuleGuard moduleName='students'>
          <MockComponent />
        </ModuleGuard>
      </ModuleProvider>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should show alert when module is not enabled', () => {
    render(
      <ModuleProvider defaultTier='basic' customEnabledModules={['students']}>
        <ModuleGuard moduleName='payments'>
          <MockComponent />
        </ModuleGuard>
      </ModuleProvider>
    );

    expect(screen.getByText('Module Not Available')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should render fallback when provided', () => {
    render(
      <ModuleProvider defaultTier='basic'>
        <ModuleGuard
          moduleName='payments'
          fallback={<div>Upgrade Required</div>}
        >
          <MockComponent />
        </ModuleGuard>
      </ModuleProvider>
    );

    expect(screen.getByText('Upgrade Required')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
