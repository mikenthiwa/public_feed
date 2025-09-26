'use client';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { PostListComponent } from '@/features/posts/components/post-list.component';
import { useGetPostsQuery } from '@/core/services/posts';
import { Box, Pagination, Typography } from '@mui/material';
import { SearchComponent } from '@/ui/search.component';
import { CustomErrorComponent } from '@/ui/custom-error.component';

export default function Home() {
  const { data: posts, isLoading, error } = useGetPostsQuery();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const pageSize = 10;
  const filteredData = useMemo(() => {
    if (!posts) return [];
    if (!searchTerm) return posts;
    return posts.filter((post) => {
      return (
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.body.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [posts, searchTerm]);

  const total = filteredData.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [pageCount, page]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  if (isLoading) return <CustomErrorComponent message='Loading...' />;

  if (!posts) return <CustomErrorComponent message='No posts...' />;

  if (error) return <CustomErrorComponent message='Failed to load posts' />;

  return (
    <Fragment>
      <Box
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        flexWrap='wrap'
        gap={2}
        mb={2}
      >
        <Typography variant='h4' fontWeight={700} lineHeight={1.2}>
          All Posts
        </Typography>
        <Box sx={{ width: { xs: '100%', sm: 360 } }}>
          <SearchComponent searchTerm={searchTerm} onSearch={setSearchTerm} />
        </Box>
      </Box>
      <PostListComponent posts={paginated!} />
      <Box display='flex' justifyContent='center' mt={2}>
        <Pagination
          count={pageCount}
          page={page}
          onChange={(event, value) => setPage(value)}
          color='primary'
          shape='rounded'
          showFirstButton
          showLastButton
        />
      </Box>
    </Fragment>
  );
}
