"use client";

import { useState, FormEvent } from "react";
import axios, { AxiosError } from "axios";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import { FaLock } from "react-icons/fa";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams(); // Ambil token dari URL
  const token = params.token as string;

  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        `https://diary-backend-production-e2fc.up.railway.app/api/auth/reset-password/${token}`,
        {
          newPassword,
        }
      );
      toast.success("Password berhasil diubah! Login sekarang.");
      router.push("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.msg || "Link expired atau salah");
      } else {
        toast.error("Gagal reset password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white p-4">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-2xl shadow-xl border border-gray-700">
        <h1 className="text-2xl font-bold mb-4 text-center text-indigo-400">
          Password Baru
        </h1>

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Masukkan Password Baru
            </label>
            <div className="relative">
              <FaLock className="absolute top-3.5 left-3 text-gray-500" />
              <input
                type="password"
                className="w-full pl-10 p-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-indigo-500"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-all"
          >
            {loading ? "Menyimpan..." : "Simpan Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
