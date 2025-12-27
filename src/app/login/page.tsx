'use client';

import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaGoogle, FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState(''); // Variable tetap 'username' tapi bisa diisi email
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      toast.error("Login Gagal! Cek username/email atau password.");
      setLoading(false);
    } else {
      toast.success("Login Berhasil!");
      router.push('/dashboard');
    }
  };

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white p-4">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700">
        <Link href="/" className="text-gray-400 hover:text-white flex items-center gap-2 mb-6 text-sm">
          <FaArrowLeft /> Kembali ke Depan
        </Link>

        <h1 className="text-3xl font-bold mb-2 text-indigo-400">Selamat Datang</h1>
        <p className="text-gray-400 mb-8">Masuk untuk melihat kenanganmu.</p>

        <button 
          onClick={handleGoogleLogin}
          className="w-full bg-white text-gray-900 font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition mb-6"
        >
          <FaGoogle /> Masuk dengan Google
        </button>

        <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-600"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-gray-800 text-gray-500">atau login manual</span></div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Username atau Email</label>
            <input 
              type="text" 
              className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-indigo-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ketik username atau email kamu"
              required 
            />
          </div>
          <div>
            <div className="flex justify-between mb-1">
                <label className="block text-sm font-medium text-gray-300">Password</label>
                <Link href="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300">Lupa password?</Link>
            </div>
            <input 
              type="password" 
              className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-all mt-4"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Belum punya akun? <Link href="/register" className="text-indigo-400 hover:underline">Daftar disini</Link>
        </p>
      </div>
    </div>
  );
}