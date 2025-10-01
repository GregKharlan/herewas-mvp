import { NextPage } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../utils/supabaseClient';
import NavBar from '../components/NavBar';

const Login: NextPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.push('/');
    }
  };

  const handleGoogleSignIn = async () => {
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
        <form onSubmit={handleEmailSignIn} className="space-y-3 mb-4">
          <input
            className="w-full border p-2 rounded"
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full border p-2 rounded"
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className="w-full border p-2 rounded"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Входим...' : 'Sign in'}
          </button>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>
        <p className="mb-4 text-sm">
          Нет аккаунта?{' '}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </p>
        <div className="space-x-4">
          <button
            onClick={handleGoogleSignIn}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Sign in with Google
          </button>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Sign out
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;
