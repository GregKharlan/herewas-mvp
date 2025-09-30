import { useState, FormEvent } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useRouter } from 'next/router';
import { useSession } from '@supabase/auth-helpers-react';
import NavBar from '../components/NavBar.tsx';

export default function NewPost() {
  const [text, setText] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  // TTL in minutes: default 1 day (1440 minutes)
  const [ttl, setTtl] = useState(1440);
  const [visibility, setVisibility] = useState<'public' | 'followers'>('public');
  const session = useSession();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!session) {
      router.push('/login');
      return;
    }

    try {
      // Get user's location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      const { latitude, longitude } = position.coords;

      // Compute live_until if TTL provided (>=5 minutes)
      const liveFrom = new Date();
      const isEphemeral = ttl > 0;
      const liveUntil = isEphemeral
        ? new Date(liveFrom.getTime() + ttl * 60 * 1000)
        : null;

      // Insert post
      const { data: insertedPost, error: postError } = await supabase
        .from('posts')
        .insert({
          text: text || null,
          visibility,
          is_ephemeral: isEphemeral,
          live_from: liveFrom.toISOString(),
          live_until: liveUntil ? liveUntil.toISOString() : null,
          location: `POINT(${longitude} ${latitude})`,
          location_source: 'device',
        })
        .select()
        .single();

      if (postError || !insertedPost) {
        console.error(postError);
        alert('Error creating post');
        return;
      }

      // Upload up to 3 images
      if (files) {
        for (let i = 0; i < Math.min(files.length, 3); i++) {
          const file = files[i];
          const filePath = `${insertedPost.id}/${Date.now()}_${file.name}`;
          const { error: uploadError } = await supabase.storage
            .from('post-images')
            .upload(filePath, file);
          if (!uploadError) {
            // Save media record
            await supabase.from('post_media').insert({
              post_id: insertedPost.id,
              url: filePath,
              width: null,
              height: null,
              exif: null,
              order_index: i,
            });
          } else {
            console.error(uploadError);
          }
        }
      }

      // Redirect to feed after successful creation
      router.push('/feed');
    } catch (error) {
      console.error(error);
      alert('Error creating post. Please ensure location access is enabled.');
    }
  };

  if (!session) {
    return (
      <>
        <NavBar />
        <main className="p-4">
          <p>Please log in to create a post.</p>
        </main>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Create a New Post</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            className="w-full p-2 border rounded"
            maxLength={250}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind?"
          />
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(e.target.files)}
          />
          <div>
            <label className="mr-2">Visibility:</label>
            <select
              value={visibility}
              onChange={(e) =>
                setVisibility(e.target.value as 'public' | 'followers')
              }
              className="border p-1"
            >
              <option value="public">Public</option>
              <option value="followers">Followers</option>
            </select>
          </div>
          <div>
            <label className="mr-2">Time to Live (minutes):</label>
            <input
              type="number"
              min={5}
              max={10080}
              value={ttl}
              onChange={(e) => setTtl(parseInt(e.target.value, 10))}
              className="border p-1"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
