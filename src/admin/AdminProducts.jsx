import { useEffect, useState } from "react";
import AdminHeader from "../components/AdminHeader";
import { getAllProducts, updateProduct, deleteProduct } from "../api/admin";
import "../css/AdminDashboard.css";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const productsRes = await getAllProducts(token);
      setProducts(productsRes);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Tens a certeza que queres apagar este produto?")) return;
    const token = localStorage.getItem("token");
    await deleteProduct(token, id);
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  const handleSaveProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      await updateProduct(token, editingProduct._id, editingProduct);
      setProducts((prev) =>
        prev.map((p) => (p._id === editingProduct._id ? editingProduct : p))
      );
      setEditingProduct(null);
      alert("Produto atualizado!");
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar produto");
    }
  };

  if (loading) return <p>Carregando produtos...</p>;

  return (
    <div>
      <AdminHeader />
      <div className="admin-dashboard-container">
        <h2>Produtos</h2>
        <div className="admin-cards-scroll">
          {products.map((product) => (
            <div key={product._id} className="admin-card">
              <p><strong>Produto:</strong> {product.produto}</p>
              <p><strong>Marca:</strong> {product.marca}</p>
              <p><strong>Modelo:</strong> {product.modelo}</p>
              <p><strong>Utilizador:</strong> {product.user?.email || "Desconhecido"}</p>
              <div className="admin-card-buttons">
                <button onClick={() => setEditingProduct(product)}>Editar</button>
                <button onClick={() => handleDeleteProduct(product._id)}>Apagar</button>
              </div>
            </div>
          ))}
        </div>

        {editingProduct && (
          <div className="admin-modal-overlay">
            <div className="admin-modal">
              <h2>Editar Produto</h2>
              <div className="admin-modal-grid">
                <label>Produto</label>
                <input
                  type="text"
                  value={editingProduct.produto}
                  onChange={(e) => setEditingProduct({ ...editingProduct, produto: e.target.value })}
                />
                <label>Marca</label>
                <input
                  type="text"
                  value={editingProduct.marca}
                  onChange={(e) => setEditingProduct({ ...editingProduct, marca: e.target.value })}
                />
                <label>Modelo</label>
                <input
                  type="text"
                  value={editingProduct.modelo}
                  onChange={(e) => setEditingProduct({ ...editingProduct, modelo: e.target.value })}
                />
                <label>Estado</label>
                <select
                  value={editingProduct.estado}
                  onChange={(e) => setEditingProduct({ ...editingProduct, estado: e.target.value })}
                >
                  <option value="novo">Novo</option>
                  <option value="usado">Usado</option>
                </select>
                <label>Utilizador</label>
                <input type="email" value={editingProduct.user?.email} disabled />
              </div>
              <div className="admin-modal-buttons">
                <button onClick={handleSaveProduct}>Guardar</button>
                <button onClick={() => setEditingProduct(null)}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
