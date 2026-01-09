import { Icon } from '@iconify/react';
import type { ActionId, ActionImpl } from 'kbar';
import * as React from 'react';

const ResultItem = React.forwardRef(
  (
    {
      action,
      active,
      currentRootActionId
    }: {
      action: ActionImpl;
      active: boolean;
      currentRootActionId: ActionId;
    },
    ref: React.Ref<HTMLDivElement>
  ) => {
    const ancestors = React.useMemo(() => {
      if (!currentRootActionId) return action.ancestors;
      const index = action.ancestors.findIndex(
        (ancestor) => ancestor.id === currentRootActionId
      );
      return action.ancestors.slice(index + 1);
    }, [action.ancestors, currentRootActionId]);

    return (
      <div
        ref={ref}
        className={`relative flex cursor-pointer items-center justify-between px-6 py-4 transition-all ${
          active ? 'bg-primary/5' : 'bg-transparent'
        }`}
      >
        {active && (
          <div className='bg-primary animate-in slide-in-from-left absolute top-0 bottom-0 left-0 w-1 shadow-[0_0_12px_rgba(var(--primary),0.5)] duration-200'></div>
        )}

        <div className='flex items-center gap-4'>
          {action.icon && (
            <div
              className={`rounded-xl p-2 transition-all duration-300 ${active ? 'bg-primary text-primary-foreground shadow-primary/20 scale-110 shadow-lg' : 'bg-muted/30 text-muted-foreground'}`}
            >
              {action.icon}
            </div>
          )}
          <div className='flex flex-col'>
            <div className='flex items-center gap-1.5'>
              {ancestors.length > 0 &&
                ancestors.map((ancestor) => (
                  <React.Fragment key={ancestor.id}>
                    <span className='text-muted-foreground/30 text-xs font-bold tracking-widest uppercase'>
                      {ancestor.name}
                    </span>
                    <Icon
                      icon='solar:alt-arrow-right-linear'
                      className='text-muted-foreground/20 size-3'
                    />
                  </React.Fragment>
                ))}
              <span
                className={`text-sm font-bold tracking-tight transition-colors ${active ? 'text-foreground' : 'text-muted-foreground'}`}
              >
                {action.name}
              </span>
            </div>
            {action.subtitle && (
              <span className='text-muted-foreground/40 mt-0.5 text-[10px] leading-none font-black tracking-widest uppercase'>
                {action.subtitle}
              </span>
            )}
          </div>
        </div>
        {action.shortcut?.length ? (
          <div className='flex items-center gap-1.5 opacity-40 transition-opacity group-hover:opacity-100'>
            {action.shortcut.map((sc, i) => (
              <kbd
                key={sc + i}
                className='bg-muted/50 border-muted-foreground/10 text-muted-foreground flex min-w-[24px] items-center justify-center rounded-md border px-2 py-1 text-[9px] font-black uppercase'
              >
                {sc === 'mod' ? '⌘' : sc}
              </kbd>
            ))}
          </div>
        ) : null}
      </div>
    );
  }
);

ResultItem.displayName = 'KBarResultItem';

export default ResultItem;
