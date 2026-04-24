# Music Web - Frontend

🎵 Frontend React Vite application cho Music Web platform.

## 🚀 Features

- ✨ React 19 + Vite (Lightning fast)
- 🎨 Tailwind CSS + CVA
- 🔒 Authentication & Authorization
- 🎵 Music Player with Socket.IO
- 📱 Responsive Design
- 🔄 React Query for data fetching
- 🎭 Redux Toolkit for state management
- 🎼 Music streaming capabilities
- 👤 User profiles & playlists
- 💬 Comments & ratings

## 📋 Prerequisites

- Node.js >= 18.x
- npm >= 9.x

## 🛠️ Installation

```bash
# Clone repository
git clone <repo-url>
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update environment variables
# Edit .env and add your API URL, Cloudinary key, etc.
```

## 🎯 Environment Variables

```env
# API
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000

# External Services
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id

# App Config
VITE_APP_NAME=Music Web
VITE_APP_VERSION=1.0.0
VITE_MAX_UPLOAD_SIZE=52428800
```

## 📚 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── ui/             # UI components (buttons, modals, etc)
│   └── ...
├── pages/              # Page components
│   ├── client/         # User-facing pages
│   ├── admin/          # Admin pages
│   └── ...
├── hooks/              # Custom React hooks
├── services/           # API services
├── config/             # Configuration files
├── constants/          # Constants & enums
├── context/            # React context providers
├── redux/              # Redux store & slices
├── utils/              # Utility functions
├── lib/                # Library functions
├── styles/             # Global styles
├── App.jsx             # Main App component
└── main.jsx            # Entry point
```

## 🚀 Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format

# Type checking
npm run type-check
```

## 🔗 API Integration

All API requests are handled through `src/services/api.js`:

```javascript
import {
  authAPI,
  songAPI,
  albumAPI,
  playlistAPI,
  // ... other APIs
} from '@/services/api';

// Usage
const response = await songAPI.getAllSongs({ page: 1, limit: 20 });
```

## 🎣 Custom Hooks

```javascript
// Songs
import { useSongs, useSongById, useUploadSong } from '@/hooks/useSongs';

// Auth
import { useLogin, useSignup, useLogout } from '@/hooks/useAuth';

// Albums
import { useAlbums, useAlbumById } from '@/hooks/useAlbums';

// Playlists
import { usePlaylists, usePlaylistById } from '@/hooks/usePlaylists';
```

## 🎨 Components

Các components chính:

- `Header` - Navigation header
- `Sidebar` - Navigation sidebar
- `PlayerBar` - Music player
- `SongCard` - Song display card
- `AlbumCard` - Album display card
- `PlaylistCard` - Playlist display card
- `CommentSection` - Comments area
- `ToastNotification` - Toast notifications

## 🔐 Authentication

```javascript
import { useLogin } from '@/hooks/useAuth';

function LoginPage() {
  const { mutate: login, isPending } = useLogin();

  const handleSubmit = (email, password) => {
    login({ email, password });
  };

  return (
    // Form JSX
  );
}
```

## 📦 Key Dependencies

- `react@19.1.1` - UI library
- `react-router-dom@7.9.3` - Routing
- `@tanstack/react-query@5.90.12` - Server state
- `@reduxjs/toolkit@2.11.2` - Client state
- `tailwindcss@4.1.14` - Styling
- `socket.io-client@4.8.1` - Real-time communication
- `axios` - HTTP client
- `swiper@12.0.2` - Carousel
- `lucide-react@0.545.0` - Icons

## 🚨 Troubleshooting

### Build errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port already in use

```bash
# Change port in vite.config.js
# Or kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### API connection issues

- Check if backend is running on `http://localhost:5000`
- Verify `VITE_API_URL` in `.env`
- Check CORS settings on backend

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 📞 Support

For support, email support@musicweb.com or open an issue on GitHub.

---

Made with ❤️ by Music Web Team
