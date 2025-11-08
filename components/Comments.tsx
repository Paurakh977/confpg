"use client";
import { useState, useEffect } from "react";

interface Comment {
  id: string;
  text: string;
  createdAt: string;
}

export default function Comments({ confessionId }: { confessionId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

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
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t border-white/10 mt-3 pt-3">
      <div className="max-h-48 overflow-y-auto space-y-2">
        {comments.length > 0 ? (
          comments.map((c) => (
            <div
              key={c.id}
              className="text-gray-300 bg-gray-900 p-2 rounded-md text-sm"
            >
              {c.text}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No comments yet</p>
        )}
      </div>

      <div className="flex mt-3 space-x-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 bg-gray-800 text-white rounded-md px-3 py-1 text-sm focus:outline-none border border-gray-700"
        />
        <button
          onClick={handleAddComment}
          disabled={loading}
          className={`px-3 py-1 rounded-md text-sm font-semibold ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}
