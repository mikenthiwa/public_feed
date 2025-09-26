import React, { Suspense } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { PostComponent } from '@/features/post/components/post.component';
import { PostResponse } from '@/core/common/interfaces/post';
import PostPage from '@/app/[id]/page';
import { Box, Card, CardContent, CardHeader, Divider, Skeleton, Typography } from '@mui/material';

interface MockReturn {
  isLoading?: boolean;
  data?: PostResponse | undefined;
}

let mockReturn: MockReturn = {};

vi.mock('@/core/services/posts', () => ({
  useGetPostQuery: () => mockReturn,
}));

describe('PostComponent', () => {
  it('shows loading state', async () => {
    mockReturn = { data: undefined, isLoading: true };
    const param = Promise.resolve({ id: 1 });
    render(
      <Suspense
        fallback={
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
        }
      >
        <PostPage params={param} />
      </Suspense>
    );

    await waitFor(() => {
      expect(document.querySelectorAll('.MuiSkeleton-root').length).toBeGreaterThan(0);
    });
  });

  it('shows not found state', async () => {
    mockReturn = { data: undefined, isLoading: false };
    const param = Promise.resolve({ id: 1 });

    render(
      <Suspense
        fallback={
          <Box className='flex justify-center items-center min-h-screen'>
            <Typography color='error'>Failed to load a post</Typography>
          </Box>
        }
      >
        <PostPage params={param} />
      </Suspense>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to load a post')).toBeInTheDocument();
    });
  });

  it('renders post', () => {
    const post: PostResponse = {
      id: 1,
      title: 'Test Title',
      body: 'Test Body',
      userId: 1,
    };

    render(<PostComponent post={post} />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Body')).toBeInTheDocument();
  });
});
