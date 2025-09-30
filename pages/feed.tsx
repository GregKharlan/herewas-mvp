import { useEffect, useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '../utils/supabaseClient';
import NavBar from '../components/NavBar.tsx';

interface Post {
  id: string;
  author_id: string;
  created_at: string;
  text: string | null;
  visibility: 'public' | 'followers';
  is_ephemeral: boolean;
  live_until: string | null;
  likes_count: number;
}

export default function Feed() {
  const session = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!session) {
        setLoading(false);
        return;
      }
      try {
        // Get user's current position
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        const { latitude, longitude } = position.coords;
        // Call stored procedure to get nearby posts within 100 meters
        const { data, error } = await supabase.rpc('get_posts_nearby', {
          lat: latitude,
          lon: longitude,
          radius: 100,
        });
        if (!error && data) {
          setPosts(data as Post[]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [session]);

  const handleLike = async (postId: string) => {
    if (!session) return;
    const { error } = await supabase.from('likes').insert({ post_id: postId });
    if (!error) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, likes_count: p.likes_count + 1 } : p,
        ),
      );
    }
  };

  const handleFollow = async (authorId: string) => {
    if (!session) return;
    await supabase.from('follows').insert({ followee_id: authorId, origin: 'from_post' });
  };

  if (!session) {
    return (
      <>
        <NavBar />
        <main className="p-4">
          <h1 className="text-2xl font-bold mb-4">Your Feed</h1>
          <p>Please log in to view your feed.</p>
        </main>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Nearby Posts</h1>
        {loading ? (
          <p>Loading...</p>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="border p-3 mb-3">
              {post.text && <p className="mb-2">{post.text}</p>}
              <small className="text-gray-500">
                By {post.author_id} at{' '}
                {new Date(post.created_at).toLocaleString()}
              </small>
              <div className="flex items-center space-x-2 mt-2">
                <span>Likes: {post.likes_count}</span>
                <button
                  onClick={() => handleLike(post.id)}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Like
                </button>
                <button
                  onClick={() => handleFollow(post.author_id)}
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  Follow
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No posts nearby.</p>
        )}
      </div>
    </>
  );
}
