import { useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';

const NewPost: NextPage = () => {
  const [text, setText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: call API to create post
    alert('Post created');
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
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
            Submit
          </button>
        </form>
      </main>
    </>
  );
};

export default NewPost;
