import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/HeaderPublic.css";
import logo from "../assets/logo.png";
import { AuthContext } from "../context/AuthContext";

export default function HeaderPublic() {
  const { user, setUser, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/"); // redireciona para Home após logout
  };

  return (
    <header className="header-public">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Agromarket Logo" />
        </Link>
      </div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/Product">Compra/Venda Máquinas</Link></li>

          {!user && <li><Link to="/Register">Área Pessoal</Link></li>}
          {user && <li><Link to="/dashboard">Dashboard</Link></li>}
          {user && <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>}
        </ul>
      </nav>
    </header>
  );
}
