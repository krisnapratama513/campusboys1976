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
import Login from './pages/auth/Login';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import FanzineList from './pages/admin/Fanzine/FanzineList';
import CreateFanzine from './pages/admin/Fanzine/CreateFanzine';
import EditFanzine from './pages/admin/Fanzine/EditFanzine';
import ArticleList from './pages/admin/articles/ArticleList';
import CreateArticle from './pages/admin/articles/CreateArticle';
import EditArticle from './pages/admin/articles/EditArticle';
import EditAlbum from './pages/admin/albums/EditAlbum';
import VideoList from './pages/admin/videos/VideoList';
import CreateVideo from './pages/admin/videos/CreateVideo';
import EditVideo from './pages/admin/videos/EditVideo';
import ChapterList from './pages/admin/chapters/ChapterList';
import CreateChapter from './pages/admin/chapters/CreateChapter';
import EditChapter from './pages/admin/chapters/EditChapter';
import UserList from './pages/admin/users/UserList';
import CreateUser from './pages/admin/users/CreateUser';
import MyProfile from './pages/admin/profile/MyProfile';
import AuthorList from './pages/admin/authors/AuthorList';
import AuthorCreate from './pages/admin/authors/AuthorCreate';
import AuthorEdit from './pages/admin/authors/AuthorEdit';
import AlbumList from './pages/admin/albums/AlbumList';
import CreateAlbum from './pages/admin/albums/CreateAlbum';

// Layouts & Components
import PublicLayout from './layouts/PublicLayout';
import PrivateRoute from './components/PrivateRoute';
import AdminLayout from './layouts/AdminLayout';

// --- SECURITY & PERMISSIONS (BARU) ---
import RoleGuard from './components/Auth/RoleGuard';
import { PERMISSIONS } from './config/permissions';

function App() {
  return (
    <Routes>

      {/* === KELOMPOK 1: PUBLIC PAGES (Semua Orang) === */}
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


      {/* === KELOMPOK 2: LOGIN PAGE === */}
      <Route path='/member' element={<Login />} />


      {/* === KELOMPOK 3: ADMIN AREA (Butuh Login) === */}
      <Route element={<PrivateRoute />}>
        {/* Bungkus Dashboard dengan AdminLayout */}
        <Route element={<AdminLayout />}>

          {/* A. AKSES UMUM (Semua Role: Member, Creative, Editor, Superadmin) */}
          {/* Member biasa hanya bisa akses route di blok ini */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/profile" element={<MyProfile />} />
          <Route path="/dashboard/users" element={<UserList />} /> {/* Read Only List */}


          {/* B. SUPERADMIN ONLY (Manajemen User & Chapter) */}
          <Route element={<RoleGuard allowedRoles={PERMISSIONS.CAN_MANAGE_USERS} />}>
            <Route path="/dashboard/users/create" element={<CreateUser />} />
             {/* Note: User Edit/Delete di-handle di dalam page UserList via tombol */}
          </Route>

          <Route element={<RoleGuard allowedRoles={PERMISSIONS.CAN_MANAGE_CHAPTERS} />}>
            <Route path="/dashboard/chapters" element={<ChapterList />} />
            <Route path="/dashboard/chapters/create" element={<CreateChapter />} />
            <Route path="/dashboard/chapters/edit/:id" element={<EditChapter />} />
          </Route>


          {/* C. EDITORIAL GROUP (Superadmin + Editor) */}
          {/* Mengelola Teks: Authors, Articles, Fanzines */}
          <Route element={<RoleGuard allowedRoles={PERMISSIONS.CAN_MANAGE_EDITORIAL} />}>
            {/* Authors */}
            <Route path="/dashboard/authors" element={<AuthorList />} />
            <Route path="/dashboard/authors/create" element={<AuthorCreate />} />
            <Route path="/dashboard/authors/edit/:id" element={<AuthorEdit />} />

            {/* Articles */}
            <Route path="/dashboard/articles" element={<ArticleList />} />
            <Route path="/dashboard/articles/create" element={<CreateArticle />} />
            <Route path="/dashboard/articles/edit/:id" element={<EditArticle />} />

            {/* Fanzines */}
            <Route path="/dashboard/fanzines" element={<FanzineList />} />
            <Route path="/dashboard/fanzines/create" element={<CreateFanzine />} />
            <Route path="/dashboard/fanzines/edit/:id" element={<EditFanzine />} />
          </Route>


          {/* D. CREATIVE GROUP (Superadmin + Creative) */}
          {/* Mengelola Media: Albums, Videos */}
          <Route element={<RoleGuard allowedRoles={PERMISSIONS.CAN_MANAGE_CREATIVE} />}>
            {/* Albums */}
            <Route path='/dashboard/albums' element={<AlbumList />} />
            <Route path='/dashboard/albums/create' element={<CreateAlbum />} />
            <Route path="/dashboard/albums/edit/:id" element={<EditAlbum />} />

            {/* Videos */}
            <Route path='/dashboard/videos' element={<VideoList />} />
            <Route path='/dashboard/videos/create' element={<CreateVideo />} />
            <Route path='/dashboard/videos/edit/:id' element={<EditVideo />} />
          </Route>

        </Route>
      </Route>

    </Routes>
  );
}

export default App;