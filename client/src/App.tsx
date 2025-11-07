// client/src/App.tsx

import { useState, useEffect } from 'react';

// 1. Definisikan 'type' untuk data Chapter kita
// Ini agar TypeScript tahu bentuk datanya
type Chapter = {
  id_chapter: number;
  nama_chapter: string;
  deskripsi: string;
  img: string;
};

function App() {
  // 2. Buat 'state' untuk menyimpan data chapters
  const [chapters, setChapters] = useState<Chapter[]>([]);
  // Buat state untuk loading
  const [loading, setLoading] = useState(true);

  // 3. Gunakan 'useEffect' untuk fetch data saat komponen dimuat
  useEffect(() => {
    // Fungsi untuk mengambil data
    const fetchChapters = async () => {
      try {
        // 4. Panggil API server kita!
        const response = await fetch('http://localhost:8000/api/chapters');
        const data: Chapter[] = await response.json();
        
        setChapters(data); // Simpan data ke state
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false); // Selesai loading (baik sukses atau gagal)
      }
    };

    fetchChapters(); // Jalankan fungsi fetch
  }, []); // [] = "Hanya jalankan satu kali saat load"

  // 5. Tampilkan data (atau pesan loading)
  if (loading) {
    return <div>Loading data...</div>;
  }

  return (
    <div>
      <h1>Daftar Chapter</h1>
      <ul>
        {chapters.map((chapter) => (
          <li key={chapter.id_chapter}>
            {chapter.nama_chapter}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;