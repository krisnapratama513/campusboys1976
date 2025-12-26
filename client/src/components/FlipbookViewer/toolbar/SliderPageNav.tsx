import React from 'react';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Maximize, Minimize, Download } from 'lucide-react'; 

const darkTheme = createTheme({
    palette: {
        mode: 'dark', 
        primary: { main: '#ABD1C6' },
        text: { primary: '#ffffff' }
    },
    components: {
        MuiSlider: {
            styleOverrides: {
                root: { padding: '13px 0 !important' }, 
                mark: { backgroundColor: '#bfbfbf', width: '4px', height: '4px', borderRadius: '50%' },
                markActive: { backgroundColor: '#fff', opacity: 1 }
            }
        }
    }
});

interface SliderPageNavProps {
    totalPages: number;
    currentPage: number; 
    onPageChange: (pageIndex: number) => void;
    onToggleFullscreen: () => void;
    isFullscreen: boolean;
    onDownload: () => void;
}

export default function SliderPageNav({ 
    totalPages, 
    currentPage, 
    onPageChange,
    onToggleFullscreen,
    isFullscreen,
    onDownload
}: SliderPageNavProps) {
    
    const displayPage = currentPage + 1;

    const handleChange = (_event: Event, newValue: number | number[]) => {
        if (typeof newValue === 'number') {
            onPageChange(newValue - 1);
        }
    };

    const getPageLabel = () => {
        const whiteStyle = { color: '#ffffff', fontWeight: 'bold' };
        const grayStyle = { color: '#a0a0a0', fontWeight: 'normal', margin: '0 4px' };
        
        if (currentPage === 0) return <span style={whiteStyle}>1 <span style={grayStyle}>/</span> {totalPages}</span>;

        const leftPage = currentPage + 1;
        const rightPage = leftPage + 1;
        if (rightPage > totalPages) return <span style={whiteStyle}>{leftPage} <span style={grayStyle}>/</span> {totalPages}</span>;

        return <span style={whiteStyle}>{leftPage}-{rightPage} <span style={grayStyle}>/</span> {totalPages}</span>;
    };

    // Style tombol manual agar tidak tertimpa default browser
    const buttonStyle = {
        background: 'transparent',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '50%',
        padding: '8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        transition: 'background 0.2s',
        minWidth: '36px', // Paksa ukuran minimal
        minHeight: '36px',
    };

    return (
        <ThemeProvider theme={darkTheme}>
            {/* CONTAINER UTAMA */}
            <div 
                className="bg-black/80 backdrop-blur-md shadow-2xl"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    padding: '12px 20px', // Padding kiri kanan lega
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    pointerEvents: 'auto'
                }}
            >
                
                {/* BARIS 1: SLIDER */}
                <div style={{ width: '100%', padding: '0 4px' }}>
                    <Slider
                        aria-label="Navigasi Halaman"
                        value={displayPage}
                        onChange={handleChange}
                        step={1}
                        marks={true}
                        min={1}
                        max={totalPages}
                        color="primary"
                        size="medium"
                        sx={{
                            height: 4,
                            '& .MuiSlider-thumb': {
                                height: 16, width: 16, backgroundColor: '#fff',
                                '&:before': { display: 'none' }
                            },
                        }}
                    />
                </div>

                {/* BARIS 2: FOOTER (Teks Kiri, Tombol Kanan) */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    width: '100%', 
                    marginTop: '8px' 
                }}>
                    
                    {/* POJOK KIRI: Teks Halaman */}
                    <div style={{ flexShrink: 0 }}>
                        <Typography variant="body2" sx={{ color: 'white !important', fontSize: '0.9rem', letterSpacing: '0.5px' }}>
                            {getPageLabel()}
                        </Typography>
                    </div>

                    {/* POJOK KANAN: Tombol Aksi (Paksa Row) */}
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center' }}>
                        
                        {/* Tombol Download */}
                        <button 
                            onClick={onDownload} 
                            style={buttonStyle}
                            title="Download PDF"
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <Download size={18} />
                        </button>

                        {/* Tombol Fullscreen */}
                        <button 
                            onClick={onToggleFullscreen} 
                            style={buttonStyle}
                            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                        </button>
                    </div>
                </div>

            </div>
        </ThemeProvider>
    );
}