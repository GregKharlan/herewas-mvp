import { useEffect, useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '../utils/supabaseClient';
import NavBar from '../components/NavBar';

interface Post {
  id: string;
  author_id: string;
  created_at: string;
  text: string | null;
  likes_count: number;
}

export default function Profile() {
  const session = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyPosts = async () => {
      if (!session) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('posts')
        .select('id, author_id, created_at, text, likes_count')
        .eq('author_id', session.user.id)
        .order('created_at', { ascending: false });
      if (!error && data) {
        setPosts(data as Post[]);
      }
      setLoading(false);
    };
    fetchMyPosts();
  }, [session]);

  if (!session) {
    return (
      <>
        <NavBar />
        <main className="p-4">
          <p>Please log in to view your profile.</p>
        </main>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">My Posts</h1>
        {loading ? (
          <p>Loading...</p>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="border p-3 mb-3">
              {post.text && <p className="mb-2">{post.text}</p>}
              <small className="text-gray-500">
                Created at {new Date(post.created_at).toLocaleString()}
              </small>
              <div>Likes: {post.likes_count}</div>
            </div>
          ))
        ) : (
          <p>You haven't created any posts yet.</p>
        )}
      </div>
    </>
  );
}
