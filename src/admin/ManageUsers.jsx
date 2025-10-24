import { useEffect, useState } from "react";
import axios from "axios";
import "../css/Admin.css";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", surname: "", email: "", isAdmin: false });

  // Buscar todos os utilizadores
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Deletar utilizador
  const handleDelete = async (id) => {
    if (!window.confirm("Tem a certeza que quer eliminar este utilizador?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // Preparar edição
  const handleEdit = (user) => {
    setEditingUser(user._id);
    setFormData({ name: user.name, surname: user.surname, email: user.email, isAdmin: user.isAdmin });
  };

  // Submeter edição
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/admin/users/${editingUser}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-page">
      <h2>Gerir Utilizadores</h2>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Sobrenome</th>
            <th>Email</th>
            <th>Admin</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.surname}</td>
              <td>{user.email}</td>
              <td>{user.isAdmin ? "Sim" : "Não"}</td>
              <td>
                <button onClick={() => handleEdit(user)}>Editar</button>
                <button onClick={() => handleDelete(user._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingUser && (
        <div className="edit-form">
          <h3>Editar Utilizador</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nome"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Sobrenome"
              value={formData.surname}
              onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <label>
              Admin:
              <input
                type="checkbox"
                checked={formData.isAdmin}
                onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
              />
            </label>
            <button type="submit">Salvar</button>
            <button type="button" onClick={() => setEditingUser(null)}>Cancelar</button>
          </form>
        </div>
      )}
    </div>
  );
}
