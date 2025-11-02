import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "../css/AddProduct.css";

export default function AddProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    setor: "",
    produto: "",
    modelo: "",
    marca: "",
    distrito: "",
    anos: "",
    quilometros: "",
    horas: "",
    preco: "",
    descricao: "",
    estado: "",
    imagens: [],
  });

  const [preview, setPreview] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, imagens: files });

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreview(previews);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Precisas de estar autenticado.");
        setLoading(false);
        return;
      }

      // Upload das imagens
      const uploadedImages = [];
      for (const img of formData.imagens) {
        const data = new FormData();
        data.append("image", img);

        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/upload`,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        uploadedImages.push(res.data.url);
      }

      const productData = { ...formData, imagens: uploadedImages };

      await axios.post(`${import.meta.env.VITE_API_URL}/products`, productData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Redireciona para Dashboard com refresh
      navigate("/dashboard", { state: { refresh: true } });
    } catch (err) {
      console.error(err);
      setError("Erro ao criar produto. Verifica os campos e tenta novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header isLoggedIn={true} />

      <div className="add-container">
        <h1>Adicionar Produto</h1>

        {error && <p className="add-error">{error}</p>}

        <form onSubmit={handleSubmit} className="add-form">
          <div className="add-grid">
            {/* Campos do formulário */}
            <div className="add-field">
              <label>Setor *</label>
              <select
                name="setor"
                value={formData.setor}
                onChange={handleChange}
                required
              >
                <option value="">Selecionar</option>
                <option>Agrícola</option>
                <option>Construção</option>
                <option>Florestal</option>
                <option>Jardinagem</option>
                <option>Transporte</option>
              </select>
            </div>

            <div className="add-field">
              <label>Produto *</label>
              <input
                type="text"
                name="produto"
                value={formData.produto}
                onChange={handleChange}
                required
              />
            </div>

            <div className="add-field">
              <label>Marca *</label>
              <input
                type="text"
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                required
              />
            </div>


            <div className="add-field">
              <label>Modelo</label>
              <input
                type="text"
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
              />
            </div>


            <div className="add-field">
              <label>Distrito *</label>
              <input
                type="text"
                name="distrito"
                value={formData.distrito}
                onChange={handleChange}
                required
              />
            </div>

            <div className="add-field">
              <label>Anos</label>
              <input
                type="number"
                name="anos"
                value={formData.anos}
                onChange={handleChange}
                min="0"
              />
            </div>

            <div className="add-field">
              <label>Quilómetros</label>
              <input
                type="number"
                name="quilometros"
                value={formData.quilometros}
                onChange={handleChange}
                min="0"
              />
            </div>

            <div className="add-field">
              <label>Horas *</label>
              <input
                type="number"
                name="horas"
                value={formData.horas}
                onChange={handleChange}
                required
              />
            </div>

            <div className="add-field">
              <label>Preço (€) *</label>
              <input
                type="number"
                name="preco"
                value={formData.preco}
                onChange={handleChange}
                required
              />
            </div>

            <div className="add-field">
              <label>Estado *</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                required
              >
                <option value="">Selecionar</option>
                <option value="novo">Novo</option>
                <option value="usado">Usado</option>
              </select>
            </div>

            <div className="add-field desc-field">
              <label>Descrição</label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows="4"
              ></textarea>
            </div>

            <div className="add-field">
              <label>Imagens</label>
              <input
                type="file"
                name="imagens"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            {preview.length > 0 && (
              <div className="preview-container">
                {preview.map((src, i) => (
                  <img key={i} src={src} alt="Preview" className="preview-img" />
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="add-btn" disabled={loading}>
            {loading ? "A criar..." : "Adicionar Produto"}
          </button>
        </form>
      </div>
    </div>
  );
}
