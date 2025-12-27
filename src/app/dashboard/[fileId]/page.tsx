"use client";

import { useSession } from "next-auth/react"; // 1. Import hook
import { useState, useEffect, useCallback, FormEvent } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { FaArrowLeft, FaSave, FaMusic } from "react-icons/fa";
// 2. Import AudioPlayer yang benar
import AudioPlayer from "@/components/AudioPlayer";
import toast from "react-hot-toast";

interface Memory {
  id: string;
  content: string;
  mood: string;
}

interface FileDetail {
  id: string;
  originalName: string;
  filename: string;
  path: string;
  type: "PHOTO" | "AUDIO" | "VIDEO" | "OTHER";
  memory?: Memory | null;
}

export default function DetailPage() {
  // 3. Panggil Hook di Level Paling Atas (WAJIB)
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const fileId = params.fileId as string;

  const [file, setFile] = useState<FileDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const [diaryContent, setDiaryContent] = useState("");
  const [mood, setMood] = useState("Happy");
  const [saving, setSaving] = useState(false);

  const fetchDetail = useCallback(async () => {
    // 4. Gunakan token dari variable session (bukan panggil useSession disini)
    const token = session?.accessToken;

    if (status === "loading") return;
    if (!token) return router.push("/");

    try {
      const res = await axios.get(
        `https://diary-backend-production-e2fc.up.railway.app/api/memories/${fileId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = res.data.data;
      setFile(data);

      if (data.memory) {
        setDiaryContent(data.memory.content);
        setMood(data.memory.mood);
      }
    } catch (err) {
      console.error("Gagal ambil detail:", err);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }, [fileId, router, session, status]); // Masukkan session & status ke dependency

  useEffect(() => {
    if (status !== "loading") {
      fetchDetail();
    }
  }, [fetchDetail, status]);

  const handleSaveDiary = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // 5. Ambil token dari session variable
    const token = session?.accessToken;

    try {
      await axios.post(
        "https://diary-backend-production-e2fc.up.railway.app/api/memories",
        {
          fileId: fileId,
          content: diaryContent,
          mood: mood,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Cerita tersimpan abadi! 📝"); // Ganti alert
      fetchDetail();
    } catch (err) {
      console.error("Gagal simpan:", err);
      toast.error("Gagal menyimpan cerita."); // Ganti alert
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading)
    return (
      <div className="text-white text-center mt-20">Membuka Kenangan...</div>
    );
  if (!file)
    return <div className="text-white text-center">File tidak ditemukan.</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition"
        >
          <FaArrowLeft /> Kembali ke Galeri
        </button>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex flex-col items-center justify-center min-h-75">
          {file.type === "PHOTO" ? (
            <div className="relative w-full h-96">
              <Image
                src={`https://diary-backend-production-e2fc.up.railway.app/uploads/${file.filename}`}
                alt={file.originalName}
                fill
                className="object-contain rounded-lg"
                unoptimized
              />
            </div>
          ) : (
            <div className="w-full">
              <div className="text-center mb-6">
                <FaMusic className="text-6xl text-indigo-500 mx-auto mb-4" />
                <p className="text-xl font-bold truncate">
                  {file.originalName}
                </p>
              </div>

              <AudioPlayer
                fileId={file.id}
                fileUrl={`https://diary-backend-production-e2fc.up.railway.app/uploads/${file.filename}`}
              />
            </div>
          )}
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-2xl font-bold mb-4 text-indigo-400">
            📖 Cerita di balik ini
          </h2>

          <form onSubmit={handleSaveDiary} className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-gray-400">Mood saat ini:</label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full mt-1 p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none"
              >
                <option value="Happy">Happy 😄</option>
                <option value="Nostalgia">Nostalgia 🥺</option>
                <option value="Sad">Sad 😢</option>
                <option value="Excited">Excited 🤩</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-400">Tulis kenanganmu:</label>
              <textarea
                rows={8}
                value={diaryContent}
                onChange={(e) => setDiaryContent(e.target.value)}
                placeholder="Dulu waktu foto ini diambil..."
                className="w-full mt-1 p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded flex items-center justify-center gap-2 transition"
            >
              <FaSave /> {saving ? "Menyimpan..." : "Simpan Cerita"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
