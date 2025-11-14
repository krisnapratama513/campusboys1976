// client/src/App.tsx

import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import Navbar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';
import ArticlePage from './pages/Article';
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/article' element={<ArticlePage />} />

      </Routes>
      <Footer />
    </>
  );
}

export default App;