import React from 'react';
import { useControls } from 'react-zoom-pan-pinch';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'; // Ikon

interface ZoomProps {
    setViewerStates: (state: any) => void;
    viewerStates: any;
}

const Zoom: React.FC<ZoomProps> = ({ setViewerStates, viewerStates }) => {
    // Hook bawaan library untuk kontrol zoom
    const { zoomIn, zoomOut, resetTransform } = useControls();

    const handleZoomChange = (type: 'in' | 'out' | 'reset') => {
        if (type === 'in') zoomIn();
        if (type === 'out') zoomOut();
        if (type === 'reset') {
            resetTransform();
            // Reset state lokal juga
            setViewerStates((prev: any) => ({ ...prev, zoomScale: 1 }));
        }
    };

    return (
        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/20">
            <button 
                onClick={() => handleZoomChange('out')}
                className="p-1.5 hover:bg-white/20 rounded-full text-white transition-colors"
                title="Zoom Out"
            >
                <ZoomOut size={18} />
            </button>
            
            <button 
                onClick={() => handleZoomChange('reset')}
                className="p-1.5 hover:bg-white/20 rounded-full text-white transition-colors"
                title="Reset Zoom"
            >
                <RotateCcw size={16} />
            </button>

            <button 
                onClick={() => handleZoomChange('in')}
                className="p-1.5 hover:bg-white/20 rounded-full text-white transition-colors"
                title="Zoom In"
            >
                <ZoomIn size={18} />
            </button>
        </div>
    );
};

export default Zoom;