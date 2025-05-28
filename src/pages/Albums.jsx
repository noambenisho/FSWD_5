import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { AlbumsService } from "../api/AlbumsService.js";
import PhotoManager from "./PhotoManager.jsx";
import Spinner from "../components/Spinner.jsx";
import styles from './Albums.module.css';

export default function Albums() {
  const { activeUser } = useAuth();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchField, setSearchField] = useState("title");
  const [searchValue, setSearchValue] = useState("");
  const [showAlbumForm, setShowAlbumForm] = useState(false);
  const [newAlbumTitle, setNewAlbumTitle] = useState("");

  useEffect(() => {
    if (activeUser) {
          let query = `?userId=${activeUser.id}`;
    
          if (searchField === "id") {
            query += `&id=${searchValue.trim()}`;
          } else if (searchField === "title") {
            query += `&title_like=${encodeURIComponent(searchValue.trim())}`;
          }          
          const fn = searchValue
            ? AlbumsService.search(query)
            : AlbumsService.list(activeUser.id);
          setLoading(true);
          fn
            .then((data) => {
              setAlbums(data);
              setLoading(false);
            })
            .finally(() => setLoading(false));
        } else {
          setLoading(false);
        }
  }, [activeUser?.id, searchValue]);

  const handleAddAlbum = (e) => {
    e.preventDefault();
    const album = { title: newAlbumTitle, userId: activeUser.id };
    AlbumsService.add(album)
      .then((saved) => setAlbums((prev) => [...prev, saved]))
      .catch(console.error);
    setNewAlbumTitle("");
    setShowAlbumForm(false);
  };

  if (loading) return <Spinner />;
  if (!activeUser) return <p>No user logged in</p>;

  return (
    <main className={styles.container}>

      <section className={styles.hero}>
        <h2>{activeUser.username}&apos;s Albums</h2>

        <div className={styles.toolbar}>
          
          <select
            className={styles.control}
            value={searchField} 
            onChange={(e) => setSearchField(e.target.value)}
          >
            <option value="id">ID</option>
            <option value="title">Title</option>
          </select>

          <input
            type="text"
            className={styles.searchInput}
            placeholder={`Search by ${searchField}...`}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          
          <button className={styles.primaryBtn} onClick={handleSearch}>Search</button>
          <button className={styles.controlBtn} onClick={handleClear}>Clear</button>
        </div>

        <button className={styles.addBtn} onClick={() => setShowAlbumForm((prev ) => !prev)}>Add Album</button>

        {showAlbumForm && (
          <form onSubmit={handleAddAlbum} className={styles.addCard}>
            <input
              value={newAlbumTitle}
              className={styles.input}
              onChange={(e) => setNewAlbumTitle(e.target.value)}
              placeholder="Album Title"
              required
            />
            <div className={styles.cardActions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => {
                  setShowAlbumForm(false);
                  setNewAlbumTitle('');
                }}
              >
                Cancel
              </button>
              <button type="submit" className={styles.primaryBtn}>
                Save
              </button>
            </div>
          </form>
        )}

        <ul className={styles.grid}>
          {albums.map((album) => (
            <li key={album.id} className={styles.card}>

              <div className={styles.header}>
                <span>
                  ({album.id}) {album.title}
                </span>
              </div>

              {<PhotoManager albumId={album.id} />}
            </li>
          ))}
        </ul>
      </section>
    </main >
  );
}