// client/src/utils/errorHandler.ts

/**
 * Mengambil pesan error yang aman dari berbagai tipe error pada blok catch.
 * @param error Objek error (bisa berupa Error, string, atau tipe *unknown* lainnya).
 * @returns String pesan error yang siap ditampilkan ke UI.
 */
export const getErrorMessage = (error: unknown): string => {
    // 1. Cek apakah error adalah instance dari class Error bawaan JavaScript
    if (error instanceof Error) return error.message;

    // 2. Cek apakah error dilempar dalam bentuk string langsung (throw "pesan")
    if (typeof error === 'string') return error;

    // 3. Fallback/nilai default jika tipe error sama sekali tidak dikenali
    return "Terjadi kesalahan yang tidak diketahui.";
};