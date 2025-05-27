import React, { useState } from 'react';
import '../../styles/AddAlbumModal.css';

const AddAlbumModal = ({ isOpen, onClose, onAddAlbum }) => {
    const [title, setTitle] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title.trim()) {
            onAddAlbum(title);
            setTitle('');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Add New Album</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="albumTitle">Album Title</label>
                        <input
                            type="text"
                            id="albumTitle"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter album title"
                            required
                        />
                    </div>
                    <div className="modal-buttons">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-btn">
                            Add Album
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAlbumModal; 