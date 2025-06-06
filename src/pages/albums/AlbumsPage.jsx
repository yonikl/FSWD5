import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import AddAlbumModal from './AddAlbumModal';
import PhotosModal from './PhotosModal';
import '../../styles/AlbumsPage.css';
import Navbar from "../../components/Navbar";

export default function AlbumsPage() {
    const [user, setUser] = useState(null);
    const { userId } = useParams();
    const navigate = useNavigate();
    const [albums, setAlbums] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchField, setSearchField] = useState('title');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPhotosModalOpen, setIsPhotosModalOpen] = useState(false);
    const [selectedAlbumId, setSelectedAlbumId] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem("activeUser");
        if (!stored) {
            navigate("/login");
        } else {
            const parsed = JSON.parse(stored);
            setUser(parsed);
            fetch(`http://localhost:3000/albums?userId=${userId}`)
                .then((res) => res.json())
                .then(setAlbums);
        }
    }, [navigate, userId]);

    const filteredAlbums = albums.filter(album => {
        if (searchField === 'title') {
            return album.title.toLowerCase().includes(searchQuery.toLowerCase());
        } else if (searchField === 'id') {
            return album.id.toString().includes(searchQuery);
        }
        return true;
    });

    

    const handleAddAlbum = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmitAlbum = (title) => {
        const newAlbum = {
            userId: parseInt(userId),
            title: title
        };

        // Make POST request to add album to server
        fetch('http://localhost:3000/albums', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newAlbum),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add album');
            }
            return response.json();
        })
        .then(createdAlbum => {
            // Add to local state with the server response
            setAlbums([...albums, createdAlbum]);
        })
        .catch(error => {
            console.error('Error adding album:', error);
            alert('Failed to add album. Please try again.');
        });
    };

    const handleAlbumClick = (albumId) => {
        setSelectedAlbumId(albumId);
        setIsPhotosModalOpen(true);
    };

    const handleClosePhotosModal = () => {
        setIsPhotosModalOpen(false);
        setSelectedAlbumId(null);
    };

    return (
        <>
            {user && (<Navbar user={user} onLogout={() => {
            localStorage.removeItem("activeUser");
            navigate("/login");
            }}
            onHome={() => navigate("/home")}
            />)}
            <div className="albums-container">
                <div className="albums-header">
                    <h1>Albums</h1>
                    <div className="albums-controls">
                        <select 
                            value={searchField}
                            onChange={(e) => setSearchField(e.target.value)}
                            className="search-select"
                        >
                            <option value="title">Search by Title</option>
                            <option value="id">Search by ID</option>
                        </select>
                        <input
                            type="text"
                            placeholder={`Search by ${searchField}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        <button onClick={handleAddAlbum} className="add-album-btn">
                            Add Album
                        </button>
                    </div>
                </div>
                <div className="albums-grid">
                    {filteredAlbums.map((album) => (
                        <div 
                            key={album.id} 
                            className="album-card"
                            onClick={() => handleAlbumClick(album.id)}
                        >
                            <h2>{album.title}</h2>
                            <p>Album ID: {album.id}</p>
                        </div>
                    ))}
                </div>
                <AddAlbumModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onAddAlbum={handleSubmitAlbum}
                />
                <PhotosModal
                    isOpen={isPhotosModalOpen}
                    onClose={handleClosePhotosModal}
                    albumId={selectedAlbumId}
                />
            </div>
        </>
    );
}

