import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    // Cek apakah token ada di penyimpanan browser
    const token = localStorage.getItem('accessToken');

    // Jika ada token -> Izinkan masuk (render halaman anak/Outlet)
    // Jika tidak -> Tendang balik ke halaman login (/member)
    return token ? <Outlet /> : <Navigate to="/member" replace />;
};

export default PrivateRoute;