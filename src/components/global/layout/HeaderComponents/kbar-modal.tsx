"use client";

import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarSearch,
  KBarResults,
  useMatches,
} from "kbar";

export function KBarModal() {
  return (
    <KBarPortal>
      <KBarPositioner className='bg-brand-neutrals/50 backdrop-blur-sm z-50'>
        <KBarAnimator className='w-full max-w-lg overflow-hidden rounded-lg border-brand-neutrals/20 border-2 bg-white shadow-lg'>
          <KBarSearch
            id='kbar-search'
            className='w-full bg-transparent p-4 outline-none text-brand-neutrals border-b-2 border-brand-neutrals/20 placeholder:text-brand-neutrals/70'
            defaultPlaceholder='Type to search...'
          />
          <RenderResults />
        </KBarAnimator>
      </KBarPositioner>
    </KBarPortal>
  );
}

function RenderResults() {
  const { results } = useMatches();

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === "string" ? (
          <div className='px-4 pt-4 pb-2 text-xs uppercase text-brand-neutrals/55 font-bold'>
            {item}
          </div>
        ) : (
          <div
            className={`flex cursor-pointer items-center px-4 py-2 ${
              active ? "bg-accent" : "bg-transparent"
            }`}
          >
            <div className='flex flex-col'>
              <span className='text-sm text-brand-neutrals font-medium'>
                {item.name}
              </span>
              {item.subtitle && (
                <span className='text-xs text-muted-foreground'>
                  {item.subtitle}
                </span>
              )}
            </div>
          </div>
        )
      }
    />
  );
}
