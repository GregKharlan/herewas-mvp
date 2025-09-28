import { useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { supabase } from '../utils/supabaseClient';

const NewPost: NextPage = () => {
  const [text, setText] = useState('');
  const [ttl, setTtl] = useState(1440);
  const [visibility, setVisibility] = useState<'public' | 'followers'>('public');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const position = await new Promise<any>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      const { latitude, longitude } = position.coords;
      let liveUntil: string | null = null;
      if (ttl > 0) {
        const until = new Date(Date.now() + ttl * 60 * 1000);
        liveUntil = until.toISOString();
      }
      const { error } = await supabase.from('posts').insert({
        text,
        visibility,
        is_ephemeral: liveUntil !== null,
        live_until: liveUntil,
        location: 'POINT(' + longitude + ' ' + latitude + ')',
        location_source: 'device',
      });
      if (error) throw error;
      setText('');
      alert('Post created');
    } catch (err) {
      console.error(err);
      alert('Failed to create post');
    }
  };

  return (
    <>
      <Head>
        <title>New Post</title>
      </Head>
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">New Post</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={250}
            className="w-full p-2 border rounded"
            placeholder="What's on your mind?"
          />
          <div>
            <label className="block mb-1">Time to live (minutes, 5-10080):</label>
            <input
              type="number"
              min={5}
              max={10080}
              value={ttl}
              onChange={(e) => setTtl(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Visibility:</label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as 'public' | 'followers')}
              className="w-full p-2 border rounded"
            >
              <option value="public">Public</option>
              <option value="followers">Followers</option>
            </select>
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
            Submit
          </button>
        </form>
      </main>
    </>
  );
};

export default NewPost;
