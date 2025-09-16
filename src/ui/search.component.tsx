import React from 'react';
import { TextField } from '@mui/material';

export const SearchComponent = ({
  searchTerm,
  onSearch,
}: {
  searchTerm: string;
  onSearch: (val: string) => void;
}) => {
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    onSearch(val);
  };

  return (
    <TextField
      id='search-term'
      label='search'
      variant='outlined'
      size='small'
      value={searchTerm}
      onChange={handleSearch}
    />
  );
};
