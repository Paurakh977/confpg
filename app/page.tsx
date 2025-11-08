"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import PostCard from "../components/PostCard";
import {
  Photo,
  Gif,
  CircleDashed,
  MoodSmile,
  ListDetails,
} from "tabler-icons-react";
import { departmentColors } from "@/lib/departmentColors";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";

interface Confession {
  id: string;
  text: string;
  department: string;
  gender?: "male" | "female";
  year?: number;
  upvotes: number;
  downvotes: number;
  commentsCount: number;
  views: number;
  createdAt: string;
}

export default function HomePage() {
  const MAX_LENGTH = 300;
  const COOLDOWN = 30 * 1000;

  const [newConfession, setNewConfession] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [department, setDepartment] = useState("CS");
  const [year, setYear] = useState<number>(1);
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [lastPostTime, setLastPostTime] = useState<number>(0);

  const emojiRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  const program = searchParams.get("program");
  const search = searchParams.get("search");

  // ✅ Fetch confessions (supports program + search filter)
  useEffect(() => {
    const fetchConfessions = async () => {
      try {
        let url = "/api/confessions";

        if (program) {
          url = `/api/confessions?department=${program.toUpperCase()}`;
        } else if (search) {
          url = `/api/confessions?search=${encodeURIComponent(search)}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        setConfessions(data);
      } catch (err) {
        console.error("fetch error:", err);
      }
    };
    fetchConfessions();
  }, [program, search]);

  // ✅ Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEmojiClick = (emoji: EmojiClickData) => {
    setNewConfession((prev) => prev + emoji.emoji);
  };

  // ✅ Post a new confession
  const handlePost = async () => {
    if (!newConfession.trim()) return alert("Write something first!");
    if (newConfession.length > MAX_LENGTH)
      return alert(`Limit: ${MAX_LENGTH} characters.`);

    const now = Date.now();
    if (now - lastPostTime < COOLDOWN) {
      const wait = Math.ceil((COOLDOWN - (now - lastPostTime)) / 1000);
      return alert(`Slow down — wait ${wait}s before posting again.`);
    }

    setLoading(true);
    try {
      const res = await fetch("/api/confessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newConfession, department, gender, year }),
      });
      if (res.ok) {
        setNewConfession("");
        setLastPostTime(now);
        const updated = await fetch("/api/confessions");
        const data = await updated.json();
        setConfessions(data);
      }
    } catch (err) {
      console.error("post error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6 w-full relative">
      {/* Confession Composer */}
      <div className="bg-black border border-white/20 rounded-2xl p-4 space-y-3 relative">
        <input
          type="text"
          placeholder="Confession Lekhna Darako?"
          className="w-full bg-transparent text-white placeholder-gray-500 text-lg focus:outline-none"
          value={newConfession}
          onChange={(e) => setNewConfession(e.target.value)}
        />

        <p
          className={`text-sm ${
            newConfession.length > MAX_LENGTH ? "text-red-400" : "text-gray-400"
          }`}
        >
          {newConfession.length}/{MAX_LENGTH}
        </p>

        <div className="flex items-center justify-between pt-2 relative">
          {/* Toolbar */}
          <div className="flex items-center space-x-4 text-blue-500">
            <Photo size={20} />
            <Gif size={20} />
            <CircleDashed size={20} />

            {/* Department dropdown */}
            <div className="relative">
              <button onClick={() => setShowDeptDropdown(!showDeptDropdown)}>
                <ListDetails size={20} />
              </button>
              {showDeptDropdown && (
                <div className="absolute top-8 left-0 bg-gray-900 border border-gray-700 rounded-md shadow-lg p-2 z-50 max-h-64 overflow-y-auto w-80 grid grid-cols-2 gap-2">
                  {Object.keys(departmentColors).map((dept) => (
                    <button
                      key={dept}
                      onClick={() => {
                        setDepartment(dept);
                        setShowDeptDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-md text-sm font-medium transition ${
                        departmentColors[dept]
                          ? departmentColors[dept]
                          : "text-gray-400"
                      } hover:bg-gray-700`}
                      title={dept}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              )}
            </div>

              
            {/* ✅ Smart Emoji Picker */}
            
            <div className="relative" ref={emojiRef}>
              <button
                id="emoji-button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <MoodSmile size={20} />
              </button>

              {showEmojiPicker && (
                <div
                  className="absolute z-[99999]"
                  style={{
                    top: "1.8rem",
                    right: 0,
                    position: "absolute",
                  }}
                >
                  <div className="relative z-30">
                    <EmojiPicker
                      onEmojiClick={handleEmojiClick}
                      theme={Theme.DARK}
                      width={300}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Gender + Year */}
          <div className="flex items-center space-x-3 ml-auto mr-4">
            <span className="text-gray-400 text-sm">I'm a</span>

            <div className="flex border border-gray-600 rounded-full overflow-hidden">
              <button
                onClick={() => setGender("male")}
                className={`px-3 py-1 text-sm font-medium transition ${
                  gender === "male"
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-gray-800"
                }`}
              >
                keta
              </button>
              <button
                onClick={() => setGender("female")}
                className={`px-3 py-1 text-sm font-medium transition ${
                  gender === "female"
                    ? "bg-pink-500 text-white"
                    : "text-gray-400 hover:bg-gray-800"
                }`}
              >
                keti
              </button>
            </div>

            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="bg-gray-800 text-gray-200 text-sm rounded-full px-3 py-1 focus:outline-none border border-gray-700 hover:border-gray-500"
            >
              <option value={1}>1st Year</option>
              <option value={2}>2nd Year</option>
              <option value={3}>3rd Year</option>
              <option value={4}>4th Year</option>
            </select>
          </div>

          {/* Post Button */}
          <button
            onClick={handlePost}
            disabled={!newConfession.trim() || loading}
            className={`px-4 py-1.5 text-sm font-semibold rounded-full transition ${
              newConfession.trim()
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>

      {/* Confessions Feed */}
      <div className="flex flex-col space-y-4">
        {confessions.length > 0 ? (
          confessions.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              text={post.text}
              department={post.department}
              gender={post.gender}
              year={post.year}
              createdAt={new Date(post.createdAt)}
              upvotes={post.upvotes}
              downvotes={post.downvotes}
              commentsCount={post.commentsCount}
              views={post.views}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center">No confessions yet 😶</p>
        )}
      </div>
    </div>
  );
}
