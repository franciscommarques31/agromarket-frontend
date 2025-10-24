import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import "../css/Dashboard.css";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Dashboard() {
  const [dashboardProducts, setDashboardProducts] = useState([]);
  const [mostViewedProducts, setMostViewedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Não estás logado");

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/products/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!Array.isArray(res.data)) throw new Error("Dados inválidos do servidor");

      // Ordenar produtos por criação para a lista da esquerda
      const myProducts = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      // Filtrar e ordenar os mais vistos para a lista da direita
      const mostViewed = myProducts
        .filter((p) => p.views > 0)           // só produtos com views
        .sort((a, b) => b.views - a.views);  // do mais visto para o menos visto

      setDashboardProducts(myProducts);
      setMostViewedProducts(mostViewed);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Erro ao carregar produtos");
      setDashboardProducts([]);
      setMostViewedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (location.state?.refresh) {
      fetchProducts();
      navigate("/dashboard", { replace: true });
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
      await axios.delete(`${import.meta.env.VITE_API_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDashboardProducts((prev) => prev.filter((p) => p._id !== id));
      setMostViewedProducts((prev) => prev.filter((p) => p._id !== id));
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
          {/* Coluna esquerda: todos os produtos do utilizador */}
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
                            {product.modelo && <p className="dash-modelo">{product.modelo}</p>}
                          </div>
                        </div>
                        <div className="dash-bottom">
                          <div className="dash-left">
                            <span className="dash-preco">€{product.preco.toLocaleString()}</span>
                          </div>
                          <div className="dash-right">
                            <span className="dash-localidade">{product.distrito}</span>
                            <span className="dash-data">{formatDate(product.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
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

          {/* Coluna direita: produtos mais vistos */}
          <div className="dash-right-column">
            <h2>Produtos mais vistos</h2>
            {mostViewedProducts.length === 0 ? (
              <p>Não existem produtos mais vistos</p>
            ) : (
              <div className="dash-notifications">
                {mostViewedProducts.map((product) => (
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
                        <span role="img" aria-label="olho">
                          👁️
                        </span>{" "}
                        {product.views}
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
