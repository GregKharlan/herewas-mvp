import { NextPage } from 'next';
import { supabase } from '../utils/supabaseClient';
import NavBar from '../components/NavBar';

const Login: NextPage = () => {
  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <button
          onClick={handleSignIn}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Sign in with Google
        </button>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-gray-500 text-white rounded ml-4"
        >
          Sign out
        </button>
      </div>
    </>
  );
};

export default Login;