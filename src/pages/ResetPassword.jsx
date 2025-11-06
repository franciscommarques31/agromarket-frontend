import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import HeaderPublic from "../components/HeaderPublic";
import "../css/Login.css";
import { resetPassword } from "../api/auth";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("As passwords não coincidem");
      return;
    }
    try {
      const res = await resetPassword(token, password);
      setMessage(res.message);
      setError("");
      
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message || "Erro ao redefinir password");
      setMessage("");
    }
  };

  return (
    <div className="login-page">
      <HeaderPublic />
      <div className="login-wrapper">
        <div className="login-container">
          <div className="login-left">
            <h2>Redefinir Password</h2>
            <p>Insira a sua nova password.</p>
            <form onSubmit={handleSubmit} className="login-form">
              <input
                type="password"
                placeholder="Nova password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirmar nova password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button type="submit" className="btn-primary">Redefinir Password</button>
              {message && <p style={{ color: "green", marginTop: "10px" }}>{message}</p>}
              {error && <p className="auth-error">{error}</p>}
              <p style={{ marginTop: "10px" }}>
                <Link to="/login">Voltar ao login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
