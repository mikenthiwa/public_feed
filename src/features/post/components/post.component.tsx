'use client';
import { Box, Card, CardHeader, CardContent, Divider, Typography } from '@mui/material';
import React from 'react';
import { PostResponse } from '@/core/common/interfaces/post';

export const PostComponent = ({ post }: { post: PostResponse }) => {
  return (
    <Box maxWidth={800} mx='auto' mt={4} px={2}>
      <Card>
        <CardHeader
          title={
            <Typography variant='h4' component='h1'>
              {post.title}
            </Typography>
          }
        />
        <Divider />
        <CardContent>
          <Typography variant='body1' color='text.primary' sx={{ whiteSpace: 'pre-wrap' }}>
            {post.body}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};
