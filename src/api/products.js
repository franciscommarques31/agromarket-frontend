// src/api/product.js
const API_URL = import.meta.env.VITE_API_URL;

export const getAllProducts = async () => {
  const res = await fetch(`${API_URL}`);
  if (!res.ok) throw new Error("Erro ao obter produtos");
  return res.json();
};

export const createProduct = async (token, data) => {
  const res = await fetch(`${API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao criar produto");
  return res.json();
};
