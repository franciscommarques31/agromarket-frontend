import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../css/Header.css";
import logo from "../assets/logo.png";

export default function Header() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const isLoggedIn = !!user;

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null); // atualiza contexto global
    navigate("/");
  };

  return (
    <header className="app-header">
      <div className="logo">
        <Link to="/"><img src={logo} alt="AgroMarket Logo" /></Link>
      </div>

      <nav className="nav-menu">
        <ul>
          {isLoggedIn ? (
            <>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/add-product">Colocar Produto</Link></li>
              <li><Link to="/messages">Mensagens</Link></li>
              <li><Link to="/favorites">Favoritos</Link></li> {/* <-- aqui */}
              <li><Link to="/edit-profile">Editar Perfil</Link></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Registo</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
