// client/src/hooks/useNavMenu.ts

import { useState } from "react";

const useNavMenu = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMediaOpen, setIsMediaOpen] = useState(false);
    const [isPostOpen, setIsPostOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(prev => {
            if (prev) {
                setIsMediaOpen(false);
                setIsPostOpen(false);
            }
            return !prev;
        });
    };

    const toggleMedia = () => {
        setIsMediaOpen(prev => !prev);
        setIsPostOpen(false);
    };

    const togglePost = () => {
        setIsPostOpen(prev => !prev);
        setIsMediaOpen(false);
    };

    const closeAllMenus = () => {
        setIsMenuOpen(false);
        setIsMediaOpen(false);
        setIsPostOpen(false);
    };

    return {
        isMenuOpen,
        isMediaOpen,
        isPostOpen,
        toggleMenu,
        toggleMedia,
        togglePost,
        closeAllMenus,
    };
};

export default useNavMenu;