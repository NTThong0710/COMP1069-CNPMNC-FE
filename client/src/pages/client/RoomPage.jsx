import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { socket } from '../../utils/socket';
import { useAuth } from '../../context/AuthContext';
import { Send, Copy, Music, Users, MessageCircle, LogOut, Search } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import SongSearchModal from '../../components/SongSearchModal';

export default function RoomPage() {
  const { roomId } = useParams();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const { handleLeaveRoom, handleSelectSong } = useOutletContext();
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [usersInRoom, setUsersInRoom] = useState([]); // ✅ State lưu danh sách user
  const chatEndRef = useRef(null);
  const hasJoinedRef = useRef(false);

  // 1. KẾT NỐI SOCKET
  useEffect(() => {
    if (!user) {
      addToast("Please login to join a room", "warning");
      navigate('/login');
      return;
    }

    if (!socket.connected) socket.connect();

    // ✅ Gửi kèm thông tin User khi Join
    if (!hasJoinedRef.current) {
        const userInfo = {
            userId: user._id || user.id,
            name: user.username || user.name || user.email?.split('@')[0],
            avatar: user.avatar
        };
        socket.emit("join_room", { roomId, userInfo }); // Gửi Object
        addToast(`Joined room: ${roomId}`, "success");
        hasJoinedRef.current = true;
    }

    // Listeners
    const handleReceiveMessage = (data) => setMessages((prev) => [...prev, data]);
    
    // ✅ Listener: Cập nhật danh sách người online
    const handleUpdateRoomUsers = (users) => {
        setUsersInRoom(users);
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("update_room_users", handleUpdateRoomUsers); // Bắt sự kiện mới

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("update_room_users", handleUpdateRoomUsers);
    };
  }, [roomId, user, navigate, addToast]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Gửi tin nhắn
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
    <div className="h-[calc(100vh-160px)] flex flex-col md:flex-row gap-4 p-4 text-white">
      
      {/* --- CỘT TRÁI: INFO & MEMBERS --- */}
      <div className="flex-1 bg-[#121212] rounded-xl p-6 flex flex-col items-center relative border border-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-green-900/20 pointer-events-none" />
        
        {/* Info Phòng */}
        <div className="flex flex-col items-center mb-6 z-10 w-full">
            <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mb-4 shadow-xl animate-pulse">
                <Music size={32} className="text-green-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Phòng Nhạc</h1>
            <div 
            className="flex items-center gap-2 bg-neutral-800 px-4 py-2 rounded-full cursor-pointer hover:bg-neutral-700 transition active:scale-95"
            onClick={copyRoomId}
            >
            <span className="text-sm font-mono text-green-400 tracking-wider">{roomId}</span>
            <Copy size={14} className="text-neutral-400" />
            </div>
        </div>

        {/* Nút chức năng */}
        <div className="flex gap-3 mb-8 z-10">
            <button onClick={() => setIsSearchOpen(true)} className="flex items-center gap-2 bg-green-500 text-black px-5 py-2.5 rounded-full hover:bg-green-400 transition font-bold shadow-lg shadow-green-900/20 text-sm">
              <Search size={16} /> Thêm nhạc
            </button>
            <button onClick={handleLeaveRoom} className="flex items-center gap-2 bg-neutral-800 text-red-400 px-5 py-2.5 rounded-full hover:bg-neutral-700 transition font-bold border border-transparent hover:border-red-900/50 text-sm">
              <LogOut size={16} /> Rời phòng
            </button>
        </div>

        {/* ✅ DANH SÁCH THÀNH VIÊN (MEMBERS LIST) */}
        {/* ✅ DANH SÁCH THÀNH VIÊN (MEMBERS LIST) */}
<div className="w-full bg-[#1a1a1a]/50 rounded-xl p-4 border border-white/5 flex-1 overflow-hidden flex flex-col z-10">
    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
        <Users size={16} className="text-neutral-400"/>
        <span className="text-sm font-bold text-neutral-300">Đang online ({usersInRoom.length})</span>
    </div>
    
    <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {usersInRoom.map((member, idx) => {
            // 👇 LOGIC FIX HIỂN THỊ TÊN 👇
            const displayName = member.name || member.username || member.email || "Thành viên ẩn danh";
            const isMe = member.userId === (user._id || user.id);

            return (
                <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition">
                    <div className="relative">
                        <img 
                            src={member.avatar || "https://via.placeholder.com/40"} 
                            alt={displayName} 
                            className="w-8 h-8 rounded-full object-cover border border-neutral-600"
                        />
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#1a1a1a]"></div>
                    </div>
                    <div className="flex flex-col">
                        <span className={`text-sm font-medium ${isMe ? 'text-green-400' : 'text-white'}`}>
                            {displayName} {isMe && "(Bạn)"}
                        </span>
                    </div>
                </div>
            );
        })}
    </div>
</div>

      </div>

      {/* --- CỘT PHẢI: CHAT (Giữ nguyên) --- */}
      <div className="w-full md:w-[400px] bg-[#121212] rounded-xl flex flex-col border border-neutral-800 overflow-hidden">
        <div className="p-4 border-b border-neutral-800 flex items-center gap-2 bg-neutral-900/50">
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
                  <img src={msg.avatar || "https://via.placeholder.com/40"} alt="avt" className="w-8 h-8 rounded-full object-cover border border-white/10" />
                  <div className={`max-w-[80%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-[11px] font-bold text-neutral-400">{msg.user}</span>
                      <span className="text-[10px] text-neutral-600">{msg.time}</span>
                    </div>
                    <p className={`px-3 py-2 rounded-2xl text-sm ${isMe ? 'bg-green-600 text-white rounded-tr-sm' : 'bg-neutral-800 text-neutral-200 rounded-tl-sm'}`}>
                      {msg.message}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-3 border-t border-neutral-800 bg-neutral-900/30 flex gap-2">
          <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Nói gì đó..." className="flex-1 bg-neutral-800 text-white text-sm px-4 py-2.5 rounded-full outline-none focus:ring-1 focus:ring-green-500 placeholder-neutral-500 transition-all" />
          <button type="submit" disabled={!newMessage.trim()} className="bg-green-500 text-black p-2.5 rounded-full hover:bg-green-400 transition disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"><Send size={18} /></button>
        </form>
      </div>

      {isSearchOpen && (
        <SongSearchModal onClose={() => setIsSearchOpen(false)} onSelectSong={(song) => { handleSelectSong(song); setIsSearchOpen(false); }} />
      )}
    </div>
  );
}