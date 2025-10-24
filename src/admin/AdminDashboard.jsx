import { useEffect, useState } from "react";
import AdminHeader from "../components/AdminHeader";
import {
  getAllUsers,
  deleteUser,
  updateUser,
  getAllProducts,
  updateProduct,
  deleteProduct,
} from "../api/admin";
import "../css/AdminDashboard.css";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingUser, setEditingUser] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [password, setPassword] = useState("");

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [usersRes, productsRes] = await Promise.all([
        getAllUsers(token),
        getAllProducts(token),
      ]);
      setUsers(usersRes);
      setProducts(productsRes);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar dados do admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // -------- USERS --------
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Tens a certeza que queres apagar este utilizador?")) return;
    try {
      const token = localStorage.getItem("token");
      await deleteUser(token, id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
      alert("Erro ao apagar utilizador");
    }
  };

  const handleSaveUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const updatedUser = { ...editingUser };

      // Só envia password se tiver preenchido
      if (password.trim() !== "") {
        updatedUser.password = password;
      }

      await updateUser(token, editingUser._id, updatedUser);
      setUsers((prev) =>
        prev.map((u) => (u._id === editingUser._id ? updatedUser : u))
      );
      setEditingUser(null);
      setPassword("");
      alert("Utilizador atualizado com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar utilizador");
    }
  };

  // -------- PRODUCTS --------
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Tens a certeza que queres apagar este produto?")) return;
    try {
      const token = localStorage.getItem("token");
      await deleteProduct(token, id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Erro ao apagar produto");
    }
  };

  const handleSaveProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      await updateProduct(token, editingProduct._id, editingProduct);
      setProducts((prev) =>
        prev.map((p) => (p._id === editingProduct._id ? editingProduct : p))
      );
      setEditingProduct(null);
      alert("Produto atualizado com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar produto");
    }
  };

  if (loading) return <p>Carregando dados...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <AdminHeader />
      <div className="admin-dashboard-container">
     
        <div className="admin-dashboard-columns">
          {/* -------- UTILIZADORES -------- */}
          <div className="admin-left-column">
            <h2>Utilizadores</h2>
            {users.length === 0 ? (
              <p>Não há utilizadores.</p>
            ) : (
              <div className="admin-user-grid">
                {users.map((user) => (
                  <div key={user._id} className="admin-user-card">
                    <p><strong>Nome:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Admin:</strong> {user.isAdmin ? "Sim" : "Não"}</p>
                    <div className="admin-product-buttons">
                      <button onClick={() => setEditingUser(user)}>Editar</button>
                      <button onClick={() => handleDeleteUser(user._id)}>Apagar</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* -------- PRODUTOS -------- */}
          <div className="admin-right-column">
            <h2>Produtos</h2>
            {products.length === 0 ? (
              <p>Não há produtos.</p>
            ) : (
              <div className="admin-product-grid">
                {products.map((product) => (
                  <div key={product._id} className="admin-product-card">
                    <p><strong>Produto:</strong> {product.produto}</p>
                    <p><strong>Marca:</strong> {product.marca}</p>
                    <p><strong>Modelo:</strong> {product.modelo}</p>
                    <p><strong>Utilizador:</strong> {product.user?.email || "Desconhecido"}</p>
                    <div className="admin-product-buttons">
                      <button onClick={() => setEditingProduct(product)}>Editar</button>
                      <button onClick={() => handleDeleteProduct(product._id)}>Apagar</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* -------- MODAL EDITAR UTILIZADOR -------- */}
        {editingUser && (
          <div className="admin-modal-overlay">
            <div className="admin-modal">
              <h2>Editar Utilizador</h2>
              <div className="admin-modal-grid">
                <label>Nome</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, name: e.target.value })
                  }
                />

                <label>Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                />

                <label>Telefone</label>
                <input
                  type="text"
                  value={editingUser.phone || ""}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, phone: e.target.value })
                  }
                />

                <label>Cidade</label>
                <input
                  type="text"
                  value={editingUser.city || ""}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, city: e.target.value })
                  }
                />

                <label>País</label>
                <input
                  type="text"
                  value={editingUser.country || ""}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, country: e.target.value })
                  }
                />

                <label>Password (deixa em branco para não alterar)</label>
                <input
                  type="password"
                  placeholder="Nova password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="admin-modal-buttons">
                <button onClick={handleSaveUser}>Guardar</button>
                <button onClick={() => { setEditingUser(null); setPassword(""); }}>Cancelar</button>
              </div>
            </div>
          </div>
        )}

        {/* -------- MODAL EDITAR PRODUTO -------- */}
        {editingProduct && (
          <div className="admin-modal-overlay">
            <div className="admin-modal">
              <h2>Editar Produto</h2>

              <div className="admin-modal-grid">
                <label>Setor</label>
                <select
                  value={editingProduct.setor}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, setor: e.target.value })
                  }
                >
                  <option>Agrícola</option>
                  <option>Construção</option>
                  <option>Florestal</option>
                  <option>Jardinagem</option>
                  <option>Transporte</option>
                </select>

                <label>Produto</label>
                <input
                  type="text"
                  value={editingProduct.produto}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, produto: e.target.value })
                  }
                />

                <label>Modelo</label>
                <input
                  type="text"
                  value={editingProduct.modelo}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, modelo: e.target.value })
                  }
                />

                <label>Marca</label>
                <input
                  type="text"
                  value={editingProduct.marca}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, marca: e.target.value })
                  }
                />

                <label>Distrito</label>
                <input
                  type="text"
                  value={editingProduct.distrito}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, distrito: e.target.value })
                  }
                />

                <label>Horas</label>
                <input
                  type="number"
                  value={editingProduct.horas}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, horas: e.target.value })
                  }
                />

                <label>Preço</label>
                <input
                  type="number"
                  value={editingProduct.preco}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, preco: e.target.value })
                  }
                />

                <label>Descrição</label>
                <textarea
                  value={editingProduct.descricao}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, descricao: e.target.value })
                  }
                />

                <label>Estado</label>
                <select
                  value={editingProduct.estado}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, estado: e.target.value })
                  }
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
