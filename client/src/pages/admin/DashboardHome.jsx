import React, { useState, useEffect, useMemo } from "react";
import { Music, Users, Disc, Mic2, TrendingUp, Activity, ArrowRight, UserPlus, Clock, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const BASE_API_URL = import.meta.env.VITE_API_URL;

// === 1. STAT CARD (Giữ nguyên) ===
const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition group">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-zinc-400 group-hover:text-white transition">{title}</h3>
            <div className={`p-2 rounded-full bg-zinc-900 ${color}`}>
                <Icon size={18} />
            </div>
        </div>
        <div className="text-3xl font-bold text-white mb-1">{value.toLocaleString()}</div>
        <p className="text-xs text-zinc-500 flex items-center gap-1">
            {subtext || <><TrendingUp size={12} className="text-green-500" /> <span className="text-green-500">+Live</span> data</>}
        </p>
    </div>
);

// === 2. CHART: MONTHLY USER GROWTH (Giữ nguyên logic hiển thị) ===
const MonthlyGrowthChart = ({ data }) => {
    const maxVal = Math.max(...data) || 1;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return (
        <div className="h-full flex flex-col justify-end">
            <div className="flex items-end justify-between gap-2 h-32 border-b border-zinc-800 pb-2">
                {data.map((count, index) => {
                    const heightPercent = count === 0 ? 2 : (count / maxVal) * 100;
                    return (
                        <div key={index} className="w-full bg-zinc-800 rounded-t-sm hover:bg-green-500 transition-colors duration-300 relative group cursor-help flex flex-col justify-end" style={{ height: `${heightPercent}%` }}>
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-10 shadow-lg">
                                {count} Users
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className="flex justify-between text-[10px] text-zinc-500 mt-2 uppercase font-bold">
                {months.map(m => <span key={m}>{m}</span>)}
            </div>
        </div>
    );
}

// === 3. TABLE: USER ACTIVITY (Nhận danh sách đã lọc) ===
const UserActivityTable = ({ users }) => {
    // Sắp xếp theo thời gian hoạt động gần nhất
    const sortedUsers = [...users].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    return (
        <div className="divide-y divide-zinc-800/50">
            {sortedUsers.length > 0 ? sortedUsers.map(u => (
                <div key={u._id} className="p-3 flex items-center justify-between hover:bg-zinc-900/50 transition">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold text-xs border border-zinc-700 overflow-hidden">
                            {u.avatar ? <img src={u.avatar} className="w-full h-full object-cover" /> : u.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">{u.username}</p>
                            <p className="text-[10px] text-zinc-500">Active on platform</p>
                        </div>
                    </div>
                    <div className="text-xs text-zinc-500 flex items-center gap-1">
                        <Clock size={12} /> {new Date(u.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
            )) : (
                <div className="p-4 text-center text-sm text-zinc-500">No activity found for this date.</div>
            )}
        </div>
    );
}

export default function DashboardHome() {
    const [stats, setStats] = useState({ songs: 0, artists: 0, albums: 0, users: 0 });
    const [recentSongs, setRecentSongs] = useState([]);
    const [recentUsers, setRecentUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]); // Chứa toàn bộ user để lọc
    const [loading, setLoading] = useState(true);

    // ✅ STATES MỚI CHO BỘ LỌC
    const currentYear = new Date().getFullYear();
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [availableYears, setAvailableYears] = useState([currentYear]); // Danh sách năm có dữ liệu
    const [activityDateFilter, setActivityDateFilter] = useState(today); // Ngày lọc activity

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("accessToken");
                const headers = { "Authorization": `Bearer ${token}` };

                const [resSongs, resArtists, resAlbums, resUsers] = await Promise.all([
                    fetch(`${BASE_API_URL}/songs?limit=1`),
                    fetch(`${BASE_API_URL}/artists?limit=1`),
                    fetch(`${BASE_API_URL}/albums?limit=1`),
                    fetch(`${BASE_API_URL}/users?limit=1000&sort=-createdAt`, { headers }) // Lấy nhiều user để tính toán
                ]);

                const dataSongs = await resSongs.json();
                const dataArtists = await resArtists.json();
                const dataAlbums = await resAlbums.json();
                const dataUsers = await resUsers.json();

                const usersList = dataUsers.users || [];
                setAllUsers(usersList);

                // ✅ TẠO DANH SÁCH NĂM TỪ DỮ LIỆU USER
                const years = [...new Set(usersList.map(u => new Date(u.createdAt).getFullYear()))];
                if (years.length > 0) {
                    setAvailableYears(years.sort((a, b) => b - a)); // Sắp xếp năm giảm dần
                }

                setStats({
                    songs: dataSongs.total || 0,
                    artists: dataArtists.total || 0,
                    albums: dataAlbums.total || 0,
                    users: dataUsers.total || 0
                });

                // Recent Songs
                const resNewSongs = await fetch(`${BASE_API_URL}/songs/new-release?limit=5`);
                const dataNewSongs = await resNewSongs.json();
                setRecentSongs(dataNewSongs.songs || []);

                // New Users
                const onlyUsers = usersList.filter(u => u.role !== 'admin').slice(0, 5);
                setRecentUsers(onlyUsers);

            } catch (error) {
                console.error("Dashboard fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // ✅ TÍNH TOÁN DỮ LIỆU BIỂU ĐỒ THEO NĂM ĐÃ CHỌN
    const monthlyUsersData = useMemo(() => {
        const monthlyCounts = new Array(12).fill(0);
        allUsers.forEach(u => {
            const date = new Date(u.createdAt);
            if (date.getFullYear() === parseInt(selectedYear)) {
                monthlyCounts[date.getMonth()] += 1;
            }
        });
        return monthlyCounts;
    }, [allUsers, selectedYear]);

    // ✅ LỌC DANH SÁCH ACTIVITY THEO NGÀY ĐÃ CHỌN
    const filteredActivityUsers = useMemo(() => {
        if (!activityDateFilter) return [];
        const filterDateStr = new Date(activityDateFilter).toDateString();
        return allUsers.filter(u => new Date(u.updatedAt).toDateString() === filterDateStr);
    }, [allUsers, activityDateFilter]);


    return (
        <div className="space-y-6 pb-10">
            <div>
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-zinc-400 text-sm mt-1">Overview of your music platform.</p>
            </div>

            {/* STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Songs" value={stats.songs} icon={Music} color="text-blue-500" />
                <StatCard title="Total Artists" value={stats.artists} icon={Mic2} color="text-purple-500" />
                <StatCard title="Total Albums" value={stats.albums} icon={Disc} color="text-pink-500" />
                <StatCard title="Total Users" value={stats.users} icon={Users} color="text-yellow-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* CỘT 1 (LỚN) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* ✅ CHART SECTION: CÓ DROPDOWN CHỌN NĂM */}
                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                                    <UserPlus size={20} className="text-green-500" /> User Growth
                                </h3>
                                <p className="text-xs text-zinc-500">New registrations per month</p>
                            </div>

                            {/* DROPDOWN NĂM */}
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-zinc-400" />
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    className="bg-zinc-900 border border-zinc-800 text-xs text-white p-1.5 rounded outline-none cursor-pointer hover:border-zinc-600 transition"
                                >
                                    {availableYears.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="h-48">
                            <MonthlyGrowthChart data={monthlyUsersData} />
                        </div>
                    </div>

                    {/* ✅ USER ACTIVITY TABLE: CÓ DATE PICKER */}
                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
                        <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <Activity size={18} className="text-orange-500" /> Daily Activity
                            </h3>

                            {/* INPUT CHỌN NGÀY */}
                            <input
                                type="date"
                                value={activityDateFilter}
                                onChange={(e) => setActivityDateFilter(e.target.value)}
                                className="
                                  bg-zinc-900 
                                  text-zinc-200 
                                  text-sm 
                                  font-medium
                                  border border-zinc-800 
                                  rounded-md 
                                  pl-10 pr-3 py-2 
                                  outline-none 
                                  cursor-pointer
                                  transition-all
                                  
                                  hover:bg-zinc-800 
                                  hover:border-zinc-600
                                  focus:ring-2 focus:ring-white/10 focus:border-zinc-500

                                  
                                  [color-scheme:dark]

                                  /* Icon lịch trắng */
                                  [&::-webkit-calendar-picker-indicator]:cursor-pointer
                                  [&::-webkit-calendar-picker-indicator]:filter 
                                  [&::-webkit-calendar-picker-indicator]:invert
                                  [&::-webkit-calendar-picker-indicator]:opacity-50
                                  [&::-webkit-calendar-picker-indicator]:hover:opacity-100
                              "
                            />
                        </div>
                        {/* Truyền danh sách đã lọc vào bảng */}
                        <UserActivityTable users={filteredActivityUsers} />
                    </div>

                    {/* RECENT SONGS TABLE */}
                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
                        <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
                            <h3 className="font-bold text-white">Recent Uploads</h3>
                            <Link to="/admin/songs" className="text-xs text-zinc-400 hover:text-white flex items-center gap-1">View all <ArrowRight size={12} /></Link>
                        </div>
                        <div className="divide-y divide-zinc-800/50">
                            {recentSongs.map(song => (
                                <div key={song._id} className="p-3 flex items-center gap-4 hover:bg-zinc-900/50 transition">
                                    <div className="w-10 h-10 rounded bg-zinc-800 flex-shrink-0 overflow-hidden">
                                        <img src={song.cover || "https://placehold.co/40"} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate">{song.title}</p>
                                        <p className="text-xs text-zinc-500 truncate">{typeof song.artist === 'object' ? song.artist.name : "Unknown"}</p>
                                    </div>
                                    <div className="text-xs text-zinc-500">
                                        {new Date(song.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                            {recentSongs.length === 0 && <p className="p-4 text-center text-sm text-zinc-500">No songs found.</p>}
                        </div>
                    </div>

                </div>

                {/* CỘT 2 (NHỎ): NEW USERS */}
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl flex flex-col h-fit">
                    <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
                        <h3 className="font-bold text-white">New Registrations</h3>
                        <Link to="/admin/users" className="text-xs text-zinc-400 hover:text-white flex items-center gap-1">View all <ArrowRight size={12} /></Link>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar max-h-[600px] p-2">
                        {recentUsers.map(u => (
                            <div key={u._id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-900 transition group">
                                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden border border-zinc-700">
                                    {u.avatar ? <img src={u.avatar} className="w-full h-full object-cover" /> : u.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate group-hover:text-green-400 transition">{u.username}</p>
                                    <p className="text-xs text-zinc-500 truncate">{u.email}</p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">New</span>
                                </div>
                            </div>
                        ))}
                        {recentUsers.length === 0 && <p className="p-4 text-center text-sm text-zinc-500">No new users.</p>}
                    </div>
                </div>

            </div>
        </div>
    );
}