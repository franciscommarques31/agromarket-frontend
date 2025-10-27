const API_URL = import.meta.env.VITE_API_URL;

export const loginUser = async (data) => {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Credenciais Inválidas");
    return res.json();
};

export const registerUser = async (data) => {
    const res = await fetch(`${API_URL}/auth/register`,{
        method:"POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(data),
    });
    if(!res.ok)throw new Error("Erro ao registar");
    return res.json();
};