import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { AlbumsService } from "../api/AlbumsService.js";
import PhotoManager from "../components/PhotoManager.jsx";
import Spinner from "../components/Spinner.jsx";

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
      AlbumsService.list(activeUser.id)
        .then(setAlbums)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [activeUser]);

  const handleSearch = () => {
    if (!searchValue.trim()) return;

    let query = `/albums?userId=${activeUser.id}`;

    if (searchField === "id") {
      query += `&id=${searchValue.trim()}`;
    } else if (searchField === "title") {
      query += `&title_like=${encodeURIComponent(searchValue.trim())}`;
    }

    setLoading(true);
    AlbumsService.search(query)
      .then(setAlbums)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleClear = () => {
    setSearchValue("");
    AlbumsService.list(activeUser.id)
      .then(setAlbums)
      .catch(console.error);
  };

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

      <div style={{ margin: "1em 0" }}>
        <label>Search by: </label>
        <select value={searchField} onChange={(e) => setSearchField(e.target.value)}>
          <option value="id">ID</option>
          <option value="title">Title</option>
        </select>
        <input
          type="text"
          placeholder="Enter search value"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={{ marginLeft: "1em" }}
        />
        <button onClick={handleSearch} style={{ marginLeft: "0.5em" }}>Search</button>
        <button onClick={handleClear} style={{ marginLeft: "0.5em" }}>Clear</button>
      </div>

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