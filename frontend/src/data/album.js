// src/data/albums.js

// Danh sách các URL nhạc mẫu để sử dụng
const sampleUrls = [
  '/Nắng Ấm Xa Dần (Remix).mp3',
  '/Nắng Ấm Xa Dần (Remix).mp3',
  'https://cdn.pixabay.com/audio/2022/11/11/audio_a272ab225c.mp3',
  'https://cdn.pixabay.com/audio/2022/05/27/audio_18080d1e67.mp3',
  'https://cdn.pixabay.com/audio/2022/05/27/audio_752a1b2413.mp3',
];

export const albumsData = [
  {
    id: 'ab1', // ID duy nhất, thân thiện với URL
    title: 'm-tp M-TP',
    artist: 'Sơn Tùng M-TP',
    image: '/Album.png',
    tracks: [
      { 
        title: 'Em Của Ngày Hôm Qua', 
        artist: 'Sơn Tùng M-TP', 
        duration: '3:58',
        url: sampleUrls[0],
        image: '/Album.png',
      },
      { 
        title: 'Nắng Ấm Xa Dần', 
        artist: 'Sơn Tùng M-TP', 
        duration: '3:15',
        url: sampleUrls[1],
        image: '/Nắng Ấm Xa Dần (Remix).png',
      },
      { 
        title: 'Cơn Mưa Ngang Qua', 
        artist: 'Sơn Tùng M-TP', 
        duration: '4:25',
        url: sampleUrls[2]
      },
    ]
  },
  {
    id: 'skydecade',
    title: 'SKYDECADE',
    artist: 'Sơn Tùng M-TP',
    image: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=SKYDECADE',
    tracks: [
       { 
        title: 'Lạc Trôi', 
        artist: 'Sơn Tùng M-TP', 
        duration: '4:11',
        url: sampleUrls[3]
      },
      { 
        title: 'Nơi Này Có Anh', 
        artist: 'Sơn Tùng M-TP', 
        duration: '4:20',
        url: sampleUrls[4]
      },
    ]
  },
  {
    id: 'chung-ta',
    title: 'Chúng Ta (EP)',
    artist: 'Sơn Tùng M-TP',
    image: 'https://via.placeholder.com/150/00FF00/000000?text=Chúng+Ta',
    tracks: [
      { 
        title: 'Chúng Ta Của Hiện Tại', 
        artist: 'Sơn Tùng M-TP', 
        duration: '5:02',
        url: sampleUrls[0]
      },
      { 
        title: 'Có Chắc Yêu Là Đây', 
        artist: 'Sơn Tùng M-TP', 
        duration: '3:21',
        url: sampleUrls[1]
      },
      { 
        title: 'Muộn Rồi Mà Sao Còn', 
        artist: 'Sơn Tùng M-TP', 
        duration: '4:35',
        url: sampleUrls[2]
      },
    ]
  },
  {
    id: 'hay-trao-cho-anh',
    title: 'Hãy Trao Cho Anh (Single)',
    artist: 'Sơn Tùng M-TP',
    image: 'https://via.placeholder.com/150/FFFF00/000000?text=Trao',
    tracks: [
      { 
        title: 'Hãy Trao Cho Anh (feat. Snoop Dogg)', 
        artist: 'Sơn Tùng M-TP', 
        duration: '4:05',
        url: sampleUrls[3]
      },
    ]
  },
  {
    id: 'chay-ngay-di',
    title: 'Chạy Ngay Đi (Single)',
    artist: 'Sơn Tùng M-TP',
    image: 'https://via.placeholder.com/150/FFA500/FFFFFF?text=Chạy',
    tracks: [
      { 
        title: 'Chạy Ngay Đi', 
        artist: 'Sơn Tùng M-TP', 
        duration: '4:28',
        url: sampleUrls[4]
      },
      { 
        title: 'Chạy Ngay Đi (Instrumental)', 
        artist: 'Sơn Tùng M-TP', 
        duration: '4:28',
        url: sampleUrls[0]
      },
    ]
  },
  {
    id: 'chung-ta-khong-thuoc-ve-nhau',
    title: 'Chúng Ta Không Thuộc Về Nhau',
    artist: 'Sơn Tùng M-TP',
    image: 'https://via.placeholder.com/150/800080/FFFFFF?text=Thuộc+Về+Nhau',
    tracks: [
      { 
        title: 'Chúng Ta Không Thuộc Về Nhau', 
        artist: 'Sơn Tùng M-TP', 
        duration: '3:53',
        url: sampleUrls[1] 
      },
    ]
  },
  {
    id: 'making-my-way',
    title: 'Making My Way (Single)',
    artist: 'Sơn Tùng M-TP',
    image: 'https://via.placeholder.com/150/008080/FFFFFF?text=Making+My+Way',
    tracks: [
      { 
        title: 'Making My Way', 
        artist: 'Sơn Tùng M-TP', 
        duration: '2:55',
        url: sampleUrls[2] 
      },
    ]
  },
];