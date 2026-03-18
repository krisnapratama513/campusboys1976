import { useParams, Link } from 'react-router-dom'; 
import FlipbookViewer from '@/components/FlipbookViewer';
import { SERVER_ROOT } from '@/config/api'; 
import styles from './FanzinDetailPage.module.css';
import { useFanzineBySlug } from '@/hooks/useFanzineBySlug';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
    });
};

const FanzinDetailPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const { fanzine, isLoading } = useFanzineBySlug(slug);

    if (isLoading) return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '100vh', // Mengambil seluruh tinggi layar
            gap: 2 
        }}>
            <CircularProgress size={50} />
            <span style={{ color: '#94a3b8' }}>Memuat Fanzine...</span>
        </Box>
    );

    if (!fanzine) return (
        <div className={styles.pageWrapper}>
            <div style={{ textAlign: 'center', color: '#ef4444', padding: '5rem 0' }}>
                <h2 style={{fontSize: '2rem'}}>404</h2>
                <p>Fanzine tidak ditemukan atau telah dihapus.</p>
                <Link to="/fanzine" style={{ color: '#38bdf8', marginTop: '1rem', display: 'inline-block' }}>Kembali ke Galeri</Link>
            </div>
        </div>
    );

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.contentContainer}>
                <div className={styles.header}>
                    <h1 className={styles.title}>{fanzine.title}</h1>
                    <p className={styles.meta}>
                        Diterbitkan {formatDate(fanzine.date)} | Oleh <strong>{fanzine.author_name}</strong>
                    </p>
                </div>
                <div className={styles.flipbookWrapper}>
                    <FlipbookViewer 
                        pdfUrl={`${SERVER_ROOT}/uploads/fanzines/${fanzine.pdfFilename}`}
                        className="shadow-2xl" 
                    />
                </div>
            </div>
        </div>
    );
};

export default FanzinDetailPage;