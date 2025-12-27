"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useCallback, ChangeEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaMusic, FaSignOutAlt, FaPlus } from "react-icons/fa";
import Image from "next/image";
import toast from "react-hot-toast";

interface FileItem {
  id: string;
  originalName: string;
  filename: string;
  path: string;
  type: "PHOTO" | "AUDIO" | "VIDEO" | "OTHER";
  createdAt: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Link Backend Railway Kamu
  const API_URL = "https://diary-backend-production-e2fc.up.railway.app/api/files";

  const fetchFiles = useCallback(async (token: string) => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated" || !session?.accessToken) {
      router.push("/");
    } else {
      fetchFiles(session.accessToken);
    }
  }, [status, session, router, fetchFiles]);

  // === BAGIAN YANG DIBENERIN ===
  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi ukuran di Frontend (biar gak nunggu lama baru error)
    if (file.size > 10 * 1024 * 1024) { // 10MB
        toast.error("File terlalu besar! Maksimal 10MB.");
        return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file); // Nama 'file' harus sama kayak di backend upload.single('file')

    try {
      const token = session?.accessToken;
      
      // PERBAIKAN 1: URL gak pake '/upload' lagi
      await axios.post(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // PERBAIKAN 2: JANGAN SET Content-Type manual!
          // Biar axios yang otomatis set boundary-nya.
        },
      });

      if (token) fetchFiles(token);
      toast.success("File berhasil diupload! 📂"); 
    } catch (error) {
      console.error("Upload gagal:", error);
      toast.error("Gagal Upload file. Cek koneksi/size."); 
    } finally {
      setUploading(false);
      // Reset input value biar bisa upload file yang sama kalau mau
      e.target.value = ""; 
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  if (status === "loading" || loading)
    return (
      <div className="text-white text-center mt-20">Loading Session...</div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-indigo-400">Vault Memory</h1>
          <p className="text-gray-400 text-sm">Hai, {session?.user?.name}!</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-red-400 hover:text-red-300 flex items-center gap-2"
        >
          <FaSignOutAlt /> Keluar
        </button>
      </div>

      {files.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <p>Vault masih kosong.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file) => (
            <div
              key={file.id}
              onClick={() => router.push(`/dashboard/${file.id}`)}
              className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-indigo-500 transition cursor-pointer relative group"
            >
              <div className="relative h-40 bg-gray-700 flex items-center justify-center overflow-hidden">
                {file.type === "PHOTO" ? (
                  <Image
                    // Pastikan path image match sama controller baru
                    src={`https://diary-backend-production-e2fc.up.railway.app/uploads/${file.filename}`}
                    alt={file.originalName}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    priority={false}
                    unoptimized // Biar Vercel gak rewel soal domain luar
                  />
                ) : (
                  <FaMusic className="text-4xl text-indigo-400" />
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold truncate">
                  {file.originalName}
                </p>
                <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] text-gray-400 bg-gray-900 px-2 py-1 rounded inline-block">
                    {file.type}
                    </span>
                    <span className="text-[10px] text-gray-500">
                        {new Date(file.createdAt).toLocaleDateString()}
                    </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <label className="fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-full shadow-lg cursor-pointer transition-all transform hover:scale-110 z-50">
        {uploading ? (
          <span className="text-sm font-bold animate-pulse">...</span>
        ) : (
          <FaPlus size={24} />
        )}
        <input type="file" className="hidden" onChange={handleUpload} />
      </label>
    </div>
  );
}
