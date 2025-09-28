import Link from 'next/link';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';

const NavBar = () => {
  const session = useSession();
  const supabase = useSupabaseClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center">
      <div className="space-x-4">
        <Link href="/">Feed</Link>
        <Link href="/new">New Post</Link>
        {session && <Link href="/profile">Profile</Link>}
      </div>
      <div>
        {session ? (
          <button onClick={handleLogout} className="underline">
            Logout
          </button>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
