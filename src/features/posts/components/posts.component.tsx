'use client';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Box,
  Pagination,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useGetPostsQuery } from '@/core/services/posts';
import { SearchComponent } from '@/ui/search.component';

export const PostsComponent = () => {
  const { data: posts, isLoading } = useGetPostsQuery();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

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

  if (isLoading) {
    return (
      <Box className='flex justify-center items-center min-h-screen'>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!posts) {
    return (
      <Box className='flex justify-center items-center min-h-screen'>
        <Typography>No posts...</Typography>
      </Box>
    );
  }

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
      <List>
        {paginated.map((post) => (
          <ListItem
            className='cursor-pointer'
            key={post.id}
            alignItems='flex-start'
            onClick={() => router.push(`/${post.id}`)}
          >
            <ListItemAvatar>
              <Avatar alt={`Post ${post.id}`} />
            </ListItemAvatar>
            <ListItemText
              primary={<Typography variant='h6'>{`${post.id}: ${post.title}`}</Typography>}
              secondary={
                <React.Fragment>
                  <Typography component='span' variant='body2' color='text.primary'>
                    {`User ID: ${post.userId}`}
                  </Typography>
                  {` — ${post.body}`}
                </React.Fragment>
              }
            />
          </ListItem>
        ))}
      </List>
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
};
