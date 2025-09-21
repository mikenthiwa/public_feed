import { isRejectedWithValue, ListenerMiddleware } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

export const rtkErrorToastMiddleware: ListenerMiddleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    toast.error('Something went wrong');
  }
  return next(action);
};
