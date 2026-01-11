import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { socket } from "../utils/socket";
import { setSong, setIsPlaying } from "../redux/slices/playerSlice";
import { setActiveRoomId } from "../redux/slices/uiSlice";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

export const useAudioSocket = () => {
    const dispatch = useDispatch();
    const { user } = useAuth();
    const { addToast } = useToast();

    const { currentSong, isPlaying } = useSelector(state => state.player);
    const { activeRoomId } = useSelector(state => state.ui);

    // --- 1. LẮNG NGHE SỰ KIỆN TỪ SERVER ---
    useEffect(() => {
        if (!user) return;

        const handleReceiveAction = (data) => {
            if (data.action === 'play') {
                // Sync song if different
                if (currentSong?.id !== data.song.id && currentSong?._id !== data.song._id) {
                    dispatch(setSong({ song: data.song }));
                }
                dispatch(setIsPlaying(true));
                addToast(`Host playing: ${data.song.title}`, 'info');
            } else if (data.action === 'pause') {
                dispatch(setIsPlaying(false));
            }
        };

        const handleSongChange = (data) => {
            dispatch(setSong({ song: data.song }));
            addToast(`Changed to: ${data.song.title}`, 'info');
        };

        socket.on("receive_action", handleReceiveAction);
        socket.on("receive_song_change", handleSongChange);

        return () => {
            socket.off("receive_action", handleReceiveAction);
            socket.off("receive_song_change", handleSongChange);
        };
    }, [currentSong, user, addToast, dispatch]);

    // --- 2. HÀM HELPER (EMIT EVENTS) ---

    // Tham gia phòng (thường gọi ở RoomPage, nhưng có thể gọi ở đây nếu cần logic chung)
    const joinRoom = useCallback((roomId, userInfo) => {
        dispatch(setActiveRoomId(roomId));

        if (!socket.connected) {
            socket.connect();
        }

        // Emit join event
        socket.emit("join_room", { roomId, userInfo });
    }, [dispatch]);

    // Debug Connection Errors
    useEffect(() => {
        const onConnectError = (err) => {
            console.error("Socket Connection Error:", err);
            addToast(`Socket Error: ${err.message}`, "error");
        };
        socket.on("connect_error", onConnectError);
        return () => socket.off("connect_error", onConnectError);
    }, [addToast]);

    // Rời phòng
    const leaveRoom = useCallback(() => {
        if (activeRoomId) {
            socket.emit("leave_room", activeRoomId);
            dispatch(setActiveRoomId(null));
        }
    }, [activeRoomId, dispatch]);

    // Đồng bộ change song
    const broadcastSongChange = useCallback((song) => {
        if (activeRoomId) {
            console.log(`📡 [SOCKET] Change song -> Room ${activeRoomId}`);
            socket.emit("change_song", { roomId: activeRoomId, song });
        }
    }, [activeRoomId]);

    // Đồng bộ play/pause
    const broadcastPlayPause = useCallback((newStatus, song) => {
        if (activeRoomId) {
            socket.emit("sync_action", {
                roomId: activeRoomId,
                action: newStatus ? 'play' : 'pause',
                song: song
            });
        }
    }, [activeRoomId]);

    return {
        joinRoom,
        leaveRoom,
        broadcastSongChange,
        broadcastPlayPause,
        activeRoomId
    };
};
