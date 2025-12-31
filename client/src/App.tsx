import { Routes, Route } from 'react-router-dom';

// Pages
import HomePage from './pages/Home';
import ArticlePage from './pages/Article';
import VideoPage from './pages/Video';
import ArticleDetailPage from './pages/Article/ArticleDetailPage';
import MagazinePage from './pages/Magazine';
import AboutPage from './pages/About';
import PhotoPage from './pages/Photo';
import PhotoDetail from './pages/PhotoDetail';
import MagazineDetailPage from './pages/MagazineDetailPage';
import MemberPage from './pages/Member';
import Dashboard from './pages/Dashboard';

// Layouts & Components
import PublicLayout from './layouts/PublicLayout'; // <--- Import Layout baru tadi
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Routes>
      
      {/* === KELOMPOK 1: PUBLIC PAGES (Pakai Navbar & Footer) === */}
      {/* Semua route di dalam sini otomatis punya Navbar & Footer */}
      <Route element={<PublicLayout />}>
          <Route path='/' element={<HomePage />} />
          <Route path='/photo' element={<PhotoPage />} />
          <Route path="/photo/:id" element={<PhotoDetail />} />
          <Route path='/video' element={<VideoPage />} />
          <Route path='/article' element={<ArticlePage />} />
          <Route path="/article/:slug" element={<ArticleDetailPage />} />
          <Route path="/magazine" element={<MagazinePage />} />
          <Route path="/magazine/:slug" element={<MagazineDetailPage />} />
          <Route path='/about' element={<AboutPage />} />
      </Route>


      {/* === KELOMPOK 2: LOGIN PAGE (Polos / Tanpa Navbar Footer) === */}
      {/* Saya taruh di luar PublicLayout agar terlihat full screen/fokus login */}
      <Route path='/member' element={<MemberPage />} />


      {/* === KELOMPOK 3: DASHBOARD ADMIN (Tanpa Navbar Footer Public) === */}
      <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
      </Route>

    </Routes>
  );
}

export default App;