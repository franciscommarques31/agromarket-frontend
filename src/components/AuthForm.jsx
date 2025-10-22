import { useState } from "react";

export default function AuthForm({ type, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {type === "register" && (
        <>
          <input name="name" placeholder="Nome" onChange={handleChange} />
          <input name="surname" placeholder="Apelido" onChange={handleChange} />
        </>
      )}
      <input name="email" type="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />
      <button type="submit">{type === "login" ? "Entrar" : "Registar"}</button>
    </form>
  );
}
