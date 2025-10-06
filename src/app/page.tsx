import { Fragment } from 'react';
import { PostListComponent } from '@/features/posts/components/post-list.component';
import { postsApi } from '@/core/services/posts';
import { Box, Typography } from '@mui/material';
import { createStore } from '@/store/store';
import { SearchComponent } from '@/ui/search.component';
import { CustomErrorComponent } from '@/ui/custom-error.component';
import { PaginationClientComponent } from '@/features/posts/components/pagination-client.component';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ pageNumber: number; searchTerm: string }>;
}) {
  const pageNumber = Number((await searchParams).pageNumber) || 1;
  const searchTerm = (await searchParams).searchTerm || '';

  const store = createStore();
  const promise = store.dispatch(postsApi.endpoints.getPosts.initiate());
  const { data: posts, isLoading, error } = await promise;
  if (isLoading) return <CustomErrorComponent message='Loading...' />;

  if (!posts) return <CustomErrorComponent message='No posts...' />;

  if (error) return <CustomErrorComponent message='Failed to load posts' />;

  const pageSize = 10;

  const total = posts.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  const filteredData = () => {
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.body.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const paginated = () => {
    const start = (pageNumber - 1) * pageSize;
    return filteredData().slice(start, start + pageSize);
  };

  return (
    <Fragment>
      <Box className='flex items-center justify-between flex-wrap gap-2 mb-2'>
        <Typography variant='h4' fontWeight={700} lineHeight={1.2}>
          All Posts
        </Typography>
        <Box sx={{ width: { xs: '100%', sm: 360 } }}>
          <SearchComponent searchTerm={searchTerm} />
        </Box>
      </Box>
      <PostListComponent posts={paginated()} />
      <Box display='flex' justifyContent='center' mt={2}>
        <PaginationClientComponent pageNumber={pageNumber} count={pageCount} />
      </Box>
    </Fragment>
  );
}
