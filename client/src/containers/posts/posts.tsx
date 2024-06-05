import { LoadingSpinner } from '@/shared/Spinner';
import { GetPostsDocument, GetPostsQuery } from '@/generated/graphql';
import { getClient } from '@/libs/helpers/apollo-client';
import Link from 'next/link';

export const Posts = async () => {
  const client = getClient();
  const { data, loading, error } = await client.query<GetPostsQuery>({ query: GetPostsDocument });

  if (loading || error || !data) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      {data.posts.map((post) => {
        return (
          <div key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <Link href={`/posts/${post.id}`}>View more</Link>
          </div>
        );
      })}
    </div>
  );
};
