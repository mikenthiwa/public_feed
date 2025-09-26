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

const push = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

describe('HomePage', () => {
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

  it('navigates to a specific page when pagination is clicked', () => {
    mockReturn = {
      data: Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        userId: 1,
        title: `Post ${i + 1}`,
        body: `Body ${i + 1}`,
      })),
      isLoading: false,
    };

    render(<PostPageComponent />);
    const page2 = screen.getByRole('button', { name: 'Go to page 2' });
    fireEvent.click(page2);

    expect(screen.getByText('11: Post 11')).toBeInTheDocument();
    expect(screen.queryByText('1: Post 1')).not.toBeInTheDocument();
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

  it('navigates to the correct post when a list item is clicked', () => {
    render(<PostListComponent posts={mockPosts} />);
    const firstPost = screen.getByText('1: First Post');
    fireEvent.click(firstPost);
    expect(push).toHaveBeenCalledWith('/1');
  });
});
