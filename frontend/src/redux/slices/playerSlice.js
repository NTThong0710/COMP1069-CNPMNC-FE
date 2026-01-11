import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentSong: null,
    isPlaying: false,
    currentPlaylist: [],
    currentIndex: 0,
    queue: [],
    currentQueueIndex: 0,
    isShuffleActive: false,
    isRepeatActive: false,
};

const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        setSong: (state, action) => {
            // action.payload: { song, playlist, index }
            const { song, playlist, index } = action.payload;
            state.currentSong = song;
            state.isPlaying = true;
            if (playlist) {
                state.currentPlaylist = playlist;
                state.currentIndex = index !== undefined ? index : 0;
            }
        },
        setIsPlaying: (state, action) => {
            state.isPlaying = action.payload;
        },
        togglePlayPause: (state) => {
            if (state.currentSong) {
                state.isPlaying = !state.isPlaying;
            }
        },
        addToQueue: (state, action) => {
            const song = action.payload;
            const isDuplicate = state.queue.some(s => (s.id || s._id) === (song.id || song._id));
            if (!isDuplicate) {
                state.queue.push(song);
            }
        },
        removeFromQueue: (state, action) => {
            state.queue = state.queue.filter((_, i) => i !== action.payload);
        },
        clearQueue: (state) => {
            state.queue = [];
            state.currentQueueIndex = 0;
        },
        setCurrentIndex: (state, action) => {
            state.currentIndex = action.payload;
        },
        setCurrentQueueIndex: (state, action) => {
            state.currentQueueIndex = action.payload;
        },
        toggleShuffle: (state) => {
            state.isShuffleActive = !state.isShuffleActive;
        },
        toggleRepeat: (state) => {
            state.isRepeatActive = !state.isRepeatActive;
        },
        playFromQueue: (state, action) => {
            const index = action.payload;
            if (index >= 0 && index < state.queue.length) {
                state.currentSong = state.queue[index];
                state.currentQueueIndex = index;
                state.isPlaying = true;
            }
        },
        nextSongStandard: () => {
            // Logic next song cơ bản (xử lý logic phức tạp ở thunk hoặc component sau)
            // Đây chỉ update index đơn giản
        }
    },
});

export const {
    setSong, setIsPlaying, togglePlayPause,
    addToQueue, removeFromQueue, clearQueue,
    setCurrentIndex, setCurrentQueueIndex,
    toggleShuffle, toggleRepeat, playFromQueue
} = playerSlice.actions;

export default playerSlice.reducer;
