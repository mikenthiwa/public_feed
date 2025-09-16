import { expect, describe, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PostsComponent } from '@/features/posts/components/posts.component';
import { PostResponse } from '@/core/common/interfaces/post';

interface MockReturn {
  isLoading?: boolean;
  data?: PostResponse[] | undefined;
}

const mockPosts = [
  { id: 1, userId: 1, title: 'First Post', body: 'Hello world' },
  { id: 2, userId: 2, title: 'Second Post', body: 'Another post' },
];

let mockReturn: MockReturn = {};

vi.mock('@/core/services/posts', () => ({
  useGetPostsQuery: () => mockReturn,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe('PostsComponent', () => {
  it('shows loading state', () => {
    mockReturn = { data: undefined, isLoading: true };
    render(<PostsComponent />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders posts and pagination', () => {
    mockReturn = { data: mockPosts, isLoading: false };
    render(<PostsComponent />);
    expect(screen.getByText('All Posts')).toBeInTheDocument();
    expect(screen.getByText('1: First Post')).toBeInTheDocument();
    expect(screen.getByText('2: Second Post')).toBeInTheDocument();
  });
});
