// client/src/components/Auth/RoleGuard.tsx

import { Navigate, Outlet } from 'react-router-dom';
import type { UserRole } from '../../config/permissions';

interface RoleGuardProps {
    // UBAH DISINI: Dari string[] menjadi UserRole[]
    // Ini memastikan kita tidak salah ketik role di App.tsx (misal: 'admin' padahal harusnya 'superadmin')
    allowedRoles: UserRole[]; 
}

const RoleGuard = ({ allowedRoles }: RoleGuardProps) => {
    // 1. Ambil Role user dari LocalStorage
    const userBox = localStorage.getItem('userBox');
    let userRole: string = '';

    if (userBox) {
        const user = JSON.parse(userBox);
        userRole = user.role;
    }

    // 2. Cek apakah role user ada di daftar 'allowedRoles'
    // Kita lakukan casting (as UserRole) karena data dari localStorage dianggap string biasa oleh TS
    if (!allowedRoles.includes(userRole as UserRole)) {
        return <Navigate to="/dashboard" replace />;
    }

    // 3. Jika boleh, tampilkan isinya
    return <Outlet />;
};


export default RoleGuard;