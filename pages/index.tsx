import type { NextPage } from 'next';
import Head from 'next/head';
import NavBar from '../components/NavBar';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>HereWas - Home</title>
      </Head>
      <NavBar />
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Welcome to HereWas</h1>
        <p className="mb-4">Discover and share posts around you!</p>
      </main>
    </>
  );
};

export default Home;
