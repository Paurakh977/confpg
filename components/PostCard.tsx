"use client";

import { useState } from "react";
import {
  ArrowUp,
  ArrowDown,
  MessageCircle,
  ReportAnalytics,
} from "tabler-icons-react";
import { departmentColors, departmentFullNames } from "@/lib/departmentColors";
import { yearColors } from "@/lib/yearColors";
import Comments from "./Comments"; // 👈 import the new component

interface PostCardProps {
  id: string;
  text: string;
  department: string;
  createdAt: Date;
  year?: number;
  gender?: "male" | "female";
  upvotes: number;
  downvotes: number;
  commentsCount: number;
  views: number;
}

function timeAgo(date: Date) {
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 60) return "Just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  const y = Math.floor(mo / 12);
  return `${y}y ago`;
}

export default function PostCard({
  id,
  text,
  department,
  createdAt,
  year,
  gender,
  upvotes,
  downvotes,
  commentsCount,
  views,
}: PostCardProps) {
  const [localUpvotes, setLocalUpvotes] = useState(upvotes);
  const [localDownvotes, setLocalDownvotes] = useState(downvotes);
  const [showComments, setShowComments] = useState(false);

  const handleVote = async (type: "upvote" | "downvote") => {
    try {
      const res = await fetch(`/api/confessions/${id}/${type}`, { method: "POST" });
      if (res.ok) {
        if (type === "upvote") setLocalUpvotes((u) => u + 1);
        else setLocalDownvotes((d) => d + 1);
      }
    } catch (err) {
      console.error("vote error:", err);
    }
  };

  const genderLabel =
    gender === "male" ? "keta" : gender === "female" ? "keti" : "Unknown";
  const deptColor = departmentColors[department] || "bg-gray-500/40 text-gray-200";
  const deptFull = departmentFullNames[department] || department;
  const yearStyle = year ? yearColors[year] || "bg-gray-500/30 text-gray-300" : "";

  return (
    <div className="w-full border border-white/20 rounded-lg p-4 bg-black text-white space-y-3 shadow-sm hover:shadow-md transition">
      <p className="text-2xl font-semibold leading-snug">{text}</p>

      <div className="flex flex-col text-gray-400 text-sm space-y-1">
        <div className="flex items-center space-x-3 flex-wrap">
          <span className="text-gray-500">By a {genderLabel}</span>

          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold tracking-wide ${deptColor}`}
            title={deptFull}
          >
            {department}
          </span>

          {year && (
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${yearStyle}`}
            >
              {year} Year
            </span>
          )}

          <span>{timeAgo(createdAt)}</span>
        </div>
      </div>

      {/* Interaction Row */}
      <div className="flex items-center space-x-6 pt-1 text-gray-300">
        <button
          onClick={() => handleVote("upvote")}
          className="flex items-center space-x-1 hover:text-green-400 transition"
        >
          <ArrowUp size={20} />
          <span>{localUpvotes}</span>
        </button>

        <button
          onClick={() => handleVote("downvote")}
          className="flex items-center space-x-1 hover:text-red-400 transition"
        >
          <ArrowDown size={20} />
          <span>{localDownvotes}</span>
        </button>

        <button
          onClick={() => setShowComments((prev) => !prev)}
          className="flex items-center space-x-1 hover:text-blue-400 transition"
        >
          <MessageCircle size={20} />
          <span>{commentsCount}</span>
        </button>

        <div className="flex items-center space-x-1 hover:text-yellow-400 transition ml-auto">
          <ReportAnalytics size={20} />
          <span>{views}</span>
        </div>
      </div>

      {/* Comment Section */}
      {showComments && <Comments confessionId={id} />}
    </div>
  );
}
