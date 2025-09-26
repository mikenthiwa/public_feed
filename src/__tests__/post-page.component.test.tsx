import { expect, describe, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import PostPageComponent from '@/app/page';
import { PostResponse } from '@/core/common/interfaces/post';
import { PostListComponent } from '@/features/posts/components/post-list.component';
import { SearchComponent } from '@/ui/search.component';

interface MockReturn {
  isLoading?: boolean;
  data?: PostResponse[] | undefined;
}

let mockReturn: MockReturn = {};

const mockPosts = [
  { id: 1, userId: 1, title: 'First Post', body: 'Hello world' },
  { id: 2, userId: 2, title: 'Second Post', body: 'Another post' },
];

vi.mock('@/core/services/posts', () => ({
  useGetPostsQuery: () => mockReturn,
}));

vi.mock('@/core/services/posts', () => ({
  useGetPostsQuery: () => mockReturn,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe('PostPage', () => {
  it('shows loading state', () => {
    mockReturn = { data: undefined, isLoading: true };
    render(<PostPageComponent />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders posts', () => {
    mockReturn = { data: mockPosts, isLoading: false };
    render(<PostListComponent posts={mockPosts!} />);
    expect(screen.getByText('1: First Post')).toBeInTheDocument();
    expect(screen.getByText('2: Second Post')).toBeInTheDocument();
  });

  it('renders search input with correct value and label', () => {
    render(<SearchComponent searchTerm='test' onSearch={vi.fn()} />);
    const input = screen.getByLabelText(/search/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('test');
  });

  it('calls onSearch when input changes', () => {
    const onSearch = vi.fn();
    render(<SearchComponent searchTerm='' onSearch={onSearch} />);
    const input = screen.getByLabelText(/search/i);
    fireEvent.change(input, { target: { value: 'new value' } });
    expect(onSearch).toHaveBeenCalledWith('new value');
  });
});
