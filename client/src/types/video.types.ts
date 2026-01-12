// client/src/types/video.types.ts

/**
 * ==============================================================================
 * VIDEO TYPES
 * ==============================================================================
 */

export type Video = {
    id: number;
    title: string;
    /** ID Unik YouTube (11 Karakter) */
    youtube_id: string; 
    /** 1 = Aktif, 0 = Draft/Hidden */
    is_active: number; 
    description: string;
};