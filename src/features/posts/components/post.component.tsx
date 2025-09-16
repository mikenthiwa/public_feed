'use client';
import { useGetPostQuery } from '@/core/services/posts';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Typography,
  Skeleton,
} from '@mui/material';

export const PostComponent = ({ id }: { id: number }) => {
  const { data: post, isLoading } = useGetPostQuery(id);

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
          <Typography
            variant='body1'
            color='text.primary'
            sx={{ whiteSpace: 'pre-wrap' }}
          >
            {post.body}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};
