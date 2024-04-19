import React from 'react';

const ImageWithoutRightClick = ({ src, alt, className, title, customMessage }) => {
    const handleContextMenu = (e) => {
    e.preventDefault();
    // alert(customMessage || 'Right-clicking is disabled on this image.');
    };

    return <img
            className={className}
            title={title}
            src={src}
            alt={alt}
            onContextMenu={handleContextMenu} />;
};

export default ImageWithoutRightClick;
