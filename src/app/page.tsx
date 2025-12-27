'use client';

import Link from 'next/link';
import { FaMemory, FaArrowRight } from 'react-icons/fa';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Navbar Simple */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 text-indigo-500 text-2xl font-bold">
          <FaMemory /> Vault Memory
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-4 py-2 text-gray-300 hover:text-white transition">
            Masuk
          </Link>
          <Link href="/register" className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition">
            Daftar
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-600">
          Simpan Kenangan.<br />Abadi Selamanya.
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mb-10">
          Upload foto, simpan lagu, dan tulis cerita di setiap detiknya. 
          Seperti mesin waktu, tapi lebih canggih.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/register" className="px-8 py-4 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transition flex items-center gap-2">
            Mulai Sekarang <FaArrowRight />
          </Link>
          <Link href="/login" className="px-8 py-4 border border-gray-600 rounded-full hover:border-indigo-500 hover:text-indigo-400 transition">
            Sudah punya akun?
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-gray-600 text-sm">
        &copy; 2025 Vault Memory Project. Built with Next.js & Express.
      </footer>
    </div>
  );
}