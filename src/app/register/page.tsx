'use client';

import { useState, FormEvent } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { signIn } from 'next-auth/react';
import { FaGoogle, FaArrowLeft } from 'react-icons/fa';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleRegister = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Buat Akun di Backend
      await axios.post('http://localhost:5000/api/auth/register', {
        username,
        password,
        email: email || undefined
      });

      toast.success("Akun jadi! Sedang masuk...");

      // 2. Langsung Auto Login
      const loginResult = await signIn('credentials', {
        username: username, // Backend sekarang pintar, bisa terima username ini
        password: password,
        redirect: false,
      });

      if (loginResult?.error) {
         toast.error("Gagal auto-login, silakan login manual.");
         router.push('/login');
      } else {
         router.push('/dashboard');
      }

    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.msg || "Gagal Mendaftar");
      } else {
        toast.error("Terjadi kesalahan sistem");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white p-4">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-2xl shadow-xl border border-gray-700">
        
        <Link href="/" className="text-gray-400 hover:text-white flex items-center gap-2 mb-6 text-sm">
          <FaArrowLeft /> Kembali ke Depan
        </Link>

        <h1 className="text-3xl font-bold text-center mb-2 text-indigo-400">Buat Akun Baru</h1>
        <p className="text-gray-400 text-center mb-8">Gabung ke Vault Memory sekarang.</p>

        <button 
          onClick={handleGoogleRegister}
          className="w-full bg-white text-gray-900 font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition mb-6"
        >
          <FaGoogle /> Daftar dengan Google
        </button>

        <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-600"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-gray-800 text-gray-500">atau daftar manual</span></div>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input 
              type="text" 
              className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-indigo-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Opsional"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
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
            {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Sudah punya akun? <Link href="/login" className="text-indigo-400 hover:underline">Masuk disini</Link>
        </p>
      </div>
    </div>
  );
}