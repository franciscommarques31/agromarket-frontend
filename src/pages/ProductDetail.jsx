import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import HeaderPublic from "../components/HeaderPublic";
import MessageModal from "../components/MessageModal"; 
import { AuthContext } from "../context/AuthContext";
import "../css/ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const { user, token } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/products/${id}`,
          config
        );

        setProduct(res.data);
      } catch (err) {
        console.error("Erro ao carregar produto:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, token]);

  const handleOpenModal = () => {
    if (!user) {
      alert("É necessário fazer login para enviar mensagem!");
      return;
    }
    if (product.user?._id === user.id) {
      alert("Não pode enviar mensagem para o seu próprio anúncio.");
      return;
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => setModalOpen(false);

  if (loading) return <p style={{ textAlign: "center" }}>A carregar...</p>;
  if (!product) return <p style={{ textAlign: "center" }}>Produto não encontrado</p>;

  return (
    <>
      <HeaderPublic />
      <div className="product-detail-page">
        <div className="product-detail-container">

          {/* Lado esquerdo */}
          <div className="product-detail-left">
            <img
              src={product.imagens?.[0] || "https://via.placeholder.com/800x500"}
              alt={product.produto}
              className="product-detail-image"
            />
            <div className="product-detail-description">
              <div className="product-description-card">
                <h2>Descrição</h2>
                <p>{product.descricao}</p>
              </div>

              <div className="product-details-card">
                <h2>Detalhes do Produto</h2>
                <ul>
                  {product.setor && <li><strong>Setor:</strong> {product.setor}</li>}
                  {product.anos && <li><strong>Anos:</strong> {product.anos}</li>}
                  {product.quilometros && <li><strong>Quilómetros:</strong> {product.quilometros}</li>}
                  {product.horas && <li><strong>Horas:</strong> {product.horas}</li>}
                </ul>
              </div>
            </div>
          </div>

          {/* Lado direito */}
          <div className="product-detail-right">
            <div className="product-text-top-right">
              <h1>{product.produto}</h1>
              <p className="product-brand">{product.marca}</p>
              {product.modelo && <p className="product-model">{product.modelo}</p>}
            </div>

            <div className="product-detail-header">
              <p className="product-detail-price">€{product.preco.toLocaleString()}</p>
            </div>

            <button
              className="product-detail-message-btn"
              onClick={handleOpenModal}
            >
              Enviar mensagem
            </button>

            {product.user && (
              <div className="product-user-info">
                <h3>Informações do vendedor</h3>
                <div className="user-info-flex">
                  <div className="user-avatar-placeholder">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" viewBox="0 0 24 24">
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                    </svg>
                  </div>
                  <div>
                    <p><strong>Nome:</strong> {product.user.name} {product.user.surname}</p>
                    {product.user.phone && <p><strong>Telemóvel:</strong> {product.user.phone}</p>}
                    {product.user.email && <p><strong>Email:</strong> {product.user.email}</p>}
                  </div>
                </div>
              </div>
            )}

            <div className="product-detail-info">
              <p><strong>Estado:</strong> {product.estado}</p>
              <p><strong>Localização:</strong> {product.distrito}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de mensagem */}
      <MessageModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        productId={product._id}
        recipientId={product.user?._id}
      />
    </>
  );
};

export default ProductDetail;
