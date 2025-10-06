'use client';
import React, { useCallback, useTransition, useState } from 'react';
import { TextField } from '@mui/material';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebounced } from '@/core/common/hooks/debounce.hook';

export const SearchComponent = ({ searchTerm }: { searchTerm: string }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [input, setInput] = useState(searchTerm ?? '');

  const updateUrl = useCallback(
    (val: string) => {
      const params = new URLSearchParams(searchParams);
      if (val.trim()) {
        params.set('searchTerm', val);
      } else {
        params.delete('searchTerm');
      }
      const query = params.toString();
      startTransition(() => {
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
      });
    },
    [router, pathname, searchParams]
  );

  const debouncedUpdate = useDebounced(updateUrl, 300);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);
    debouncedUpdate(val);
  };

  return (
    <TextField
      id='search-term'
      label='search'
      variant='outlined'
      size='small'
      value={input}
      onChange={handleSearch}
      aria-busy={isPending || undefined}
    />
  );
};
