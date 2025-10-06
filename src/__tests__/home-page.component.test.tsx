import { expect, describe, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { PostResponse } from '@/core/common/interfaces/post';
import { PostListComponent } from '@/features/posts/components/post-list.component';
import { SearchComponent } from '@/ui/search.component';
import { PaginationClientComponent } from '@/features/posts/components/pagination-client.component';

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

const push = vi.fn();
const replace = vi.fn();
vi.mock('next/navigation', async () => {
  return {
    useRouter: () => ({
      push,
      replace,
      back: vi.fn(),
      forward: vi.fn(),
      prefetch: vi.fn(),
      refresh: vi.fn(),
    }),
    usePathname: () => '/test',
    // Minimal ReadonlyURLSearchParams substitute for tests
    useSearchParams: () => new URLSearchParams(''),
  } as never;
});

describe('HomePage', () => {
  it('renders posts', () => {
    mockReturn = { data: mockPosts, isLoading: false };
    render(<PostListComponent posts={mockPosts!} />);
    expect(screen.getByText('1: First Post')).toBeInTheDocument();
    expect(screen.getByText('2: Second Post')).toBeInTheDocument();
  });

  it('navigates (updates URL) when pagination is clicked', () => {
    render(<PaginationClientComponent pageNumber={1} count={2} />);
    const page2 = screen.getByRole('button', { name: 'Go to page 2' });
    fireEvent.click(page2);

    const lastCall = (replace.mock.calls.at(-1) || push.mock.calls.at(-1)) as never;
    expect(lastCall).toBeTruthy();
    const [url] = lastCall as unknown as string[];
    expect(url).toBe('/test?pageNumber=2');
  });

  it('renders search input with correct value and label', () => {
    render(<SearchComponent searchTerm='test' />);
    const input = screen.getByLabelText(/search/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('test');
  });

  // it('updates URL when input changes', () => {
  //   render(<SearchComponent searchTerm='' />);
  //   const input = screen.getByLabelText(/search/i);
  //   fireEvent.change(input, { target: { value: 'new value' } });
  //
  //   const lastCall = (replace.mock.calls.at(-1) || push.mock.calls.at(-1)) as any;
  //   expect(lastCall).toBeTruthy();
  //   const [url] = lastCall; // ignore options arg
  //   expect(url).toBe('/test?searchTerm=new%20value');
  // });

  it('links to the correct post when a list item is clicked', () => {
    render(<PostListComponent posts={mockPosts} />);
    const link = screen.getByRole('link', { name: /1: First Post/ });
    expect(link).toHaveAttribute('href', '/1');
  });
});
