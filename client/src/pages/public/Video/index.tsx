// client/src/Pages/Video/index.tsx

import styles from './VideoPage.module.css';
import { useState, useEffect } from 'react';
import type { ApiVideo } from '../../../types/video.types';
import MediaHeroSection from '../../../components/MediaHeroSection';
import { getAllVideos } from '../../../services/videoService';

const VideoPage = () => {

    const [videos, setVideos] = useState<ApiVideo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllVideos()
            .then(data => {
                setVideos(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false)
            })
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
            <MediaHeroSection title="Our Video" />

            {/* Kontainer untuk semua video */}
            {/* abaikan dibawah ini fokus ke header saja */}
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