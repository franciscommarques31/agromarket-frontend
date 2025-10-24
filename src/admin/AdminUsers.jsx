import { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../api/admin";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  // Substitui por como guardas o token no teu frontend
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers(token);
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError("Erro ao obter utilizadores");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Tem a certeza que quer apagar este utilizador?")) return;
    try {
      await deleteUser(token, userId);
      fetchUsers(); // Recarregar a lista
    } catch (err) {
      console.error(err);
      alert("Erro ao apagar utilizador");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Gestão de Utilizadores</h2>
      {error && <p>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Admin</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name} {user.surname}</td>
              <td>{user.email}</td>
              <td>{user.isAdmin ? "Sim" : "Não"}</td>
              <td>
                <button onClick={() => alert("Editar ainda não implementado")}>Editar</button>
                <button onClick={() => handleDelete(user._id)}>Apagar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
