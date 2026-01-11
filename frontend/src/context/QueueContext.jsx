import { createContext, useContext, useState } from "react";

const QueueContext = createContext();

export const QueueProvider = ({ children }) => {
  const [queue, setQueue] = useState([]); // Danh sách bài hát chờ phát
  const [currentQueueIndex, setCurrentQueueIndex] = useState(0);

  /**
   * Thêm 1 bài hát vào cuối queue
   * Return: { success: boolean, message: string }
   */
  const addToQueue = (song) => {
    // Check xem bài hát đã có trong queue hay chưa
    const isDuplicate = queue.some(
      (queueSong) => (queueSong.id || queueSong._id) === (song.id || song._id)
    );
    
    if (isDuplicate) {
      return { success: false, message: "Song already in queue" };
    }
    
    setQueue((prev) => [...prev, song]);
    return { success: true, message: "Added to queue" };
  };

  /**
   * Thêm nhiều bài hát vào cuối queue
   */
  const addMultipleToQueue = (songs) => {
    setQueue((prev) => [...prev, ...songs]);
  };

  /**
   * Xóa bài hát khỏi queue bằng index
   */
  const removeFromQueue = (index) => {
    setQueue((prev) => prev.filter((_, i) => i !== index));
  };

  /**
   * Xóa toàn bộ queue
   */
  const clearQueue = () => {
    setQueue([]);
    setCurrentQueueIndex(0);
  };

  /**
   * Lấy bài hát tiếp theo từ queue
   */
  const getNextSongFromQueue = () => {
    if (queue.length === 0) return null;
    const nextIndex = currentQueueIndex + 1;
    if (nextIndex < queue.length) {
      setCurrentQueueIndex(nextIndex);
      return queue[nextIndex];
    }
    return null;
  };

  /**
   * Lấy bài hát trước từ queue
   */
  const getPrevSongFromQueue = () => {
    if (queue.length === 0) return null;
    const prevIndex = currentQueueIndex - 1;
    if (prevIndex >= 0) {
      setCurrentQueueIndex(prevIndex);
      return queue[prevIndex];
    }
    return null;
  };

  /**
   * Phát bài hát trong queue
   */
  const playFromQueue = (index) => {
    if (index >= 0 && index < queue.length) {
      setCurrentQueueIndex(index);
      return queue[index];
    }
    return null;
  };

  /**
   * Lấy vị trí hiện tại trong queue
   */
  const getCurrentQueueIndex = () => currentQueueIndex;

  /**
   * Lấy toàn bộ queue
   */
  const getQueueList = () => [...queue];

  /**
   * Lấy số lượng bài hát trong queue
   */
  const getQueueCount = () => queue.length;

  const value = {
    queue,
    currentQueueIndex,
    addToQueue,
    addMultipleToQueue,
    removeFromQueue,
    clearQueue,
    getNextSongFromQueue,
    getPrevSongFromQueue,
    playFromQueue,
    getCurrentQueueIndex,
    getQueueList,
    getQueueCount,
  };

  return (
    <QueueContext.Provider value={value}>
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error("useQueue phải được sử dụng bên trong QueueProvider");
  }
  return context;
};
