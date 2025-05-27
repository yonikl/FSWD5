import React, { useRef } from 'react';
import '../../styles/PhotoItem.css';

export default function PhotoItem({ photo, onEdit, onDelete, lastRef }) {
    const imgRef = useRef(null);

    const handleImgError = (e) => {
        e.target.onerror = null;
        e.target.style.display = 'none';
        if (imgRef.current) {
            imgRef.current.innerHTML = '<div class="image-not-available">Image not available</div>';
        }
    };

    return (
        <div className="photo-item" ref={lastRef}>
            <div ref={imgRef} style={{ width: '100%' }}>
                {photo.thumbnailUrl ? (
                    <img
                        src={photo.thumbnailUrl}
                        alt={photo.title}
                        onError={handleImgError}
                    />
                ) : (
                    <div className="image-not-available">Image not available</div>
                )}
            </div>
            <p>{photo.title}</p>
            <div className="photo-actions">
                <button className="edit-btn" onClick={() => onEdit(photo)}>Edit</button>
                <button className="delete-btn" onClick={() => onDelete(photo)}>Delete</button>
            </div>
        </div>
    );
} 