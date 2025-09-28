import type { NextPage } from 'next';
import Head from 'next/head';

const Profile: NextPage = () => {
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
        <p className="mb-4">This is your profile page.</p>
      </main>
    </>
  );
};

export default Profile;
