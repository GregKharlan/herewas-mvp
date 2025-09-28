import type { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>HereWas - Home</title>
      </Head>
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Nearby Posts</h1>
        <p className="mb-4">This will display posts near you.</p>
      </main>
    </>
  );
};

export default Home;
