
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import "../css/EditProductSimple.css";

export default function EditProductSimple() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProduct(res.data);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar produto");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const fields = [
        "setor", "produto", "modelo", "marca", "distrito",
        "anos", "quilometros", "horas", "preco", "descricao", "estado"
      ];

      const updatedData = {};
      fields.forEach(field => {
        if (product[field] !== undefined) updatedData[field] = product[field];
      });

      await axios.patch(
        `${import.meta.env.VITE_API_URL}/products/${id}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Produto atualizado com sucesso!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar produto");
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Produto não encontrado</p>;

  return (
    <div>
      <Header isLoggedIn={true} />
      <div className="edit-simple-container">
        <h1>Editar Produto</h1>
        <form className="edit-simple-form" onSubmit={handleSubmit}>
          <div className="edit-simple-field">
            <label>Setor</label>
            <select name="setor" value={product.setor} onChange={handleChange}>
              <option value="Agrícola">Agrícola</option>
              <option value="Construção">Construção</option>
              <option value="Florestal">Florestal</option>
              <option value="Jardinagem">Jardinagem</option>
              <option value="Transporte">Transporte</option>
            </select>
          </div>

          <div className="edit-simple-field">
            <label>Produto</label>
            <input name="produto" value={product.produto} onChange={handleChange} />
          </div>

          <div className="edit-simple-field">
            <label>Modelo</label>
            <input name="modelo" value={product.modelo || ""} onChange={handleChange} />
          </div>

          <div className="edit-simple-field">
            <label>Marca</label>
            <input name="marca" value={product.marca || ""} onChange={handleChange} />
          </div>

          <div className="edit-simple-field">
            <label>Distrito</label>
            <input name="distrito" value={product.distrito || ""} onChange={handleChange} />
          </div>

          <div className="edit-simple-field">
            <label>Anos</label>
            <input name="anos" type="number" value={product.anos || 0} onChange={handleChange} />
          </div>

          <div className="edit-simple-field">
            <label>Quilómetros</label>
            <input name="quilometros" type="number" value={product.quilometros || 0} onChange={handleChange} />
          </div>

          <div className="edit-simple-field">
            <label>Horas</label>
            <input name="horas" type="number" value={product.horas || 0} onChange={handleChange} />
          </div>

          <div className="edit-simple-field">
            <label>Preço (€)</label>
            <input name="preco" type="number" value={product.preco || 0} onChange={handleChange} />
          </div>

          <div className="edit-simple-field edit-simple-desc-field">
            <label>Descrição</label>
            <textarea name="descricao" value={product.descricao || ""} onChange={handleChange} />
          </div>

          <div className="edit-simple-field">
            <label>Estado</label>
            <select name="estado" value={product.estado || "usado"} onChange={handleChange}>
              <option value="novo">Novo</option>
              <option value="usado">Usado</option>
            </select>
          </div>

          <button type="submit" className="edit-simple-btn">
            Guardar Alterações
          </button>
        </form>
      </div>
    </div>
  );
}
