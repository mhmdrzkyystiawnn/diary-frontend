"use client";

import { useState, FormEvent } from "react";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { FaArrowLeft, FaEnvelope } from "react-icons/fa";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        "https://diary-backend-production-e2fc.up.railway.app/api/auth/forgot-password",
        { email }
      );
      toast.success("Cek emailmu! Link reset sudah dikirim.");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.msg || "Gagal kirim email");
      } else {
        toast.error("Terjadi kesalahan.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white p-4">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-2xl shadow-xl border border-gray-700 text-center">
        <h1 className="text-2xl font-bold mb-2 text-indigo-400">
          Lupa Password?
        </h1>
        <p className="text-gray-400 mb-6 text-sm">
          Masukkan email yang terdaftar, kami akan kirimkan link untuk reset
          password.
        </p>

        <form onSubmit={handleRequestReset} className="space-y-4">
          <div className="relative">
            <FaEnvelope className="absolute top-3.5 left-3 text-gray-500" />
            <input
              type="email"
              className="w-full pl-10 p-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-indigo-500"
              placeholder="email@kamu.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-all"
          >
            {loading ? "Mengirim..." : "Kirim Link Reset"}
          </button>
        </form>

        <div className="mt-6">
          <Link
            href="/login"
            className="text-gray-400 hover:text-white flex items-center justify-center gap-2 text-sm"
          >
            <FaArrowLeft /> Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
}
