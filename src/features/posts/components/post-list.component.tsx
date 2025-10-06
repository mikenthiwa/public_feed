import React from 'react';
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { PostResponse } from '@/core/common/interfaces/post';
import Link from 'next/link';

export const PostListComponent = ({ posts }: { posts: PostResponse[] }) => {
  return (
    <List>
      {posts.map((post) => (
        <ListItem className='cursor-pointer' key={post.id} alignItems='flex-start'>
          <ListItemButton component={Link} href={`/${post.id}`} prefetch={false}>
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
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};
