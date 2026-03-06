import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Geser layar ke titik 0,0 (Pojok Kiri Atas)
        window.scrollTo(0, 0);
    }, [pathname]); // Dijalankan setiap kali "pathname" (URL) berubah

    return null; // Komponen ini tidak menampilkan visual apa-apa
}