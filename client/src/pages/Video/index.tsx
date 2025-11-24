// client/src/Pages/Video/index.tsx

import styles from './VideoPage.module.css';
import { useState, useEffect } from 'react';
import type { ApiVideo } from '../../types/video.types';

const VideoPage = () => {

    const [videos, setVideos] = useState<ApiVideo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                // Pastikan URL API sudah benar
                const response = await fetch('http://localhost:8000/api/videos');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: ApiVideo[] = await response.json();
                setVideos(data);
            } catch (error) {
                console.error("Gagal mengambil data video:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);


    if (loading) {
        return <p>Memuat daftar video...</p>;
    }

    // Tampilkan pesan jika tidak ada data
    if (videos.length === 0) {
        return <p>Tidak ada video yang ditemukan.</p>;
    }

    return (
        <div className={styles.container}>
            <header className={styles.heroSection}>
                <div className={styles.heroContentWrapper}>
                    <h1 className={styles.pageTitle}>Our Video</h1>
                </div>
            </header>

            {/* Kontainer untuk semua video */}
            <div className={styles.videoGridContainer}>
                {/* Looping (Perulangan) data videos */}
                {videos.map(video => ( // Pastikan tidak ada ** di sini
                    // Gunakan ID unik dari video sebagai key
                    <div className={styles.videoItem} key={video.id}>

                        {/* 1. iFrame Video */}
                        <iframe
                            id={`Youtubeer-${video.id}`}
                            src={`https://www.youtube.com/embed/${video.youtube_id}`}
                            // src={`https://www.youtube.com/embed/${video.youtube_id}?enablejsapi=1&controls=0&modestbranding=1&rel=0`}
                            title={video.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className={styles.videoWrapper}
                        ></iframe>

                        {/* 2. Judul Video */}
                        <h2 className={styles.videoTitle}>{video.title}</h2>

                        {/* 3. Deskripsi Video (dengan HTML) */}
                        <div className={styles.description}>
                            <div
                                dangerouslySetInnerHTML={{ __html: video.description }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VideoPage;