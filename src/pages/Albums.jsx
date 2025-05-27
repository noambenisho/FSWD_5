import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { AlbumsService } from "../api/AlbumsService.js";
import PhotoManager from "./PhotoManager.jsx";
import Spinner from "../components/Spinner.jsx";
import SearchBar from "../components/SearchBar.jsx";

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
    <div style={{ maxWidth: "700px", margin: "auto", padding: "1em" }}>
      <h2>{activeUser.username}'s Albums</h2>

      <label>Search by: </label>
      <select value={searchField} onChange={(e) => setSearchField(e.target.value)}>
        <option value="id">ID</option>
        <option value="title">Title</option>
      </select>
      <SearchBar
        value={searchValue}
        onChange={setSearchValue}
      />

      <button onClick={() => setShowAlbumForm(true)}>Add Album</button>
      {showAlbumForm && (
        <form onSubmit={handleAddAlbum}>
          <input
            value={newAlbumTitle}
            onChange={(e) => setNewAlbumTitle(e.target.value)}
            placeholder="Album Title"
            required
          />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setShowAlbumForm(false)}>Cancel</button>
        </form>
      )}

      <ul>
        {albums.map((album) => (
          <li key={album.id} style={{ marginBottom: "2em" }}>
            ({album.id}) <strong>{album.title}</strong>
            {<PhotoManager albumId={album.id} />}
          </li>
        ))}
      </ul>
    </div>
  );
}