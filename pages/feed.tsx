import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { supabase } from '../utils/supabaseClient';

interface Post {
  id: string;
  text: string;
  likes_count: number;
  author_id: string;
  created_at: string;
}

const Feed: NextPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const position = await new Promise<any>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        const { latitude, longitude } = position.coords;
        const { data, error } = await supabase.rpc('get_posts_nearby', {
          lat: latitude,
          lon: longitude,
          radius: 100,
        });
        if (error) {
          throw error;
        }
        setPosts(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <>
      <Head>
        <title>Feed</title>
      </Head>
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Nearby Posts</h1>
        {loading ? (
          <p>Loading…</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="border p-4 rounded">
                <p className="mb-2">{post.text}</p>
                <p className="text-sm text-gray-500">Likes: {post.likes_count ?? 0}</p>
              </div>
            ))}
            {posts.length === 0 && <p>No posts nearby.</p>}
          </div>
        )}
      </main>
    </>
  );
};

export default Feed;
