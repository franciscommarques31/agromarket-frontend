import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import HeaderPublic from "../components/HeaderPublic";
import "../css/Login.css";
import { loginUser } from "../api/auth"; // função que faz login no backend
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Chama API de login
      const res = await loginUser(formData); // retorna { token, user }
      const { token, user } = res;

      // Guarda no contexto e no localStorage
      login(user, token); // update AuthContext
      localStorage.setItem("token", token); // Guarda token para usar nas rotas admin

      // Redireciona admin ou user normal
      if (user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Credenciais inválidas");
    }
  };

  return (
    <div className="login-page">
      <HeaderPublic />
      <div className="login-wrapper">
        <div className="login-container">
          <div className="login-left">
            <h2>SE JÁ É DA CASA</h2>
            <p>Introduza os seus dados e aceda à sua conta.</p>
            <form onSubmit={handleSubmit} className="login-form">
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
              />
              <button type="submit" className="btn-primary">
                Entrar
              </button>

              {/* LINK PARA ESQUECI A PASSWORD */}
              <p style={{ marginTop: "10px", textAlign: "right" }}>
                <Link to="/forgot-password">Esqueci a minha password</Link>
              </p>

              {error && <p className="auth-error">{error}</p>}
            </form>
          </div>
          <div className="login-right">
            <h2>Ainda não é da casa?</h2>
            <p>Se ainda não é da casa, registe-se. Está à espera do quê?</p>
            <Link to="/register" className="btn-secondary">
              Registar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
