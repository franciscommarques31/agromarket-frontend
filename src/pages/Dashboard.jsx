import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import "../css/Dashboard.css";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Dashboard() {
  const [dashboardProducts, setDashboardProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // Para detectar refresh vindo do AddProduct

  // Função para buscar produtos do utilizador
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Não estás logado");

      const res = await axios.get("http://localhost:3000/api/products/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!Array.isArray(res.data)) throw new Error("Dados inválidos do servidor");

      setDashboardProducts(
        res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Erro ao carregar produtos");
      setDashboardProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // useEffect principal: busca produtos ao montar
  useEffect(() => {
    fetchProducts();
  }, []);

  // useEffect secundário: se voltamos do AddProduct com refresh, refaz fetch
  useEffect(() => {
    if (location.state?.refresh) {
      fetchProducts();
      navigate("/dashboard", { replace: true }); // remove state para não refazer sempre
    }
  }, [location.state, navigate]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tens a certeza que queres apagar este produto?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDashboardProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Erro ao apagar o produto");
    }
  };

  if (loading) return <p>Carregando produtos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Header isLoggedIn={true} />

      <div className="dash-container">
        <h1>Dashboard</h1>

        <div className="dash-main">
          {/* Coluna esquerda: produtos */}
          <div className="dash-left-column">
            <h2>Os meus Produtos</h2>
            {dashboardProducts.length === 0 ? (
              <p>Não tens produtos.</p>
            ) : (
              <div className="dash-products-grid">
                {dashboardProducts.map((product) => (
                  <div key={product._id} className="dash-card-wrapper">
                    <Link to={`/product/${product._id}`} className="dash-card">
                      {product.estado && (
                        <span className={`dash-estado ${product.estado}`}>
                          {product.estado}
                        </span>
                      )}

                      <img
                        src={product.imagens?.[0] || "/assets/placeholder.jpg"}
                        alt={product.produto}
                        className="dash-img"
                      />

                      <div className="dash-info">
                        <div className="dash-top">
                          <h3>{product.produto}</h3>
                          <div className="dash-marca-modelo">
                            <p className="dash-marca">{product.marca}</p>
                            {product.modelo && (
                              <p className="dash-modelo">{product.modelo}</p>
                            )}
                          </div>
                        </div>

                        <div className="dash-bottom">
                          <div className="dash-left">
                            <span className="dash-preco">
                              €{product.preco.toLocaleString()}
                            </span>
                          </div>
                          <div className="dash-right">
                            <span className="dash-localidade">{product.distrito}</span>
                            <span className="dash-data">{formatDate(product.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* Botões Editar e Apagar */}
                    <div className="dash-card-buttons">
                      <button
                        className="dash-edit-btn"
                        onClick={() => navigate(`/dashboard/edit/${product._id}`)}
                      >
                        Editar
                      </button>
                      <button
                        className="dash-delete-btn"
                        onClick={() => handleDelete(product._id)}
                      >
                        Apagar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Coluna direita: notificações */}
          <div className="dash-right-column">
            <h2>Produtos mais vistos</h2>
            {dashboardProducts.filter(p => p.views > 0).length === 0 ? (
              <p>Não existem produtos mais vistos</p>
            ) : (
              <div className="dash-notifications">
                {dashboardProducts
                  .filter((p) => p.views > 0)
                  .map((product) => (
                    <Link
                      key={product._id}
                      to={`/product/${product._id}`}
                      className="dash-notification-card"
                    >
                      <img
                        src={product.imagens?.[0] || "/assets/placeholder.jpg"}
                        alt={product.produto}
                      />
                      <div className="dash-notification-info">
                        <p>{product.produto}</p>
                        <div className="dash-views">
                          <span role="img" aria-label="olho">👁️</span> {product.views}
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
