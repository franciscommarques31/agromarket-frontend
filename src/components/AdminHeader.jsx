import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../css/AdminHeader.css";

export default function AdminHeader() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <header className="app-header">
      <div className="logo">
        <Link to="/admin">
          <h2 style={{ color: "white" }}>Painel Administração</h2>
        </Link>
      </div>

      <nav className="nav-menu">
        <ul>
          <li>
            <Link to="/admin/users">Utilizadores</Link>
          </li>
          <li>
            <Link to="/admin/products">Produtos</Link>
          </li>
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
