// src/utils/formatDate.ts

/**
 * Mengubah string tanggal UTC menjadi format WIB "DD / MM / YYYY".
 * @param dateString String tanggal (asumsi format ISO/UTC).
 * @returns String tanggal yang diformat.
 */
export const formatWIBDate = (dateString: string): string => {
    // 1. Buat objek Date
    const dateObj = new Date(dateString);

    // 2. Tentukan opsi format untuk WIB (Asia/Jakarta)
    const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Jakarta',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    };

    // 3. Format tanggal menggunakan 'id-ID' (misal: "07/03/2020")
    const formattedDate = dateObj.toLocaleDateString('id-ID', options);
    
    // 4. Sesuaikan format agar memiliki spasi (misal: "07 / 03 / 2020")
    const displayDate = formattedDate.replace(/\//g, ' / ');

    return displayDate;
};