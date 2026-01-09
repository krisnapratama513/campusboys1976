// client/src/Pages/Video/index.tsx

import styles from './VideoPage.module.css'; // Nama file CSS tetap sesuai punya Anda
import { useState, useEffect } from 'react';

// 1. Update Import Tipe (Gunakan 'Video' bukan 'ApiVideo')
import type { Video } from '../../../types/video.types';
import MediaHeroSection from '../../../components/MediaHeroSection';

// 2. Update Import Service (Gunakan 'getPublicVideos')
import { getPublicVideos } from '../../../services/videoService';

const VideoPage = () => {

    // 3. Update State Type
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 4. Panggil Service Public (Backend otomatis filter is_active = 1)
        getPublicVideos()
            .then(data => {
                setVideos(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Gagal memuat video:", err);
                setLoading(false);
            });
    }, []);

    // Loading State (Dengan Hero Section agar layout tidak loncat)
    if (loading) {
        return (
            <div className={styles.container}>
                <MediaHeroSection title="Our Video" />
                <p style={{textAlign: 'center', marginTop: '2rem'}}>Memuat daftar video...</p>
            </div>
        );
    }

    // Empty State
    if (videos.length === 0) {
        return (
            <div className={styles.container}>
                <MediaHeroSection title="Our Video" />
                <p style={{textAlign: 'center', marginTop: '2rem'}}>Tidak ada video yang ditemukan.</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <MediaHeroSection title="Our Video" />

            {/* Kontainer untuk semua video */}
            <div className={styles.videoGridContainer}>
                {videos.map(video => (
                    <div className={styles.videoItem} key={video.id}>

                        {/* 1. iFrame Video */}
                        <iframe
                            id={`Youtubeer-${video.id}`}
                            // Menggunakan field 'youtube_id' dari database
                            src={`https://www.youtube.com/embed/${video.youtube_id}`} 
                            title={video.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className={styles.videoWrapper}
                        ></iframe>

                        {/* 2. Judul Video */}
                        <h2 className={styles.videoTitle}>{video.title}</h2>

                        {/* 3. Deskripsi Video */}
                        <div className={styles.description}>
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