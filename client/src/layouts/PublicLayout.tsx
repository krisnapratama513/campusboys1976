import { Outlet } from 'react-router-dom';
import Navbar from '../components/NavBar/NavBar';
import Footer from '../components/Footer/Footer';

const PublicLayout = () => {
    return (
        <>
            <Navbar />
            {/* Outlet adalah tempat halaman anak (Home, Article, dll) dirender */}
            <Outlet /> 
            <Footer />
        </>
    );
};

export default PublicLayout;