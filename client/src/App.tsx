// client/src/App.tsx

import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import Navbar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';
import ArticlePage from './pages/Article';
import VideoPage from './pages/Video';
import ArticleDetailPage from './pages/Article/ArticleDetailPage';
import MagazinePage from './pages/Magazine';

import MagazineDetailPage from './pages/MagazineDetailPage';
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/video' element={<VideoPage />} />
        <Route path='/article' element={<ArticlePage />} />
        <Route path="/article/:slug" element={<ArticleDetailPage />} />
        <Route path="/magazine" element={<MagazinePage />} />
        <Route path="/magazine/:slug" element={<MagazineDetailPage />} />


      </Routes>
      <Footer />
    </>
  );
}

export default App;