import React, { useState, useEffect, useRef, useCallback } from 'react';
import PhotoItem from './PhotoItem';
import '../styles/PhotosModal.css';

function PhotoFormModal({ isOpen, onClose, onSubmit, initialData }) {
    const [title, setTitle] = useState(initialData?.title || '');
    const [url, setUrl] = useState(initialData?.url || '');
    const [thumbnailUrl, setThumbnailUrl] = useState(initialData?.thumbnailUrl || '');
    useEffect(() => {
        setTitle(initialData?.title || '');
        setUrl(initialData?.url || '');
        setThumbnailUrl(initialData?.thumbnailUrl || '');
    }, [initialData]);
    if (!isOpen) return null;
    return (
        <div className="photoform-modal-overlay" onClick={onClose}>
            <div className="photoform-modal-content" onClick={e => e.stopPropagation()}>
                <h3>{initialData ? 'Edit Photo' : 'Add Photo'}</h3>
                <form onSubmit={e => {e.preventDefault(); onSubmit({ title, url, thumbnailUrl });}}>
                    <div className="form-group">
                        <label htmlFor="photo-title">Title</label>
                        <input id="photo-title" type="text" placeholder="Enter photo title" value={title} onChange={e => setTitle(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="photo-url">Image URL</label>
                        <input id="photo-url" type="url" placeholder="Enter image URL" value={url} onChange={e => setUrl(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="photo-thumbnailUrl">Thumbnail URL</label>
                        <input id="photo-thumbnailUrl" type="url" placeholder="Enter thumbnail URL" value={thumbnailUrl} onChange={e => setThumbnailUrl(e.target.value)} required />
                    </div>
                    <div className="photoform-actions">
                        <button type="submit">Save</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function PhotosModal({ isOpen, onClose, albumId }) {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editPhoto, setEditPhoto] = useState(null);
    const observer = useRef();
    const isLoadingRef = useRef(false);
    const PHOTOS_PER_PAGE = 12;

    const loadPhotos = useCallback(async (pageNum = 1) => {
        if (isLoadingRef.current) return;
        try {
            isLoadingRef.current = true;
            const start = (pageNum - 1) * PHOTOS_PER_PAGE;
            const response = await fetch(`http://localhost:3000/photos?albumId=${albumId}&_start=${start}&_limit=${PHOTOS_PER_PAGE}`);
            const data = await response.json();
            if (pageNum === 1) {
                setPhotos(data);
            } else {
                setPhotos(prev => [...prev, ...data]);
            }
            setHasMore(data.length === PHOTOS_PER_PAGE);
        } catch (error) {
            console.error('Error fetching photos:', error);
        } finally {
            setLoadingMore(false);
            isLoadingRef.current = false;
        }
    }, [albumId]);

    useEffect(() => {
        if (isOpen && albumId) {
            setLoading(true);
            setPage(1);
            setPhotos([]);
            loadPhotos(1).finally(() => setLoading(false));
        }
        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [isOpen, albumId, loadPhotos]);

    const lastPhotoElementRef = useCallback(node => {
        if (loadingMore || isLoadingRef.current) return;
        if (observer.current) {
            observer.current.disconnect();
        }
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !isLoadingRef.current) {
                setLoadingMore(true);
                setPage(prevPage => {
                    const nextPage = prevPage + 1;
                    loadPhotos(nextPage);
                    return nextPage;
                });
            }
        });
        if (node) observer.current.observe(node);
    }, [loadingMore, hasMore, loadPhotos]);

    // Add
    const handleAdd = () => {
        setEditPhoto(null);
        setShowForm(true);
    };
    const handleAddSubmit = async (data) => {
        const newPhoto = { ...data, albumId };
        const res = await fetch('http://localhost:3000/photos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPhoto)
        });
        if (res.ok) {
            setShowForm(false);
            setPage(1);
            loadPhotos(1);
        }
    };
    // Edit
    const handleEdit = (photo) => {
        setEditPhoto(photo);
        setShowForm(true);
    };
    const handleEditSubmit = async (data) => {
        const res = await fetch(`http://localhost:3000/photos/${editPhoto.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            setShowForm(false);
            setEditPhoto(null);
            setPage(1);
            loadPhotos(1);
        }
    };
    // Delete
    const handleDelete = async (photo) => {
        if (window.confirm(`Delete photo: ${photo.title}?`)) {
            await fetch(`http://localhost:3000/photos/${photo.id}`, { method: 'DELETE' });
            setPage(1);
            loadPhotos(1);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="photos-modal-overlay" onClick={onClose}>
            <div className="photos-modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>×</button>
                <h2>Album Photos</h2>
                <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
                    <button className="add-image-btn" onClick={handleAdd}>Add Image</button>
                </div>
                {loading ? (
                    <div className="loading">Loading photos...</div>
                ) : (
                    <div className="photos-grid">
                        {photos.map((photo, index) => (
                            <PhotoItem
                                key={photo.id}
                                photo={photo}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                lastRef={index === photos.length - 1 ? lastPhotoElementRef : null}
                            />
                        ))}
                    </div>
                )}
                {loadingMore && (
                    <div className="loading-more">Loading more photos...</div>
                )}
                <PhotoFormModal
                    isOpen={showForm}
                    onClose={() => { setShowForm(false); setEditPhoto(null); }}
                    onSubmit={editPhoto ? handleEditSubmit : handleAddSubmit}
                    initialData={editPhoto}
                />
            </div>
        </div>
    );
} 