import { Routes, Route } from 'react-router-dom';

// Pages
import HomePage from './pages/public/Home';
import ArticlePage from './pages/public/Article';
import VideoPage from './pages/public/Video';
import ArticleDetailPage from './pages/public/Article/ArticleDetailPage';
import MagazinePage from './pages/public/Fanzine';
import AboutPage from './pages/public/About';
import PhotoPage from './pages/public/Photo';
import PhotoDetail from './pages/public/PhotoDetail';
import MagazineDetailPage from './pages/public/MagazineDetailPage';
// import Login from './pages/auth/Login';
import Login from './pages/auth/Login';


import Dashboard from './pages/admin/Dashboard';
import FanzineList from './pages/admin/Fanzine/FanzineList';
import CreateFanzine from './pages/admin/Fanzine/CreateFanzine';
import EditFanzine from './pages/admin/Fanzine/EditFanzine';
import ArticleList from './pages/admin/articles/ArticleList';
import CreateArticle from './pages/admin/articles/CreateArticle';
import EditArticle from './pages/admin/articles/EditArticle';
import EditAlbum from './pages/admin/albums/EditAlbum';

// Layouts & Components
import PublicLayout from './layouts/PublicLayout'; // <--- Import Layout baru tadi
import PrivateRoute from './components/PrivateRoute';
import AdminLayout from './layouts/AdminLayout';
import AuthorList from './pages/admin/authors/AuthorList';
import AuthorCreate from './pages/admin/authors/AuthorCreate';
import AuthorEdit from './pages/admin/authors/AuthorEdit';
import AlbumList from './pages/admin/albums/AlbumList';
import CreateAlbum from './pages/admin/albums/CreateAlbum';

function App() {
  return (
    <Routes>

      {/* === KELOMPOK 1: PUBLIC PAGES (Pakai Navbar & Footer) === */}
      {/* Semua route di dalam sini otomatis punya Navbar & Footer */}
      <Route element={<PublicLayout />}>
        <Route path='/' element={<HomePage />} />
        <Route path='/photo' element={<PhotoPage />} />
        <Route path="/photo/:slug" element={<PhotoDetail />} />
        <Route path='/video' element={<VideoPage />} />
        <Route path='/article' element={<ArticlePage />} />
        <Route path="/article/:slug" element={<ArticleDetailPage />} />
        <Route path="/fanzine" element={<MagazinePage />} />
        <Route path="/fanzine/:slug" element={<MagazineDetailPage />} />
        <Route path='/about' element={<AboutPage />} />
      </Route>


      {/* === KELOMPOK 2: LOGIN PAGE (Polos / Tanpa Navbar Footer) === */}
      {/* Saya taruh di luar PublicLayout agar terlihat full screen/fokus login */}
      <Route path='/member' element={<Login />} />


      <Route element={<PrivateRoute />}>
        {/* Bungkus Dashboard dengan AdminLayout */}
        <Route element={<AdminLayout />}>

          {/* Halaman Dashboard Utama */}
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/dashboard/authors" element={<AuthorList />} />
          <Route path="/dashboard/authors/create" element={<AuthorCreate />} />
          <Route path="/dashboard/authors/edit/:id" element={<AuthorEdit />} />

          <Route path='/dashboard/albums' element={<AlbumList />} />
          <Route path='/dashboard/albums/create' element={<CreateAlbum />} />
          <Route path="/dashboard/albums/edit/:id" element={<EditAlbum />} />

          <Route path="/dashboard/fanzines" element={<FanzineList />} />        {/* List */}
          <Route path="/dashboard/fanzines/create" element={<CreateFanzine />} />
          <Route path="/dashboard/fanzines/edit/:id" element={<EditFanzine />} />

          <Route path="/dashboard/articles" element={<ArticleList />} />
          <Route path="/dashboard/articles/create" element={<CreateArticle />} />
          <Route path="/dashboard/articles/edit/:id" element={<EditArticle />} />
          

        </Route>
      </Route>

    </Routes>
  );
}

export default App;