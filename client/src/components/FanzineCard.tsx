// client/src/components/FanzineCard.tsx

// import { Link } from "react-router-dom";
import { FaCircle } from 'react-icons/fa6';
import type { FanzineCardProps } from '../types/fanzine.types';
import {  Link } from 'react-router-dom';

const FanzineCard = ({
    href,
    imgFilename,
    author,
    date,
    title,
    // width
}: FanzineCardProps) => {
    const imgPath = `magazine/cover/${imgFilename}`;
    return (
        <Link to={href} style={{ color:'hsl(228, 8%, 70%)', textDecoration:'none'}}>
            <div style={{ backgroundColor: 'hsl(228, 16%, 12%)', padding: '20px'}}>
                <div style={{ width: '100%', aspectRatio: '4 / 5' }}>
                    <img
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        src={imgPath}
                        alt=""
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '10px 0' }}>
                    <h2 style={{color:'hsl(228, 8%, 95%)', fontSize:'clamp(17px, 3vw, 22px)'}}>{title}</h2>
                    <footer style={{ display: 'flex', flexWrap: 'wrap' }}>
                        <address>{author}</address>
                        <span style={{ margin: '0 10px' }}><FaCircle size={8} color="blue" /></span>
                        <time dateTime={date}>{date}</time>
                    </footer>
                </div>
            </div>
        </Link>
    );
};

export default FanzineCard;