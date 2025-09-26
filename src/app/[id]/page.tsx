'use client';
import { PostComponent } from '@/features/post/components/post.component';
import { useGetPostQuery } from '@/core/services/posts';
import { Box, Card, CardContent, CardHeader, Divider, Skeleton, Typography } from '@mui/material';
import React from 'react';
import { CustomErrorComponent } from '@/ui/custom-error.component';

export default function Page({ params }: { params: Promise<{ id: number }> }) {
  const unwrapped = React.use(params);
  const { id } = unwrapped;
  const { data: post, isLoading, error } = useGetPostQuery(id);

  if (error) return <CustomErrorComponent message='Failed to load a post' />;

  if (isLoading) {
    return (
      <Box maxWidth={800} mx='auto' mt={4} px={2}>
        <Card>
          <CardHeader
            title={<Skeleton width='60%' height={32} />}
            subheader={<Skeleton width='30%' />}
          />
          <Divider />
          <CardContent>
            <Skeleton height={20} />
            <Skeleton height={20} />
            <Skeleton height={20} width='80%' />
          </CardContent>
        </Card>
      </Box>
    );
  }

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
