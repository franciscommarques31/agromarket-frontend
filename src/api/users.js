// src/api/users.js
const API_URL = "http://localhost:3000/api/auth";

export const getProfile = async (token) => {
  const res = await fetch(`${API_URL}/me`, {
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Erro ao obter perfil");
  return res.json();
};

export const updateProfile = async (token, data) => {
  const res = await fetch(`${API_URL}/update-profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao atualizar perfil");
  return res.json();
};

export const deleteAccount = async (token) => {
  const res = await fetch(`${API_URL}/delete-account`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Erro ao apagar conta");
  return res.json();
};
