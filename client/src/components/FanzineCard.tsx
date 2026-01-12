// client/src/components/FanzineCard.tsx

import { Link } from 'react-router-dom';
import { FaCircle } from 'react-icons/fa6';
import type { FanzineCardProps } from '../types/fanzine.types';
import { API_BASE_URL } from '../config/api'; // Import Config

/**
 * Komponen Kartu Fanzine.
 * Menampilkan Cover, Judul, Author, dan Tanggal.
 * URL Cover diambil dari Server Uploads.
 */
const FanzineCard = ({
    href,
    imgFilename,
    author,
    date,
    title,
}: FanzineCardProps) => {
    
    // 1. Definisikan Root URL Server (hapus '/api' dari API_BASE_URL)
    const serverRoot = API_BASE_URL.replace('/api', '');
    
    // 2. Susun Path ke folder uploads server
    const imgPath = `${serverRoot}/uploads/fanzines/covers/${imgFilename}`;

    return (
        <Link to={href} style={{ color:'hsl(228, 8%, 70%)', textDecoration:'none'}}>
            <div style={{ backgroundColor: 'hsl(228, 16%, 12%)', padding: '20px', borderRadius: '8px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                
                {/* Wrapper Gambar */}
                <div style={{ width: '100%', aspectRatio: '4 / 5', overflow: 'hidden', borderRadius: '4px', backgroundColor: '#1e293b' }}>
                    <img
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                        src={imgPath}
                        alt={title}
                        loading="lazy"
                        // Fallback jika gambar gagal dimuat
                        onError={(e) => (e.currentTarget.src = 'https://placehold.co/400x500?text=No+Cover')}
                    />
                </div>

                {/* Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '15px 0 0 0', flex: 1 }}>
                    <h2 style={{ color:'hsl(228, 8%, 95%)', fontSize:'clamp(17px, 3vw, 20px)', margin: 0, lineHeight: 1.4 }}>
                        {title}
                    </h2>
                    
                    <footer style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', marginTop: 'auto', fontSize: '0.85rem' }}>
                        <address style={{ fontStyle: 'normal' }}>{author}</address>
                        <span style={{ margin: '0 8px', display: 'flex', alignItems: 'center' }}>
                            <FaCircle size={4} color="#38bdf8" />
                        </span>
                        <time dateTime={date}>{date}</time>
                    </footer>
                </div>
            </div>
        </Link>
    );
};

export default FanzineCard;