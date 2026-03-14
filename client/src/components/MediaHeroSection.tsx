// client/src/components/MediaHeroSection.tsx
import React, { useRef, useState, useEffect } from 'react';

interface MediaHeroSectionProps {
    title: string;
}

const MediaHeroSection: React.FC<MediaHeroSectionProps> = ({ title }) => {
    const containerRef = useRef<HTMLElement>(null);
    const [clipY, setClipY] = useState('70%');

    useEffect(() => {
        const calculateClip = () => {
            const element = containerRef.current;
            if (!element) return;

            const width = element.offsetWidth;
            const height = element.offsetHeight;

            const offsetPx = width * 0.1;
            const newY_px = height - offsetPx;
            const newY_percent = (newY_px / height) * 100;

            setClipY(`${newY_percent.toFixed(2)}%`);
        };

        calculateClip();
        window.addEventListener('resize', calculateClip);
        window.addEventListener('orientationchange', calculateClip);

        return () => {
            window.removeEventListener('resize', calculateClip);
            window.removeEventListener('orientationchange', calculateClip);
        };
    }, []);

    const cssStyles = `
        .mediaHeroSection {
            min-height: 170px;
            height: 40vh;
            margin-bottom: 40px;
            background-color: rgb(15, 25, 35);
            clip-path: polygon(0% 0%, 100% 0%, 100% var(--dynamic-clip-y), 90% 100%, 0% 100%);
            filter: drop-shadow(5px 15px 20px rgba(0, 0, 0, 0.6));
        }

        .heroContentWrapper {
            width: 80%;
            height: 100%;
            padding-bottom: 70px;
            max-width: 1200px;
            margin: auto;
            display: flex;
            flex-direction: column-reverse;
        }

        .heroPageTitle {
            color: white;
            font-family: 'Oswald', sans-serif;
            font-size: 42px;
        }

        @media (max-width: 768px) {
            .mediaHeroSection {
                height: 30vh;
                margin-bottom: 20px;
            }
            .heroContentWrapper {
                padding-bottom: 30px;
            }
            .heroPageTitle {
                font-size: 28px;
            }
        }
    `;

    return (
        <>
            <style>{cssStyles}</style>
            
            <header 
                ref={containerRef} 
                className="mediaHeroSection" 
                style={{ 
                    '--dynamic-clip-y': clipY, 
                } as React.CSSProperties}
            >
                <div className="heroContentWrapper">
                    <h1 className="heroPageTitle">{title}</h1>
                </div>
            </header>
        </>
    );
};

export default MediaHeroSection;