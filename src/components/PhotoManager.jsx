import React, { useEffect, useState } from "react";
import { AlbumsService } from "../api/AlbumsService";

export default function PhotoManager({ albumId }) {
  const [photos, setPhotos] = useState([]);
  const [photoPage, setPhotoPage] = useState(0);
  const [newPhoto, setNewPhoto] = useState({ title: '', url: '', thumbnailUrl: '' });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setPhotos([]);
    setPhotoPage(0);
    setIsVisible(false);
  }, [albumId]);

  const loadMorePhotos = async () => {
    const start = photoPage * 5;
    const newBatch = await AlbumsService.getPhotos(albumId, start, 5);
    setPhotos(prev => [...prev, ...newBatch]);
    setPhotoPage(prev => prev + 1);
  };

  const handleAddPhoto = async (e) => {
    e.preventDefault();
    const photo = { ...newPhoto, albumId };
    const saved = await AlbumsService.addPhoto(photo);
    setPhotos(prev => [...prev, saved]);
    setNewPhoto({ title: '', url: '', thumbnailUrl: '' });
  };

  const handleDeletePhoto = async (photoId) => {
    await AlbumsService.removePhoto(photoId);
    setPhotos(prev => prev.filter(p => p.id !== photoId));
  };

  const toggleVisibility = async () => {
    setIsVisible(true);
    loadMorePhotos();
  };

  return (
    <div style={{ marginTop: "1em" }}>
      <button onClick={toggleVisibility} style={{ marginBottom: "1em" }}>
        {isVisible ? "Load More" : "View Photos"}
      </button>
      {isVisible && <button 
      onClick={() => {
        setIsVisible(false)
        setPhotos([]);
        setPhotoPage(0);
      }} 
      style={{ marginLeft: "0.5em" }}>
        Hide Photos
      </button>}

      {isVisible && (
        <>
          <form onSubmit={handleAddPhoto} style={{ marginBottom: "1em" }}>
            <input value={newPhoto.title} onChange={e => setNewPhoto(p => ({ ...p, title: e.target.value }))} placeholder="Title" required />
            <input value={newPhoto.url} onChange={e => setNewPhoto(p => ({ ...p, url: e.target.value }))} placeholder="Image URL" required />
            <input value={newPhoto.thumbnailUrl} onChange={e => setNewPhoto(p => ({ ...p, thumbnailUrl: e.target.value }))} placeholder="Thumbnail URL" required />
            <button type="submit">Add Photo</button>
          </form>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "0.5em" }}>
            {photos.map((photo) => (
              <div key={photo.id} style={{ position: "relative" }}>
                <img src={photo.thumbnailUrl} alt={photo.title} style={{ width: "100%" }} />
                <button onClick={() => handleDeletePhoto(photo.id)} style={{ position: "absolute", top: 0, right: 0, background: "red", color: "white", border: "none", cursor: "pointer" }}>🗑️</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}