// src/data/artists.js
export const artistsData = {
  "son-tung-mtp": {
    // ✅ SỬA LẠI ID Ở ĐÂY
    id: "son-tung-mtp", 
    name: "Sơn Tùng M-TP",
    avatar: "/son-tung-mtp.png",
    bio: "Sơn Tùng M-TP là một ca sĩ, nhạc sĩ và diễn viên nổi tiếng tại Việt Nam. Anh được biết đến với phong cách âm nhạc độc đáo và khả năng tạo ra các bản hit lớn.",
    monthlyListeners: "2,158,321",
    topSongs: [
      { id: 'st1', title: 'Nắng Ấm Xa Dần', artist: 'Sơn Tùng M-TP', image: '/Nắng Ấm Xa Dần (Remix).png', url: '/Nắng Ấm Xa Dần (Remix).mp3', duration: '3:15' },
    ],
    albums: [
      { id: 'ab1', image: '/Album.png', title: 'm-tp M-TP', artist: 'Sơn Tùng M-TP' },
    ]
  },
  // Nếu có nghệ sĩ khác, bạn cũng làm tương tự
  // "taylor-swift": {
  //   id: "taylor-swift",
  //   name: "Taylor Swift",
  //   ...
  // }
};