import { useState } from "react";
import { Link } from "react-router-dom";
import HeaderPublic from "../components/HeaderPublic";
import "../css/Login.css";
import { forgotPassword } from "../api/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await forgotPassword({ email });
      setMessage(res.message);
      setError("");
    } catch (err) {
      setError(err.message || "Erro ao enviar email");
      setMessage("");
    }
  };

  return (
    <div className="login-page">
      <HeaderPublic />
      <div className="login-wrapper">
        <div className="login-container">
          <div className="login-left">
            <h2>Recuperar Password</h2>
            <p>Insira o seu email e enviaremos instruções para redefinir a password.</p>
            <form onSubmit={handleSubmit} className="login-form">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn-primary">
                Enviar Email
              </button>
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
