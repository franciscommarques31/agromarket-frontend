const API_URL = "http://localhost:3000/api";

// ================= USERS =================
export const getAllUsers = async (token) => {
  const res = await fetch(`${API_URL}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Erro ao obter utilizadores");
  return res.json();
};

export const updateUser = async (token, userId, data) => {
  const res = await fetch(`${API_URL}/admin/users/${userId}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao atualizar utilizador");
  return res.json();
};

export const deleteUser = async (token, userId) => {
  const res = await fetch(`${API_URL}/admin/users/${userId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Erro ao apagar utilizador");
  return res.json();
};

// ================= PRODUCTS =================
export const getAllProducts = async (token) => {
  const res = await fetch(`${API_URL}/admin/products`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Erro ao obter produtos");
  return res.json();
};

export const updateProduct = async (token, productId, data) => {
  const res = await fetch(`${API_URL}/admin/products/${productId}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao atualizar produto");
  return res.json();
};

export const deleteProduct = async (token, productId) => {
  const res = await fetch(`${API_URL}/admin/products/${productId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Erro ao apagar produto");
  return res.json();
};
