import { useEffect, useState } from "react";
import AdminHeader from "../components/AdminHeader";
import { getAllUsers, updateUser, deleteUser } from "../api/admin";
import "../css/AdminUsers.css";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [password, setPassword] = useState("");
  const [nameSearch, setNameSearch] = useState("");
  const [emailSearch, setEmailSearch] = useState("");

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await getAllUsers(token);
      setUsers(data);
      setFilteredUsers(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar utilizadores.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    if (nameSearch) filtered = filtered.filter((u) => u.name === nameSearch);
    if (emailSearch) filtered = filtered.filter((u) => u.email === emailSearch);

    setFilteredUsers(filtered);
  }, [nameSearch, emailSearch, users]);

  const handleSaveUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const updatedUser = { ...editingUser };
      if (password.trim() !== "") updatedUser.password = password;

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

  if (loading) return <p>Carregando utilizadores...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <AdminHeader />
      <div className="admin-container">
        <h2 className="admin-title">Gestão de Utilizadores</h2>

        <div className="admin-searches">
          <div className="search-field">
            <label>Pesquisar por Nome</label>
            <select
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
            >
              <option value="">Todos</option>
              {users.map((u) => (
                <option key={u._id} value={u.name}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
          <div className="search-field">
            <label>Pesquisar por Email</label>
            <select
              value={emailSearch}
              onChange={(e) => setEmailSearch(e.target.value)}
            >
              <option value="">Todos</option>
              {users.map((u) => (
                <option key={u._id} value={u.email}>
                  {u.email}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nome Completo</th>
                <th>Email</th>
                <th>Admin</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.isAdmin ? "Sim" : "Não"}</td>
                  <td>
                    <button className="edit-btn" onClick={() => setEditingUser(user)}>Editar</button>
                    <button className="delete-btn" onClick={() => handleDeleteUser(user._id)}>Apagar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal de edição */}
        {editingUser && (
          <div className="admin-modal-overlay">
            <div className="admin-modal">
              <h2>Editar Utilizador</h2>

              <label>Nome</label>
              <input
                type="text"
                value={editingUser.name || ""}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, name: e.target.value })
                }
              />

              <label>Apelido</label>
              <input
                type="text"
                value={editingUser.surname || ""}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, surname: e.target.value })
                }
              />

              <label>Email</label>
              <input
                type="email"
                value={editingUser.email || ""}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, email: e.target.value })
                }
              />

              <label>Password (deixa em branco para não alterar)</label>
              <input
                type="password"
                placeholder="Nova password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="admin-modal-buttons">
                <button className="save-btn" onClick={handleSaveUser}>Guardar</button>
                <button
                  className="cancel-btn"
                  onClick={() => { setEditingUser(null); setPassword(""); }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
