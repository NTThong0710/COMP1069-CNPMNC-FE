import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { socket } from '../../utils/socket';
import { useAuth } from '../../context/AuthContext';
import { useAudioSocket } from '../../hooks/useAudioSocket';
import { Send, Copy, Music, Users, MessageCircle, LogOut, Search } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import SongSearchModal from '../../components/SongSearchModal';

export default function RoomPage() {
  const { roomId } = useParams();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // ✅ Lấy thêm currentSong v isPlaying từ AppLayout
  const { currentSong, isPlaying } = useOutletContext();

  // Custom Hook
  const { joinRoom, leaveRoom } = useAudioSocket();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [usersInRoom, setUsersInRoom] = useState([]);
  const chatEndRef = useRef(null);
  const hasJoinedRef = useRef(false);

  // 1. KẾT NỐI SOCKET & JOIN ROOM
  useEffect(() => {
    if (!user) {
      addToast("Please login to join a room", "warning");
      navigate('/login');
      return;
    }

    // Reset joined flag when roomId changes
    hasJoinedRef.current = false;

    if (!hasJoinedRef.current) {
      const userName = user.username || user.name || user.email?.split('@')[0] || "Guest";
      const userInfo = {
        userId: user._id || user.id,
        name: userName,
        avatar: user.avatar
      };

      // Use Hook to Join
      joinRoom(roomId, userInfo);

      addToast(`Joined room: ${roomId}`, "success");
      hasJoinedRef.current = true;
    }

    const handleReceiveMessage = (data) => setMessages((prev) => [...prev, data]);
    const handleUpdateRoomUsers = (users) => setUsersInRoom(users);

    socket.on("receive_message", handleReceiveMessage);
    socket.on("update_room_users", handleUpdateRoomUsers);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("update_room_users", handleUpdateRoomUsers);
    };
  }, [roomId, user, navigate, addToast, joinRoom]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const userName = user.username || user.name || user.email?.split('@')[0] || "Guest";
    const messageData = {
      roomId,
      user: userName,
      userId: user._id || user.id,
      avatar: user.avatar,
      message: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    socket.emit("send_message", messageData);
    setMessages((prev) => [...prev, messageData]);
    setNewMessage("");
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    addToast("Copied Room ID!", "success");
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 text-white h-auto md:h-[calc(100vh-160px)] w-full max-w-full overflow-hidden">

      {/* --- CỘT TRÁI: INFO & MEMBERS --- */}
      <div className="w-full md:w-[320px] lg:w-[360px] flex-shrink-0 bg-[#121212] rounded-xl p-6 flex flex-col items-center relative border border-neutral-800 h-auto md:h-full md:overflow-hidden">
        {/* Hiệu ứng nền mờ dựa trên ảnh bìa bài hát */}
        <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
          {currentSong ? (
            <div className="absolute inset-0 bg-cover bg-center blur-3xl opacity-20 scale-150 transition-all duration-1000" style={{ backgroundImage: `url(${currentSong.image || currentSong.cover})` }}></div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-green-900/20"></div>
          )}
        </div>

        {/* --- PHẦN HIỂN THỊ BÀI HÁT / ICON --- */}
        <div className="flex flex-col items-center mb-6 z-10 w-full flex-shrink-0 transition-all duration-500">
          {currentSong ? (
            // ✅ CASE 1: ĐANG CÓ NHẠC -> Hiện đĩa than xoay & Tên bài hát
            <>
              <div className={`w-32 h-32 rounded-full overflow-hidden mb-4 shadow-2xl border-4 border-[#121212] ring-2 ring-green-500/50 ${isPlaying ? 'animate-[spin_10s_linear_infinite]' : ''}`}>
                <img
                  src={currentSong.image || currentSong.cover || "https://via.placeholder.com/150"}
                  alt="cover"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center w-full px-2">
                <h2 className="text-xl font-bold text-white truncate animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {currentSong.title}
                </h2>
                <p className="text-sm text-neutral-400 truncate">
                  {currentSong.artist}
                </p>
              </div>
            </>
          ) : (
            // ✅ CASE 2: CHƯA CÓ NHẠC -> Hiện icon & Tên phòng
            <>
              <div className="w-24 h-24 bg-neutral-800 rounded-full flex items-center justify-center mb-4 shadow-xl animate-pulse">
                <Music size={40} className="text-green-500" />
              </div>
              <h1 className="text-2xl font-bold mb-1 text-center break-words w-full">Phòng Nhạc</h1>
              <p className="text-xs text-neutral-500 mb-2">Chưa có bài hát nào</p>
            </>
          )}

          {/* Room ID Badge */}
          <div
            className="flex items-center gap-2 bg-neutral-800/80 backdrop-blur-md px-3 py-1.5 rounded-full cursor-pointer hover:bg-neutral-700 transition active:scale-95 mt-3 border border-white/5"
            onClick={copyRoomId}
          >
            <span className="text-xs font-mono text-green-400 tracking-wider truncate max-w-[150px]">{roomId}</span>
            <Copy size={12} className="text-neutral-400 flex-shrink-0" />
          </div>
        </div>

        {/* Nút chức năng */}
        <div className="flex flex-wrap justify-center gap-3 mb-6 z-10 flex-shrink-0 w-full">
          <button onClick={() => setIsSearchOpen(true)} className="flex items-center justify-center gap-2 bg-green-500 text-black px-4 py-2.5 rounded-full hover:bg-green-400 transition font-bold shadow-lg shadow-green-900/20 text-sm flex-1 min-w-[120px]">
            <Search size={16} /> Thêm nhạc
          </button>
          <button onClick={() => { leaveRoom(); navigate('/'); }} className="flex items-center justify-center gap-2 bg-neutral-800 text-red-400 px-4 py-2.5 rounded-full hover:bg-neutral-700 transition font-bold border border-transparent hover:border-red-900/50 text-sm flex-1 min-w-[120px]">
            <LogOut size={16} /> Rời phòng
          </button>
        </div>

        {/* Danh sách thành viên */}
        <div className="w-full bg-[#1a1a1a]/50 rounded-xl p-4 border border-white/5 flex flex-col z-10 h-64 md:h-auto md:flex-1 overflow-hidden min-h-[200px]">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5 flex-shrink-0">
            <Users size={16} className="text-neutral-400" />
            <span className="text-sm font-bold text-neutral-300">Đang online ({usersInRoom.length})</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {usersInRoom.map((member, idx) => {
              const displayName = member.name || member.username || member.email || "Thành viên ẩn danh";
              const isMe = member.userId === (user._id || user.id);

              return (
                <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition">
                  <div className="relative flex-shrink-0">
                    <img
                      src={member.avatar || "https://via.placeholder.com/40"}
                      alt={displayName}
                      className="w-8 h-8 rounded-full object-cover border border-neutral-600"
                    />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#1a1a1a]"></div>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className={`text-sm font-medium truncate ${isMe ? 'text-green-400' : 'text-white'}`}>
                      {displayName} {isMe && "(Bạn)"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* --- CỘT PHẢI: CHAT --- */}
      <div className="flex-1 w-full bg-[#121212] rounded-xl flex flex-col border border-neutral-800 overflow-hidden h-[500px] md:h-full min-w-0">
        <div className="p-4 border-b border-neutral-800 flex items-center gap-2 bg-neutral-900/50 flex-shrink-0">
          <MessageCircle size={20} className="text-green-500" />
          <h2 className="font-bold">Live Chat</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#121212]">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-neutral-500 text-sm opacity-60">
              <p>Chưa có tin nhắn nào...</p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isMe = msg.userId === (user._id || user.id);
              return (
                <div key={idx} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                  <img src={msg.avatar || "https://via.placeholder.com/40"} alt="avt" className="w-8 h-8 rounded-full object-cover border border-white/10 flex-shrink-0" />
                  <div className={`max-w-[80%] ${isMe ? 'items-end' : 'items-start'} flex flex-col min-w-0`}>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-[11px] font-bold text-neutral-400 truncate max-w-[150px]">{msg.user}</span>
                      <span className="text-[10px] text-neutral-600 flex-shrink-0">{msg.time}</span>
                    </div>
                    <p className={`px-3 py-2 rounded-2xl text-sm break-words ${isMe ? 'bg-green-600 text-white rounded-tr-sm' : 'bg-neutral-800 text-neutral-200 rounded-tl-sm'}`}>
                      {msg.message}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-3 border-t border-neutral-800 bg-neutral-900/30 flex gap-2 flex-shrink-0">
          <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Nói gì đó..." className="flex-1 bg-neutral-800 text-white text-sm px-4 py-2.5 rounded-full outline-none focus:ring-1 focus:ring-green-500 placeholder-neutral-500 transition-all min-w-0" />
          <button type="submit" disabled={!newMessage.trim()} className="bg-green-500 text-black p-2.5 rounded-full hover:bg-green-400 transition disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 flex-shrink-0"><Send size={18} /></button>
        </form>
      </div>

      {isSearchOpen && (
        <SongSearchModal onClose={() => setIsSearchOpen(false)} onSelectSong={(song) => { handleSelectSong(song); setIsSearchOpen(false); }} />
      )}
    </div>
  );
}