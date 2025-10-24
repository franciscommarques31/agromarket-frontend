// src/admin/AdminProducts.jsx
import { useEffect, useState, useContext } from "react";
import { getAllProducts, deleteProduct, updateProduct } from "../api/admin";
import { AuthContext } from "../context/AuthContext";

export default function AdminProducts() {
  const { token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ produto: "", marca: "", preco: "" });

  const fetchProducts = async () => {
    const data = await getAllProducts(token);
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setEditingProduct(product._id);
    setFormData({ produto: product.produto, marca: product.marca, preco: product.preco });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await updateProduct(token, editingProduct, formData);
    setEditingProduct(null);
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem a certeza que quer apagar este produto?")) {
      await deleteProduct(token, id);
      fetchProducts();
    }
  };

  return (
    <div>
      <h1>Gestão de Produtos</h1>
      {products.length === 0 ? (
        <p>Nenhum produto registado.</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Marca</th>
              <th>Preço</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>
                  {editingProduct === p._id ? (
                    <input
                      value={formData.produto}
                      onChange={(e) => setFormData({ ...formData, produto: e.target.value })}
                    />
                  ) : (
                    p.produto
                  )}
                </td>
                <td>
                  {editingProduct === p._id ? (
                    <input
                      value={formData.marca}
                      onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                    />
                  ) : (
                    p.marca
                  )}
                </td>
                <td>
                  {editingProduct === p._id ? (
                    <input
                      value={formData.preco}
                      onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                    />
                  ) : (
                    p.preco
                  )}
                </td>
                <td>
                  {editingProduct === p._id ? (
                    <>
                      <button onClick={handleUpdate}>Salvar</button>
                      <button onClick={() => setEditingProduct(null)}>Cancelar</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(p)}>Editar</button>
                      <button onClick={() => handleDelete(p._id)}>Apagar</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
