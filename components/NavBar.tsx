import Link from 'next/link';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';

export default function NavBar() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <nav className="bg-gray-800 text-white py-4 px-6 flex items-center justify-between">
      <div className="flex space-x-4">
        <Link href="/">
          <span className="font-bold text-xl cursor-pointer">HereWas</span>
        </Link>
        {session && (
          <>
            <Link href="/feed">
              <span className="hover:underline cursor-pointer">Feed</span>
            </Link>
            <Link href="/new">
              <span className="hover:underline cursor-pointer">New Post</span>
            </Link>
            <Link href="/profile">
              <span className="hover:underline cursor-pointer">Profile</span>
            </Link>
          </>
        )}
      </div>
      <div>
        {session ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={handleLogin}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}