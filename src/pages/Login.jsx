import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // 👈 ícones do olho
import HeaderPublic from "../components/HeaderPublic";
import "../css/Login.css";
import { loginUser } from "../api/auth"; 
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(formData); 
      const { token, user } = res;

      login(user, token); 
      localStorage.setItem("token", token); 

      if (user.isAdmin) navigate("/admin");
      else navigate("/dashboard");
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
              <div className="password-wrapper" style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <button type="submit" className="btn-primary">
                Entrar
              </button>

              <p style={{ marginTop: "10px", textAlign: "right" }}>
                <Link to="/forgot-password">Esqueceste-te da palavra-passe?</Link>
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
