import { KBarResults, useMatches } from 'kbar';
import ResultItem from './result-item';

export default function RenderResults() {
  const { results, rootActionId } = useMatches();

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === 'string' ? (
          <div className='text-primary/40 bg-primary/5 flex items-center gap-3 px-6 py-3 text-[10px] font-black tracking-[0.2em] uppercase'>
            <div className='bg-primary/20 h-[1px] w-4'></div>
            {item}
            <div className='bg-primary/20 h-[1px] flex-1'></div>
          </div>
        ) : (
          <ResultItem
            action={item}
            active={active}
            currentRootActionId={rootActionId ?? ''}
          />
        )
      }
    />
  );
}
