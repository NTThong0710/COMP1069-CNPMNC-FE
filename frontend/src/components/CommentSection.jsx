import React, { useState, useEffect } from "react";
import { X, MessageSquare, Heart, Send, Trash2, CornerDownRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const BASE_API_URL = import.meta.env.VITE_API_URL;

// === UTILS ===
const timeAgo = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

// === COMPONENT: Ô NHẬP LIỆU ===
const CommentInput = ({ placeholder, onSubmit, onCancel, autoFocus, initialValue = "" }) => {
  const [val, setVal] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!val.trim()) return;
    onSubmit(val);
    setVal("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative mt-2 animate-in fade-in zoom-in-95 duration-200 w-full">
      <input
        type="text"
        value={val}
        autoFocus={autoFocus}
        onChange={(e) => setVal(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-neutral-800 text-white text-sm rounded-full py-2.5 pl-4 pr-16 focus:outline-none focus:ring-1 focus:ring-white transition-all placeholder-neutral-500"
      />

      <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-neutral-400 hover:text-white px-2 py-1 rounded transition"
          >
            x
          </button>
        )}
        <button
          type="submit"
          disabled={!val.trim()}
          className="p-1.5 bg-green-500 text-black rounded-full hover:scale-105 disabled:opacity-0 transition-all"
        >
          <Send size={12} />
        </button>
      </div>
    </form>
  )
}

// === COMPONENT: 1 DÒNG COMMENT ===
const CommentItem = ({ comment, currentUserId, activeReplyId, setActiveReplyId, onDelete, onLike, onReplySubmit, isChild = false }) => {
  const isLiked = comment.likes?.includes(currentUserId);
  const isReplyingToThis = activeReplyId === comment._id;

  // ✅ FIX: Lấy avatar và tên người dùng
  const userAvatar = comment.user?.avatar;
  const userName = comment.user?.username || "User";

  return (
    <div className="mb-6 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex gap-3 mb-6">

        {/* ✅ FIX: Hiển thị Avatar */}
        <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center overflow-hidden flex-shrink-0 border border-neutral-600">
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={userName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs font-bold text-white uppercase select-none">
              {userName.charAt(0)}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Info Header */}
          <div className="flex justify-between items-start">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-white truncate max-w-[150px]">
                {userName}
              </span>
              <span className="text-[10px] text-neutral-500 whitespace-nowrap">{timeAgo(comment.createdAt)}</span>
            </div>

            {/* Nút Xóa */}
            {comment.user?._id === currentUserId && (
              <button
                onClick={() => onDelete(comment._id)}
                className="text-neutral-600 hover:text-red-500 transition ml-2"
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>

          {/* Content */}
          <p className="text-sm text-neutral-300 mt-0.5 break-words leading-relaxed">{comment.content}</p>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={() => onLike(comment._id)}
              className={`flex items-center gap-1 text-xs transition ${isLiked ? 'text-green-500' : 'text-neutral-500 hover:text-white'}`}
            >
              <Heart size={12} fill={isLiked ? "currentColor" : "none"} />
              <span>{comment.likes?.length || 0}</span>
            </button>

            {/* Chỉ hiện nút Reply nếu KHÔNG PHẢI là comment con */}
            {!isChild && (
              <button
                onClick={() => setActiveReplyId(isReplyingToThis ? null : comment._id)}
                className={`text-xs font-medium transition ${isReplyingToThis ? 'text-green-500' : 'text-neutral-500 hover:text-white'}`}
              >
                Reply
              </button>
            )}
          </div>

          {/* Form Reply Inline */}
          {!isChild && isReplyingToThis && (
            <div className="mt-2">
              <CommentInput
                autoFocus={true}
                placeholder={`Replying to ${userName}...`}
                onSubmit={(content) => onReplySubmit(comment._id, content)}
                onCancel={() => setActiveReplyId(null)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Render Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-4 pl-3 border-l border-neutral-800 mt-2">
          {comment.replies.map(reply => (
            <CommentItem
              key={reply._id}
              comment={reply}
              currentUserId={currentUserId}
              activeReplyId={activeReplyId}
              setActiveReplyId={setActiveReplyId}
              onDelete={onDelete}
              onLike={onLike}
              onReplySubmit={onReplySubmit}
              isChild={true} // Đánh dấu là child
            />
          ))}
        </div>
      )}
    </div>
  );
};

// === MAIN EXPORT ===
export default function CommentSection({ songId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState(null);

  const currentUserId = user?.id || user?._id;

  // 1. Fetch Comments
  const fetchComments = async () => {
    if (!songId) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_API_URL}/songs/${songId}/comments?limit=50`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error("Load comments error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    setActiveReplyId(null);
  }, [songId]);

  // 2. Add New Comment (Top Level)
  const handleAddComment = async (content) => {
    if (!user) return alert("Vui lòng đăng nhập!");
    const token = localStorage.getItem("accessToken");

    try {
      const res = await fetch(`${BASE_API_URL}/songs/${songId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ content })
      });
      if (res.ok) {
        fetchComments(); // Reload để hiện comment mới nhất
      }
    } catch (err) { console.error(err); }
  };

  // 3. Reply Comment
  const handleReplyComment = async (parentId, content) => {
    if (!user) return alert("Vui lòng đăng nhập!");
    const token = localStorage.getItem("accessToken");

    try {
      const res = await fetch(`${BASE_API_URL}/comments/${parentId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ content })
      });

      if (res.ok) {
        setActiveReplyId(null);
        fetchComments(); // Reload list
      }
    } catch (err) { console.error(err); }
  };

  // 4. Delete & Like
  const handleDelete = async (commentId) => {
    if (!window.confirm("Xóa bình luận này?")) return;
    const token = localStorage.getItem("accessToken");
    try {
      const res = await fetch(`${BASE_API_URL}/comments/${commentId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) fetchComments();
    } catch (error) { console.error(error); }
  };

  const handleLike = async (commentId) => {
    if (!user) return alert("Vui lòng đăng nhập!");
    const token = localStorage.getItem("accessToken");
    try {
      await fetch(`${BASE_API_URL}/comments/${commentId}/like`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      fetchComments();
    } catch (error) { console.error(error); }
  };

  return (
    <div className="mt-6 bg-black/20 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4 text-white font-bold border-b border-neutral-700 pb-2">
        <MessageSquare size={18} />
        <span>Comments ({comments.length})</span>
      </div>

      {/* Ô nhập Comment mới (Luôn hiện trên đầu) */}
      <div className="mb-6 pb-4 border-b border-neutral-800">
        <CommentInput
          placeholder={!user ? "Login to comment..." : "Add a comment..."}
          onSubmit={handleAddComment}
        />
      </div>

      {/* Danh sách Comment */}
      <div className="space-y-2">
        {loading ? (
          <p className="text-neutral-500 text-xs text-center">Loading...</p>
        ) : comments.length > 0 ? (
          comments.map(c => (
            <CommentItem
              key={c._id}
              comment={c}
              currentUserId={currentUserId}
              activeReplyId={activeReplyId}
              setActiveReplyId={setActiveReplyId}
              onDelete={handleDelete}
              onLike={handleLike}
              onReplySubmit={handleReplyComment}
              isChild={false} // Comment cha
            />
          ))
        ) : (
          <p className="text-neutral-500 text-xs text-center italic py-2">No comments yet. Be the first!</p>
        )}
      </div>
    </div>
  );
}