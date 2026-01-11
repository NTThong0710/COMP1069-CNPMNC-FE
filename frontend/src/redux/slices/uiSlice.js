import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isSidebarCollapsed: false,
    isRightSidebarVisible: false,
    isRoomModalOpen: false,
    activeRoomId: localStorage.getItem("activeRoomId") || null,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.isSidebarCollapsed = !state.isSidebarCollapsed;
        },
        setRightSidebarVisible: (state, action) => {
            state.isRightSidebarVisible = action.payload;
        },
        setRoomModalOpen: (state, action) => {
            state.isRoomModalOpen = action.payload;
        },
        setActiveRoomId: (state, action) => {
            state.activeRoomId = action.payload;
            if (action.payload) {
                localStorage.setItem("activeRoomId", action.payload);
            } else {
                localStorage.removeItem("activeRoomId");
            }
        }
    },
});

export const { toggleSidebar, setRightSidebarVisible, setRoomModalOpen, setActiveRoomId } = uiSlice.actions;
export default uiSlice.reducer;
