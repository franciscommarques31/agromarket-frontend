import { useEffect, useState } from "react";
import AdminHeader from "../components/AdminHeader";
import { getAllProducts, updateProduct, deleteProduct } from "../api/admin";
import "../css/AdminProducts.css";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  const [produtoSearch, setProdutoSearch] = useState("");
  const [marcaSearch, setMarcaSearch] = useState("");

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const productsRes = await getAllProducts(token);
      setProducts(productsRes || []);
      setFilteredProducts(productsRes || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar produtos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;
    if (produtoSearch) filtered = filtered.filter(p => p.produto === produtoSearch);
    if (marcaSearch) filtered = filtered.filter(p => p.marca === marcaSearch);
    setFilteredProducts(filtered);
  }, [produtoSearch, marcaSearch, products]);

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Tens a certeza que queres apagar este produto?")) return;
    try {
      const token = localStorage.getItem("token");
      await deleteProduct(token, id);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Erro ao apagar produto");
    }
  };

  const handleSaveProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = { ...editingProduct };

      await updateProduct(token, editingProduct._id, payload);

      setProducts(prev =>
        prev.map(p => (p._id === editingProduct._id ? { ...p, ...payload } : p))
      );

      setEditingProduct(null);
      alert("Produto atualizado!");
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar produto");
    }
  };

  if (loading) return <p className="products-loading">Carregando produtos...</p>;
  if (error) return <p className="products-error">{error}</p>;

  return (
    <div>
      <AdminHeader />

      <div className="products-container">
        <h2 className="products-title">Gestão de Produtos</h2>

        <div className="products-searches">
          <div className="search-field-products">
            <label>Pesquisar por Produto</label>
            <select value={produtoSearch} onChange={(e) => setProdutoSearch(e.target.value)}>
              <option value="">Todos</option>
              {products.map(p => (
                <option key={p._id} value={p.produto}>{p.produto}</option>
              ))}
            </select>
          </div>

          <div className="search-field-products">
            <label>Pesquisar por Marca</label>
            <select value={marcaSearch} onChange={(e) => setMarcaSearch(e.target.value)}>
              <option value="">Todas</option>
              {products.map(p => (
                <option key={p._id} value={p.marca}>{p.marca}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="products-table-wrapper">
          <table className="products-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Estado</th>
                <th>Proprietário</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product._id}>
                  <td>{product.produto}</td>
                  <td>{product.marca}</td>
                  <td>{product.modelo}</td>
                  <td>{product.estado === "novo" ? "Novo" : "Usado"}</td>
                  <td>{product.user?.email || "Desconhecido"}</td>
                  <td className="products-actions-td">
                    <button
                      className="products-edit-btn"
                      onClick={() => setEditingProduct(product)}
                    >
                      Editar
                    </button>
                    <button
                      className="products-delete-btn"
                      onClick={() => handleDeleteProduct(product._id)}
                    >
                      Apagar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {editingProduct && (
          <div className="products-modal-overlay">
            <div className="products-modal" role="dialog" aria-modal="true">
              <h2>Editar Produto</h2>

              <div className="products-modal-grid">

                <div className="form-group">
                  <label>Setor</label>
                  <input
                    type="text"
                    value={editingProduct.setor || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, setor: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Produto</label>
                  <input
                    type="text"
                    value={editingProduct.produto || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, produto: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Modelo</label>
                  <input
                    type="text"
                    value={editingProduct.modelo || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, modelo: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Marca</label>
                  <input
                    type="text"
                    value={editingProduct.marca || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, marca: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Distrito</label>
                  <input
                    type="text"
                    value={editingProduct.distrito || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, distrito: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Ano</label>
                  <input
                    type="number"
                    min="0"
                    value={editingProduct.anos ?? ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, anos: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Quilómetros</label>
                  <input
                    type="number"
                    min="0"
                    value={editingProduct.quilometros ?? ""}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, quilometros: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Horas</label>
                  <input
                    type="number"
                    min="0"
                    value={editingProduct.horas ?? ""}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, horas: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Preço (€)</label>
                  <input
                    type="number"
                    min="0"
                    value={editingProduct.preco ?? ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, preco: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Estado</label>
                  <select
                    value={editingProduct.estado || "usado"}
                    onChange={(e) => setEditingProduct({ ...editingProduct, estado: e.target.value })}
                  >
                    <option value="novo">Novo</option>
                    <option value="usado">Usado</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Utilizador (email)</label>
                  <input
                    type="email"
                    value={editingProduct.user?.email || ""}
                    disabled
                  />
                </div>

                <label className="desc-label">Descrição</label>
                <textarea
                  className="desc-textarea"
                  value={editingProduct.descricao || ""}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, descricao: e.target.value })
                  }
                />

              </div>

              <div className="products-modal-buttons">
                <button className="products-save-btn" onClick={handleSaveProduct}>Guardar</button>
                <button className="products-cancel-btn" onClick={() => setEditingProduct(null)}>Cancelar</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
