import React, { useState, useEffect } from "react";
import axios from "axios";
import HeaderPrivate from "../components/Header";
import "../css/EditProfile.css";

export default function EditProfile() {
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    city: "",
    country: "",
    phone: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Buscar dados do utilizador logado
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setForm({
          name: res.data.name || "",
          surname: res.data.surname || "",
          email: res.data.email || "",
          city: res.data.city || "",
          country: res.data.country || "",
          phone: res.data.phone || "",
          password: "",
        });
      } catch (err) {
        console.error(err);
        setMessage("Erro ao carregar dados do perfil.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/auth/update-profile`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Perfil atualizado com sucesso!");
      setForm({ ...form, password: "" });
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Erro ao atualizar perfil.");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Tem a certeza que pretende eliminar a sua conta? Esta ação é irreversível."
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API_URL}/auth/delete-account`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Conta eliminada com sucesso.");
      localStorage.removeItem("token");
      window.location.href = "/"; // redireciona para a página inicial
    } catch (err) {
      console.error(err);
      alert("Erro ao eliminar conta.");
    }
  };

  if (loading) return <p>A carregar...</p>;

  return (
    <>
      <HeaderPrivate />
      <div className="edit-profile-container">
        <h2>Editar Perfil</h2>

        {message && <p className="message">{message}</p>}

        <form onSubmit={handleSubmit} className="edit-profile-form">
          <label>
            Nome:
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Apelido:
            <input
              type="text"
              name="surname"
              value={form.surname}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Email (não editável):
            <input type="email" name="email" value={form.email} disabled />
          </label>

          <label>
            Cidade:
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
            />
          </label>

          <label>
            País:
            <input
              type="text"
              name="country"
              value={form.country}
              onChange={handleChange}
            />
          </label>

          <label>
            Telefone:
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </label>

          <label>
            Nova Palavra-passe:
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />
          </label>

          <button type="submit">Guardar Alterações</button>

        </form>
          <button
            onClick={handleDeleteAccount}
            className="delete-account-button"
          >
            Eliminar Conta
          </button>

      </div>
    </>
  );
}
