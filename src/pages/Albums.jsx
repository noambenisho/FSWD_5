import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { AlbumsService } from "../api/AlbumsService.js";

export default function Albums() {
  const { activeUser } = useAuth();
  const [albums, setAlbums] = useState([]);
  const [photos, setPhotos] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchField, setSearchField] = useState("title");
  const [searchValue, setSearchValue] = useState("");
  const [expandedAlbum, setExpandedAlbum] = useState(null);
  const [photoPage, setPhotoPage] = useState({});

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

  const toggleAlbum = async (albumId) => {
    const currentPage = photoPage[albumId] || 0;
    const nextPage = currentPage + 1;

    const newPhotos = await AlbumsService.getPhotos(albumId, currentPage * 5, 5);
    setPhotos((prev) => ({
      ...prev,
      [albumId]: [...(prev[albumId] || []), ...newPhotos],
    }));
    setPhotoPage((prev) => ({ ...prev, [albumId]: nextPage }));
    setExpandedAlbum(albumId);
  };

  if (loading) return <p>Loading albums...</p>;
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

      <ul>
        {albums.map((album) => (
          <li key={album.id} style={{ marginBottom: "1em" }}>
            ({album.id}) <strong>{album.title}</strong> 
            <button onClick={() => toggleAlbum(album.id)} style={{ marginLeft: "1em" }}>
              {photos[album.id]?.length > 0 ? "Load More" : "View Photos"}
            </button>
            {photos[album.id]?.length > 0 && 
            <button 
              onClick={() => {
                setPhotos((prev) => ({ ...prev, [album.id]: [] }));
                setPhotoPage((prev) => ({ ...prev, [album.id]: 0 }));
                setExpandedAlbum(null);
              }} 
              style={{ marginLeft: "0.5em" }}>
                Hide Photos
            </button>}
            {photos[album.id] && (
              <div style={{ marginTop: "0.5em", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "0.5em" }}>
                {photos[album.id].map((photo) => (
                  <img key={photo.id} src={photo.thumbnailUrl} alt={photo.title} style={{ width: "100%" }} />
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
