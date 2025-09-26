'use client';
import React from 'react';
import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { PostResponse } from '@/core/common/interfaces/post';

export const PostListComponent = ({ posts }: { posts: PostResponse[] }) => {
  const router = useRouter();

  return (
    <List>
      {posts.map((post) => (
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
  );
};
