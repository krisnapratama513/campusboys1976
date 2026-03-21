import Box from '@mui/material/Box';
import CircularProgress, { type CircularProgressProps } from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

function CircularProgressWithLabel(props: CircularProgressProps & { value: number }) {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" {...props} />
            <Box
                sx={{
                    top: 0, left: 0, bottom: 0, right: 0,
                    position: 'absolute', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                }}
            >
                {/* Catatan: 'white' bisa dipertahankan jika ini memang overlay gelap yang statis */}
                <Typography variant="caption" component="div" sx={{ color: 'white' }}> 
                    {`${Math.round(props.value)}%`}
                </Typography>
            </Box>
        </Box>
    );
}

// PERBAIKAN: Gunakan Typography dari MUI untuk konsistensi sistem desain
export const ErrorFallback = () => (
    <Typography 
        variant="h6" 
        sx={{ color: "error.main", fontWeight: "bold", p: 5, textAlign: "center" }}
    >
        Gagal memuat PDF.
    </Typography>
);

export const LoadingFallback = ({ progress }: { progress: number }) => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
        <CircularProgressWithLabel value={progress} />
    </Box>
);