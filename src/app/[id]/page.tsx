import { PostComponent } from '@/features/posts/components/post.component';

export default async function Page({ params }: { params: { id: number } }) {
  const { id } = await params;
  return <PostComponent id={id} />;
}
