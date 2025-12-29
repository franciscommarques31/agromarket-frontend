import { useState } from "react";
import { registerUser } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // 👈 ícones do olho
import HeaderPublic from "../components/HeaderPublic";
import "../css/Register.css";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "", 
    birthDate: "",
    city: "",
    country: "",
    phone: ""
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error && (name === "password" || name === "confirmPassword" || name === "birthDate")) {
      setError("");
    }
  };

  const validateAge = (birthDate) => {
    if (!birthDate) return false;
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age >= 18;
  };

  const validatePassword = (password) => {
    const specialCharRegex = /[^A-Za-z0-9]/;
    return specialCharRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateAge(formData.birthDate)) {
      setError("A continuação do registo não é permitida para menores de 18 anos.");
      return;
    }

    if (!validatePassword(formData.password)) {
      setError("A password deve conter pelo menos 1 caractere especial.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("As palavras-passe não coincidem!");
      return;
    }

    try {
      const { confirmPassword, ...dataToSend } = formData;
      await registerUser(dataToSend);
      navigate("/login");
    } catch (err) {
      setError(err.message || "Erro ao registar");
    }
  };

  return (
    <div className="register-page">
      <HeaderPublic />
      <div className="register-wrapper">
        <div className="register-container">

          <div className="register-left">
            <h2>AINDA NÃO TEM CONTA?</h2>
            <p>Crie uma gratuitamente e comece a usar o nosso serviço em poucos segundos.</p>

            <form onSubmit={handleSubmit} className="register-form">
              <input type="text" name="name" placeholder="Nome" onChange={handleChange} required />
              <input type="text" name="surname" placeholder="Apelido" onChange={handleChange} required />
              <input type="email" name="email" placeholder="Email" onChange={handleChange} required />

              {/* Password */}
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

              {/* Confirm Password */}
              <div className="password-wrapper" style={{ position: "relative" }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirmar Password"
                  onChange={handleChange}
                  required
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <label htmlFor="birthDate" className="birth-label">
                Data de Nascimento
              </label>
              <input type="date" name="birthDate" id="birthDate" onChange={handleChange} required />

              <input type="text" name="city" placeholder="Cidade" onChange={handleChange} required />
              <input type="text" name="country" placeholder="País" onChange={handleChange} required />
              <input type="tel" name="phone" placeholder="Telefone" onChange={handleChange} required />

              <button type="submit" className="btn-primary">Criar Conta</button>
              {error && <p className="auth-error">{error}</p>}
            </form>
          </div>

          <div className="register-right">
            <h2>SE JÁ É DA CASA</h2>
            <p>Introduza os seus dados e aceda à sua conta.</p>
            <Link to="/login" className="btn-secondary">Fazer Login</Link>
          </div>

        </div>
      </div>
    </div>
  );
}
