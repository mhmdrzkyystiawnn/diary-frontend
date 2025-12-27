"use client";

import { useSession } from "next-auth/react"; // Import ini
import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { FaPlay, FaPause, FaPaperPlane, FaTrash } from "react-icons/fa";

interface Note {
  id: string;
  timestamp: number;
  content: string;
}

interface AudioPlayerProps {
  fileId: string;
  fileUrl: string;
}

export default function AudioPlayer({ fileId, fileUrl }: AudioPlayerProps) {
  const { data: session } = useSession(); // Panggil Hooks disini
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState("");

  const fetchNotes = useCallback(async () => {
    try {
      // Ambil token dari session variable, bukan localStorage
      const token = session?.accessToken;
      if (!fileId || !token) return;

      const res = await axios.get(
        `https://diary-backend-production-e2fc.up.railway.app/api/memories/${fileId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.data.notes) {
        setNotes(res.data.data.notes);
      }
    } catch (err) {
      console.error("Gagal ambil notes:", err);
    }
  }, [fileId, session]); // Dependency ke session

  useEffect(() => {
    if (session?.accessToken) {
      fetchNotes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileId, session]); // Trigger kalau session ready

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleSendNote = async () => {
    if (!currentNote) return;
    const timestampNow = Math.floor(currentTime);

    try {
      const token = session?.accessToken;
      await axios.post(
        "https://diary-backend-production-e2fc.up.railway.app/api/memories/note",
        {
          fileId: fileId,
          timestamp: timestampNow,
          content: currentNote,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCurrentNote("");
      fetchNotes();
    } catch (error) {
      console.error(error);
      alert("Gagal kirim note.");
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm("Hapus note ini?")) return;
    try {
      const token = session?.accessToken;
      await axios.delete(
        `https://diary-backend-production-e2fc.up.railway.app/api/memories/note/${noteId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchNotes();
    } catch (error) {
      console.error(error);
      alert("Gagal hapus.");
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div className="w-full bg-gray-900 p-4 rounded-xl border border-gray-700">
      <audio
        ref={audioRef}
        src={fileUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />

      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={togglePlay}
          className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-500 transition"
        >
          {isPlaying ? <FaPause /> : <FaPlay className="ml-1" />}
        </button>

        <div className="flex-1">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (audioRef.current) audioRef.current.currentTime = val;
              setCurrentTime(val);
            }}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          placeholder={`Komentar di detik ${formatTime(currentTime)}...`}
          className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
          onKeyDown={(e) => e.key === "Enter" && handleSendNote()}
        />
        <button
          onClick={handleSendNote}
          className="bg-indigo-600 px-4 rounded hover:bg-indigo-500 transition"
        >
          <FaPaperPlane />
        </button>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600">
        {notes
          .sort((a, b) => a.timestamp - b.timestamp)
          .map((note) => {
            const isActive = Math.abs(currentTime - note.timestamp) < 2;

            return (
              <div
                key={note.id}
                className={`flex justify-between items-center p-2 rounded text-sm transition-all ${
                  isActive
                    ? "bg-indigo-900 border-l-4 border-indigo-400"
                    : "bg-gray-800"
                }`}
              >
                <div
                  className="cursor-pointer flex-1"
                  onClick={() => {
                    if (audioRef.current)
                      audioRef.current.currentTime = note.timestamp;
                  }}
                >
                  <span className="text-indigo-400 font-bold mr-2">
                    [{formatTime(note.timestamp)}]
                  </span>
                  <span className="text-gray-200">{note.content}</span>
                </div>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="text-red-500 hover:text-red-400 ml-2"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
}
