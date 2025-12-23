import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Users, Play } from 'lucide-react';

const CreateRoomModal = ({ onClose }) => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');

  // Hàm tạo mã phòng ngẫu nhiên (ví dụ: ROOM-1234)
  const handleCreateNew = () => {
    const randomId = 'ROOM-' + Math.floor(1000 + Math.random() * 9000);
    navigate(`/room/${randomId}`);
    onClose();
  };

  const handleJoin = () => {
    if (roomId.trim()) {
      navigate(`/room/${roomId}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#1e1e1e] w-full max-w-md rounded-2xl p-6 shadow-2xl border border-neutral-700 relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-600/20 text-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Listen Together</h2>
          <p className="text-neutral-400 text-sm">
            Stream music in real-time with friends. Create a room or join an existing one.
          </p>
        </div>

        <div className="space-y-4">
          {/* Option 1: Join Existing */}
          <div>
            <label className="text-xs font-bold text-neutral-500 uppercase mb-2 block">Join Existing Room</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter Room ID"
                className="flex-1 bg-[#2a2a2a] text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500 border border-transparent placeholder-neutral-500"
              />
              <button 
                onClick={handleJoin}
                disabled={!roomId.trim()}
                className="bg-green-500 text-black font-bold px-6 py-3 rounded-lg hover:bg-green-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Join
              </button>
            </div>
          </div>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-700"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#1e1e1e] px-2 text-xs text-neutral-500 uppercase">Or</span>
            </div>
          </div>

          {/* Option 2: Create New */}
          <button 
            onClick={handleCreateNew}
            className="w-full bg-[#2a2a2a] hover:bg-[#333] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition group border border-neutral-700 hover:border-purple-500"
          >
            <Play size={20} className="text-purple-500 group-hover:scale-110 transition" fill="currentColor" />
            Create New Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoomModal;