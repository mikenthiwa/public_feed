// 'use client';
import React from 'react';
import { PostComponent } from '@/features/post/components/post.component';
import { postsApi } from '@/core/services/posts';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { createStore } from '@/store/store';
import { CustomErrorComponent } from '@/ui/custom-error.component';

export default async function Page({ params }: { params: Promise<{ id: number }> }) {
  const id = Number((await params).id);

  const store = createStore();
  const promise = store.dispatch(postsApi.endpoints.getPost.initiate(id));
  const { data: post, error } = await promise;

  if (error) return <CustomErrorComponent message='Failed to load a post' />;

  if (!post) {
    return (
      <Box maxWidth={800} mx='auto' mt={4} px={2}>
        <Card>
          <CardContent>
            <Typography variant='h6'>Post not found</Typography>
            <Typography variant='body2' color='text.secondary'>
              The post you are looking for does not exist or failed to load.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return <PostComponent post={post} />;
}
