import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AiOutlineHeart, AiOutlineMail } from "react-icons/ai";
import HeaderPublic from "../components/HeaderPublic";
import axios from "axios";
import "../css/Home.css";
import "../css/Intro.css";
import "../css/MessageModal.css";
import { AuthContext } from "../context/AuthContext";
import MessageModal from "../components/MessageModal";

export default function Home() {
  const { user, token } = useContext(AuthContext);
  const [showIntro, setShowIntro] = useState(false);

  const [filters, setFilters] = useState({
    setor: "",
    produto: "",
    marca: "",
    distrito: "",
    empresa: "",
    estado: "",
    precoMin: "",
    precoMax: "",
  });

  const [products, setProducts] = useState([]);
  const [news, setNews] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("introShown");
    if (!alreadyShown) {
      setShowIntro(true);
      sessionStorage.setItem("introShown", "true");
    }
    fetchProducts();
    fetchNews();
  }, []);

  const fetchProducts = async (params = {}) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/products/search`,
        { params }
      );
      setProducts(res.data.slice(0, 12));
    } catch (error) {
      console.error("Erro ao buscar os produtos:", error);
    }
  };

  const fetchNews = async () => {
    try {
      const rssUrl = encodeURIComponent("https://agroportal.pt/?feed=rss2");
      const res = await axios.get(
        `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`
      );

      const items = res.data.items.slice(0, 5).map((item) => {
        // Extrair a primeira imagem do conteúdo HTML
        const imgMatch = item.content.match(/<img.*?src="(.*?)"/);
        const image = imgMatch ? imgMatch[1] : null;

        return {
          title: item.title,
          url: item.link,
          image: image,
          published: item.pubDate,
        };
      });

      setNews(items);
    } catch (error) {
      console.error("Erro ao buscar notícias via RSS JSON:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(filters);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const handleFavorite = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user)
      return alert(
        "É necessário ter login feito para adicionar o produto como favorito!"
      );
    if (product.user?._id === user.id) {
      return alert("Não pode colocar como favorito o seu próprio produto!");
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/products/${product._id}/favorite`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Produto adicionado/removido dos favoritos!");
    } catch (err) {
      console.error(err);
      alert("Erro ao adicionar produto como favorito");
    }
  };

  const handleOpenModal = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user)
      return alert("É necessário ter login feito para enviar mensagem!");
    if (product.user?._id === user.id) {
      return alert("Não pode enviar mensagem para o seu próprio anúncio.");
    }
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setModalOpen(false);
  };

  const handleEnter = () => setShowIntro(false);

  return (
    <div>
      <HeaderPublic />

      {showIntro && (
        <div className="intro-overlay">
          <div className="intro-container">
            <iframe
              className="intro-video"
              src="https://www.youtube.com/embed/Lt6Dtq9fj2U?autoplay=1&mute=1&controls=1&modestbranding=1"
              title="Vídeo de Abertura"
              frameBorder="0"
              allow="autoplay; fullscreen"
              allowFullScreen
            ></iframe>
            <button onClick={handleEnter} className="enter-btn">
              Entrar no site
            </button>
          </div>
        </div>
      )}

      <div className={`home-container ${showIntro ? "blurred" : ""}`}>
        <div className="home-content-wrapper">
          {/* Coluna principal */}
          <div className="main-content">
            <section className="home-description">
              <h1>Bem-vindo ao AgroMarket</h1>
              <p>
                Encontre ou venda máquinas e equipamentos agrícolas, de
                construção, florestal e muito mais.
              </p>
            </section>

            <section className="home-filters">
              <form onSubmit={handleSearch} className="filters-form">
                <select
                  name="setor"
                  value={filters.setor}
                  onChange={handleChange}
                >
                  <option value="">Setor</option>
                  <option value="Agrícola">Agrícola</option>
                  <option value="Construção">Construção</option>
                  <option value="Florestal">Florestal</option>
                  <option value="Jardinagem">Jardinagem</option>
                  <option value="Transporte">Transporte</option>
                </select>
                <input
                  type="text"
                  name="produto"
                  placeholder="Produto"
                  value={filters.produto}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="marca"
                  placeholder="Marca"
                  value={filters.marca}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="distrito"
                  placeholder="Distrito"
                  value={filters.distrito}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="empresa"
                  placeholder="Empresa"
                  value={filters.empresa}
                  onChange={handleChange}
                />
                <select
                  name="estado"
                  value={filters.estado}
                  onChange={handleChange}
                >
                  <option value="">Estado</option>
                  <option value="novo">Novo</option>
                  <option value="usado">Usado</option>
                </select>
                <input
                  type="number"
                  name="precoMin"
                  placeholder="Preço Mínimo"
                  value={filters.precoMin}
                  onChange={handleChange}
                />
                <input
                  type="number"
                  name="precoMax"
                  placeholder="Preço Máximo"
                  value={filters.precoMax}
                  onChange={handleChange}
                />
                <button type="submit">Pesquisar</button>
              </form>
            </section>

            <section className="products-grid">
              {products.length === 0 && <p>Nenhum produto encontrado</p>}
              {products.map((product) => (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  className="product-card"
                >
                  {product.estado && (
                    <span className={`estado-tag ${product.estado}`}>
                      {product.estado}
                    </span>
                  )}
                  <img
                    src={product.imagens?.[0] || "/assets/placeholder.jpg"}
                    alt={product.produto}
                  />
                  <div className="product-card-buttons">
                    <button
                      className="favorite-btn"
                      onClick={(e) => handleFavorite(e, product)}
                    >
                      <AiOutlineHeart size={20} />
                    </button>
                    {user && (
                      <button
                        className="message-btn"
                        onClick={(e) => handleOpenModal(e, product)}
                      >
                        <AiOutlineMail size={20} />
                      </button>
                    )}
                  </div>
                  <div className="product-info">
                    <div className="product-top">
                      <h3>{product.produto}</h3>
                      <div className="marca-modelo">
                        <p className="marca">{product.marca}</p>
                        {product.modelo && (
                          <p className="modelo">{product.modelo}</p>
                        )}
                      </div>
                    </div>
                    <div className="product-bottom">
                      <div className="bottom-left">
                        <span className="preco">
                          €{product.preco.toLocaleString()}
                        </span>
                      </div>
                      <div className="bottom-right">
                        <span className="localidade">{product.distrito}</span>
                        <span className="data-tag">
                          {formatDate(product.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </section>
          </div>

          {/* Sidebar de notícias com imagens */}
          <div className="news-sidebar">
            <h3>Mini Notícias</h3>
            {news.length === 0 && <p>Nenhuma notícia disponível</p>}
            {news.map((item, idx) => (
              <div className="news-item" key={idx}>
                <div className="news-image-wrapper">
                  <img
                    src={item.image || "/assets/placeholder-news.jpg"}
                    alt={item.title}
                  />
                </div>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="news-title"
                >
                  {item.title}
                </a>
                {item.published && (
                  <span className="news-date">
                    {new Date(item.published).toLocaleDateString()}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <MessageModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        productId={selectedProduct?._id}
        recipientId={selectedProduct?.user?._id}
      />
    </div>
  );
}
