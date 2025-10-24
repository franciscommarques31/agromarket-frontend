import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import HeaderPublic from "../components/HeaderPublic";
import axios from "axios";
import { AiOutlineHeart, AiOutlineMail } from "react-icons/ai";
import "../css/Product.css";
import { AuthContext } from "../context/AuthContext";
import MessageModal from "../components/MessageModal";

export default function ProductPage() {
  const { user, token } = useContext(AuthContext);

  const [filters, setFilters] = useState({
    setor: "",
    produto: "",
    marca: "",
    distrito: "",
    empresa: "",
    estado: "",
    precoMin: "",
    precoMax: "",
    ordenarPreco: "",
  });

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 18;

  const [ppModalOpen, setPpModalOpen] = useState(false);
  const [ppSelectedProduct, setPpSelectedProduct] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/products`)
      .then((res) => {
        setProducts(res.data);
        setFilteredProducts(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    let filtered = [...products];

    if (filters.setor) filtered = filtered.filter((p) => p.setor === filters.setor);
    if (filters.produto)
      filtered = filtered.filter((p) =>
        p.produto.toLowerCase().includes(filters.produto.toLowerCase())
      );
    if (filters.marca)
      filtered = filtered.filter((p) =>
        p.marca.toLowerCase().includes(filters.marca.toLowerCase())
      );
    if (filters.distrito)
      filtered = filtered.filter((p) =>
        p.distrito.toLowerCase().includes(filters.distrito.toLowerCase())
      );
    if (filters.empresa)
      filtered = filtered.filter((p) =>
        p.user?.name.toLowerCase().includes(filters.empresa.toLowerCase())
      );
    if (filters.estado) filtered = filtered.filter((p) => p.estado === filters.estado);
    if (filters.precoMin) filtered = filtered.filter((p) => p.preco >= Number(filters.precoMin));
    if (filters.precoMax) filtered = filtered.filter((p) => p.preco <= Number(filters.precoMax));

    if (filters.ordenarPreco === "menor") filtered.sort((a, b) => a.preco - b.preco);
    else if (filters.ordenarPreco === "maior") filtered.sort((a, b) => b.preco - a.preco);

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const ppHandleFavorite = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return alert("É necessário estar logado para adicionar favoritos!");
    if (product.user?._id === user.id) return alert("Não pode favoritar o seu próprio produto!");

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/products/${product._id}/favorite`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Produto adicionado/removido dos favoritos!");
    } catch (err) {
      console.error(err);
      alert("Erro ao adicionar favorito");
    }
  };

  const ppHandleOpenModal = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return alert("É necessário estar logado para enviar mensagem!");
    if (product.user?._id === user.id) return alert("Não pode enviar mensagem para o seu próprio anúncio.");
    setPpSelectedProduct(product);
    setPpModalOpen(true);
  };

  const ppHandleCloseModal = () => {
    setPpSelectedProduct(null);
    setPpModalOpen(false);
  };

  return (
    <div>
      <HeaderPublic />

      <div className="productPage-container">
        <div className="productPage-layout">
          <div className="productPage-grid">
            {currentProducts.length === 0 && <p>Nenhum produto encontrado</p>}

            {currentProducts.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="productPage-card-link"
              >
                <div className="productPage-card">
                  {product.estado && (
                    <span className={`productPage-estado-tag ${product.estado}`}>
                      {product.estado}
                    </span>
                  )}

                  <img
                    src={product.imagens?.[0] || "/assets/placeholder.jpg"}
                    alt={product.produto}
                  />

                  {/* Botões */}
                  <div className="pp-card-buttons">
                    <button
                      className="pp-favorite-btn"
                      onClick={(e) => ppHandleFavorite(e, product)}
                    >
                      <AiOutlineHeart size={20} />
                    </button>

                    {user && (
                      <button
                        className="pp-message-btn"
                        onClick={(e) => ppHandleOpenModal(e, product)}
                      >
                        <AiOutlineMail size={20} />
                      </button>
                    )}
                  </div>

                  <div className="productPage-info">
                    <div className="productPage-top">
                      <h3 className="productPage-nome-produto">{product.produto}</h3>
                      <div className="productPage-marca-modelo">
                        <p className="productPage-marca">{product.marca}</p>
                        {product.modelo && <p className="productPage-modelo">{product.modelo}</p>}
                      </div>
                    </div>

                    <div className="productPage-bottom">
                      <div className="productPage-bottom-left">
                        <span className="productPage-preco">€{product.preco.toLocaleString()}</span>
                      </div>
                      <div className="productPage-bottom-right">
                        <span className="productPage-localidade">{product.distrito}</span>
                        <span className="productPage-data-tag">{formatDate(product.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {totalPages > 1 && (
              <div className="productPage-pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={currentPage === i + 1 ? "active" : ""}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="productPage-filters-vertical">
            <form onSubmit={handleSearch} className="productPage-filters-form-vertical">
              <h3>Filtros</h3>
              <select name="setor" value={filters.setor} onChange={handleChange}>
                <option value="">Setor</option>
                <option value="Agrícola">Agrícola</option>
                <option value="Construção">Construção</option>
                <option value="Florestal">Florestal</option>
                <option value="Jardinagem">Jardinagem</option>
                <option value="Transporte">Transporte</option>
              </select>
              <input type="text" name="produto" placeholder="Produto" value={filters.produto} onChange={handleChange}/>
              <input type="text" name="marca" placeholder="Marca" value={filters.marca} onChange={handleChange}/>
              <input type="text" name="distrito" placeholder="Distrito" value={filters.distrito} onChange={handleChange}/>
              <input type="text" name="empresa" placeholder="Empresa" value={filters.empresa} onChange={handleChange}/>
              <select name="estado" value={filters.estado} onChange={handleChange}>
                <option value="">Estado</option>
                <option value="novo">Novo</option>
                <option value="usado">Usado</option>
              </select>
              <input type="number" name="precoMin" placeholder="Preço Mínimo" value={filters.precoMin} onChange={handleChange}/>
              <input type="number" name="precoMax" placeholder="Preço Máximo" value={filters.precoMax} onChange={handleChange}/>
              <select name="ordenarPreco" value={filters.ordenarPreco} onChange={handleChange}>
                <option value="">Ordenar por preço</option>
                <option value="menor">Menor para Maior</option>
                <option value="maior">Maior para Menor</option>
              </select>
              <button type="submit">Pesquisar</button>
            </form>
          </div>
        </div>
      </div>

      <MessageModal
        isOpen={ppModalOpen}
        onClose={ppHandleCloseModal}
        productId={ppSelectedProduct?._id}
        recipientId={ppSelectedProduct?.user?._id}
      />
    </div>
  );
}
