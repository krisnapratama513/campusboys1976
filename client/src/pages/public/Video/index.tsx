// client/src/pages/public/Video/index.tsx

import { useState, useEffect } from 'react';
import styles from './VideoPage.module.css';

// Components & Services
import MediaHeroSection from '../../../components/MediaHeroSection';
import { getPublicVideos } from '../../../services/videoService';
import type { Video } from '../../../types/video.types';

/**
 * Halaman Public: Video Gallery.
 * Menampilkan daftar video YouTube yang statusnya Active.
 * * @component
 */
const VideoPage = () => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPublicVideos()
            .then(data => {
                setVideos(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("[VideoPage] Gagal memuat video:", err);
                setLoading(false);
            });
    }, []);

    // Render Loading
    if (loading) {
        return (
            <div className={styles.container}>
                <MediaHeroSection title="Our Video" />
                <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    <p>Memuat galeri video...</p>
                </div>
            </div>
        );
    }

    // Render Empty State
    if (videos.length === 0) {
        return (
            <div className={styles.container}>
                <MediaHeroSection title="Our Video" />
                <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    <p>Belum ada video yang ditayangkan.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <MediaHeroSection title="Videos" />

            <div className={styles.videoGridContainer}>
                {videos.map(video => (
                    <div className={styles.videoItem} key={video.id}>
                        
                        {/* YouTube Embed */}
                        <iframe
                            id={`Youtubeer-${video.id}`}
                            src={`https://www.youtube.com/embed/${video.youtube_id}`} 
                            title={video.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className={styles.videoWrapper}
                            loading="lazy" // Performance optimization
                        />

                        <h2 className={styles.videoTitle}>{video.title}</h2>

                        {/* Deskripsi */}
                        <div className={styles.description}>
                            {/* Tips: Gunakan style white-space: pre-line di CSS agar enter terbaca */}
                            <div
                                // Tambahkan fallback string kosong (|| '') agar tidak error jika description null
                                dangerouslySetInnerHTML={{ __html: video.description || '' }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VideoPage;