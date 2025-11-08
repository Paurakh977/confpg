"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image, Type, FileVideo, ArrowUp, ArrowDown } from "lucide-react";

interface Comment {
  id: string;
  text: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
}

export default function Comments({ confessionId }: { confessionId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/confessions/${confessionId}/comments`);
      if (!res.ok) throw new Error("Failed to fetch comments");
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [confessionId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/confessions/${confessionId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newComment }),
      });
      if (res.ok) {
        setNewComment("");
        fetchComments();
        setActive(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (commentId: string, type: "upvote" | "downvote") => {
    try {
      const res = await fetch(
        `/api/confessions/${confessionId}/comments/${commentId}/${type}`,
        { method: "POST" }
      );
      if (res.ok) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? {
                  ...c,
                  upvotes: type === "upvote" ? c.upvotes + 1 : c.upvotes,
                  downvotes: type === "downvote" ? c.downvotes + 1 : c.downvotes,
                }
              : c
          )
        );
      }
    } catch (err) {
      console.error("vote error:", err);
    }
  };

  return (
    <motion.div
      className="border-t border-white/10 mt-4 pt-3"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {/* Comments list */}
      <motion.div
        className="max-h-64 overflow-y-auto space-y-2 mb-3 pr-1"
        layout
        transition={{ layout: { duration: 0.4, ease: "easeInOut" } }}
      >
        <AnimatePresence>
          {comments.length > 0 ? (
            comments.map((c) => (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="bg-[#0f0f0f] rounded-lg p-3 text-sm text-gray-200 border border-gray-800"
              >
                <p>{c.text}</p>
                <div className="flex items-center space-x-4 text-gray-400 text-xs mt-2">
                  <button
                    onClick={() => handleVote(c.id, "upvote")}
                    className="flex items-center space-x-1 hover:text-green-400 transition"
                  >
                    <ArrowUp size={14} />
                    <span>{c.upvotes}</span>
                  </button>
                  <button
                    onClick={() => handleVote(c.id, "downvote")}
                    className="flex items-center space-x-1 hover:text-red-400 transition"
                  >
                    <ArrowDown size={14} />
                    <span>{c.downvotes}</span>
                  </button>
                  <span className="ml-auto text-gray-500">
                    {new Date(c.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-500 text-sm"
            >
              No comments yet
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Input section */}
      <motion.div
        layout
        className={`rounded-2xl bg-[#0a0a0a] border border-gray-800 transition-all duration-200 p-3 ${
          active ? "ring-1 ring-blue-600" : ""
        }`}
      >
        <input
          type="text"
          value={newComment}
          onFocus={() => setActive(true)}
          onBlur={() => !newComment && setActive(false)}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full bg-transparent text-white text-sm focus:outline-none placeholder-gray-500"
        />

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-4 text-gray-400 text-xs font-medium">
            <button className="flex items-center space-x-1 hover:text-white transition">
              <Image size={16} />
              <span>GIF</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-white transition">
              <Type size={16} />
              <span>Aa</span>
            </button>
            <button className="flex items-center hover:text-white transition">
              <FileVideo size={16} />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setNewComment("");
                setActive(false);
              }}
              className="px-3 py-1 text-sm rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim() || loading}
              className={`px-3 py-1 text-sm rounded-full font-medium ${
                newComment.trim()
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-600/40 cursor-not-allowed text-white/60"
              }`}
            >
              {loading ? "Posting..." : "Comment"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
