import type { NextPage } from 'next';
import Head from 'next/head';

const Feed: NextPage = () => {
  return (
    <>
      <Head>
        <title>Feed</title>
      </Head>
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Your Feed</h1>
        <p className="mb-4">This will display posts from users you follow.</p>
      </main>
    </>
  );
};

export default Feed;
