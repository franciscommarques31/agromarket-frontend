import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header"; // Header privado
import { AiOutlineHeart } from "react-icons/ai";
import "../css/Favorites.css";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const token = localStorage.getItem("token"); // ler token diretamente

  useEffect(() => {
    fetchFavorites();
  }, [token]);

  const fetchFavorites = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(res.data);
    } catch (error) {
      console.error("Erro ao buscar os favoritos:", error);
    }
  };

  const handleToggleFavorite = async (productId) => {
    if (!token) return;
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/users/favorites/${productId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchFavorites(); // atualizar a lista
    } catch (error) {
      console.error("Erro ao atualizar os favoritos:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div>
      <Header isLoggedIn={!!token} /> {/* passar estado de login */}
      <div className="favpage-container">
        <h1>Os Meus Favoritos</h1>

        {favorites.length === 0 ? (
          <p>Não tens favoritos ainda.</p>
        ) : (
          <div className="favpage-grid">
            {favorites.map((product) => (
              <div key={product._id} className="favpage-card">
                {product.estado && (
                  <span className={`favpage-tag ${product.estado}`}>
                    {product.estado}
                  </span>
                )}
                <img
                  src={product.imagens?.[0] || "/assets/placeholder.jpg"}
                  alt={product.produto}
                />
                <button
                  className="favpage-btn"
                  onClick={() => handleToggleFavorite(product._id)}
                >
                  <AiOutlineHeart size={20} />
                </button>
                <div className="favpage-info">
                  <div className="favpage-top">
                    <h3>{product.produto}</h3>
                    <div className="favpage-brand-model">
                      <p className="favpage-brand">{product.marca}</p>
                      {product.modelo && (
                        <p className="favpage-model">{product.modelo}</p>
                      )}
                    </div>
                  </div>
                  <div className="favpage-bottom">
                    <span className="favpage-price">
                      €{product.preco.toLocaleString()}
                    </span>
                    <span className="favpage-location">{product.distrito}</span>
                    <span className="favpage-date">
                      {formatDate(product.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
