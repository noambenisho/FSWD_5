import React, { useEffect, useState } from "react";
import { AlbumsService } from "../api/AlbumsService";
import styles from "./PhotoManager.module.css";

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
    const start = photoPage * 8;
    const newBatch = await AlbumsService.getPhotos(albumId, start, 8);
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
    <div className={styles.manager}>
      <div className={styles.toolbar}>

        <button onClick={toggleVisibility} className={styles.primaryBtn}>
          {isVisible ? "Load More" : "View Photos"}
        </button>

        {isVisible && <button 
        className={styles.secondaryBtn}
        onClick={() => {
          setIsVisible(false)
          setPhotos([]);
          setPhotoPage(0);
        }} >
          Hide Photos
        </button>}
      </div>

      {isVisible && (
        <>
          <form onSubmit={handleAddPhoto} className={styles.addCard}>

            <input 
              value={newPhoto.title} 
              onChange={e => setNewPhoto(p => ({ ...p, title: e.target.value }))} 
              placeholder="Title" required 
              className={styles.input}
            />

            <input 
              className={styles.input}
              value={newPhoto.url} 
              onChange={e => setNewPhoto(p => ({ ...p, url: e.target.value, thumbnailUrl: e.target.value.replace("/600/400", "/150/100") }))} 
              placeholder="Image URL" 
              required 
            />

            <div className={styles.cardActions}>
              <button type="submit" className={styles.primaryBtn}>
                Add Photo
              </button>
            </div>
          </form>

          <div className={styles.photoGrid}>
            {photos.map((photo) => (
              <div key={photo.id} className={styles.photoCard}>
                <img 
                  src={photo.thumbnailUrl} 
                  alt={photo.title} 
                  className={styles.photoImg}
                />
                <button 
                  className={styles.deleteBtn}
                  onClick={() => handleDeletePhoto(photo.id)}>
                    🗑
                  </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}