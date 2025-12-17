import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { socket } from '../../utils/socket'; // Import socket singleton
import { useAuth } from '../../context/AuthContext';
import { Send, Copy, Music, Users, MessageCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function RoomPage() {
  const { roomId } = useParams();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [usersInRoom, setUsersInRoom] = useState([]); // Danh sách user (nếu BE hỗ trợ)
  const chatEndRef = useRef(null);

  // 1. KẾT NỐI SOCKET KHI VÀO PHÒNG
  useEffect(() => {
    if (!user) {
      addToast("Please login to join a room", "warning");
      navigate('/login');
      return;
    }

    // Connect socket
    if (!socket.connected) socket.connect();

    // Join room
    socket.emit("join_room", roomId);
    addToast(`Joined room: ${roomId}`, "success");

    // Lắng nghe tin nhắn
    const handleReceiveMessage = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    // Lắng nghe người mới vào (Optional)
    const handleUserJoined = (userId) => {
      addToast(`User ${userId} joined the room`, "info");
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("user_joined", handleUserJoined);

    // Cleanup
    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("user_joined", handleUserJoined);
      // socket.disconnect(); // Tùy chọn: Có thể không ngắt để giữ kết nối nền
    };
  }, [roomId, user, navigate, addToast]);

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 2. GỬI TIN NHẮN
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      roomId,
      user: user.name || "Unknown",
      userId: user._id || user.id, // Dùng để xác định tin nhắn của mình
      avatar: user.avatar,
      message: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Gửi lên server
    socket.emit("send_message", messageData);
    
    // Cập nhật UI ngay lập tức (cho mình thấy)
    setMessages((prev) => [...prev, messageData]);
    setNewMessage("");
  };

  // Copy Room ID
  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    addToast("Room ID copied to clipboard!", "success");
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col md:flex-row gap-4 p-4 text-white">
      
      {/* --- CỘT TRÁI: THÔNG TIN PHÒNG & VISUAL --- */}
      <div className="flex-1 bg-[#181818] rounded-xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
        {/* Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-green-900/20 pointer-events-none" />
        
        <div className="z-10 animate-pulse">
          <div className="w-32 h-32 bg-neutral-800 rounded-full flex items-center justify-center mb-6 shadow-2xl border-4 border-neutral-700">
            <Music size={48} className="text-green-500" />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-2 z-10">Listening Party</h1>
        <div 
          className="flex items-center gap-2 bg-neutral-800 px-4 py-2 rounded-full cursor-pointer hover:bg-neutral-700 transition z-10"
          onClick={copyRoomId}
        >
          <span className="text-sm font-mono text-green-400">ID: {roomId}</span>
          <Copy size={14} className="text-neutral-400" />
        </div>

        <div className="mt-8 flex items-center gap-2 text-neutral-400 text-sm z-10">
          <Users size={16} />
          <span>Invite friends to sync music!</span>
        </div>
      </div>

      {/* --- CỘT PHẢI: CHAT --- */}
      <div className="w-full md:w-[400px] bg-[#181818] rounded-xl flex flex-col border border-neutral-800">
        
        {/* Chat Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center gap-2">
          <MessageCircle size={20} className="text-green-500" />
          <h2 className="font-bold">Live Chat</h2>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <p className="text-center text-neutral-500 text-sm mt-10">Start the conversation...</p>
          ) : (
            messages.map((msg, idx) => {
              const isMe = msg.userId === (user._id || user.id);
              return (
                <div key={idx} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                  <img 
                    src={msg.avatar || "https://via.placeholder.com/40"} 
                    alt="avt" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className={`max-w-[80%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-xs font-bold text-neutral-300">{msg.user}</span>
                      <span className="text-[10px] text-neutral-500">{msg.time}</span>
                    </div>
                    <p className={`px-3 py-2 rounded-xl text-sm ${isMe ? 'bg-green-600 text-white rounded-tr-none' : 'bg-neutral-700 text-neutral-200 rounded-tl-none'}`}>
                      {msg.message}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-neutral-800 flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-neutral-800 text-white text-sm px-4 py-2 rounded-full outline-none focus:ring-1 focus:ring-green-500 placeholder-neutral-500"
          />
          <button 
            type="submit" 
            disabled={!newMessage.trim()}
            className="bg-green-500 text-black p-2 rounded-full hover:bg-green-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}