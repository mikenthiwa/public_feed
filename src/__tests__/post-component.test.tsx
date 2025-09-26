import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PostComponent } from '@/features/post/components/post.component';
import { PostResponse } from '@/core/common/interfaces/post';

interface MockReturn {
  isLoading?: boolean;
  data?: PostResponse | undefined;
}

let mockReturn: MockReturn = {};

vi.mock('@/core/services/posts', () => ({
  useGetPostQuery: () => mockReturn,
}));

describe('PostComponent', () => {
  it('shows loading state', () => {
    mockReturn = { data: undefined, isLoading: true };
    render(<PostComponent id={1} />);
    const skeletons = document.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('shows not found state', () => {
    mockReturn = { data: undefined, isLoading: false };
    render(<PostComponent id={1} />);
    expect(screen.getByText('Post not found')).toBeInTheDocument();
  });

  it('renders post', () => {
    mockReturn = {
      data: { id: 1, title: 'Test Title', body: 'Test Body', userId: 1 },
      isLoading: false,
    };
    render(<PostComponent id={1} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Body')).toBeInTheDocument();
  });
});
