'use client';
import { Box, Typography } from '@mui/material';
import React from 'react';

export const CustomErrorComponent = ({ message }: { message: string }) => (
  <Box className='flex justify-center items-center min-h-screen'>
    <Typography>{message}</Typography>
  </Box>
);
