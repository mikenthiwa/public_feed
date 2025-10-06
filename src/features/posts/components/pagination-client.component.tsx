'use client';
import { useEffect } from 'react';
import { Pagination } from '@mui/material';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const PaginationClientComponent = ({
  pageNumber,
  count,
}: {
  pageNumber: number;
  count: number;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set('pageNumber', pageNumber.toString());
    router.push(`${pathname}?${params.toString()}`);
  }, [pageNumber, pathname, router, searchParams]);

  const setRouteParams = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('pageNumber', page.toString());

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setRouteParams(value);
  };

  return (
    <Pagination
      page={pageNumber}
      count={count}
      onChange={handleChange}
      color='primary'
      shape='rounded'
      showFirstButton
      showLastButton
    />
  );
};
