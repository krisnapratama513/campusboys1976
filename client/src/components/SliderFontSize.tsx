import Slider from '@mui/material/Slider';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#ABD1C6',
        },
    },
});

// Fungsi helper yang Anda referensikan di 'getAriaValueText'
function valuetext(value: number) {
    return `${value}`;
}

interface SliderFontSizeProps {
    value: number;
    onChange: (newValue: number) => void;
}

export default function SliderFontSize({ value, onChange }: SliderFontSizeProps) {
    const handleChange = (_event: Event, newValue: number | number[]) => {
        // Pastikan newValue adalah angka (bukan array, jika slidernya range)
        if (typeof newValue === 'number') {
            onChange(newValue); // Panggil fungsi dari parent
        }
    };
    return (
        <ThemeProvider theme={darkTheme}>
            <Slider
                aria-label="Temperature"
                value={value}
                onChange={handleChange}
                getAriaValueText={valuetext}
                valueLabelDisplay="auto"
                shiftStep={1}
                step={1} // Titik-titik
                marks          // Menampilkan titik-titik (marks)
                min={12}
                max={18}
                color="primary"
            />
        </ThemeProvider>
    );
}