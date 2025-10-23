import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import "../css/EditProduct.css";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newFiles, setNewFiles] = useState([]);

  // Buscar produto
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:3000/api/products/${id}`, {
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

  // Atualizar campos
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // Selecionar novas imagens
  const handleFileChange = (e) => {
    setNewFiles([...e.target.files]);
  };

  // Remover imagem existente
  const removeExistingImage = (index) => {
    const updated = [...product.imagens];
    updated.splice(index, 1);
    setProduct({ ...product, imagens: updated });
  };

  // Submeter alterações
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();

      // Campos normais
      const fields = [
        "setor","produto","modelo","marca","distrito","anos","quilometros",
        "horas","preco","descricao","estado"
      ];
      fields.forEach(field => {
        if (product[field] !== undefined) formData.append(field, product[field]);
      });

      // Enviar imagens existentes
      formData.append("imagensExistentes", JSON.stringify(product.imagens || []));

      // Enviar novas imagens
      newFiles.forEach(file => formData.append("imagens", file));

      const res = await axios.patch(
        `http://localhost:3000/api/products/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
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
      <div className="edit-container">
        <h1>Editar Produto</h1>
        <form className="edit-form" onSubmit={handleSubmit}>
          <label>Setor</label>
          <select name="setor" value={product.setor} onChange={handleChange}>
            <option value="Agrícola">Agrícola</option>
            <option value="Construção">Construção</option>
            <option value="Florestal">Florestal</option>
            <option value="Jardinagem">Jardinagem</option>
            <option value="Transporte">Transporte</option>
          </select>

          <label>Produto</label>
          <input name="produto" value={product.produto} onChange={handleChange} />

          <label>Modelo</label>
          <input name="modelo" value={product.modelo || ""} onChange={handleChange} />

          <label>Marca</label>
          <input name="marca" value={product.marca || ""} onChange={handleChange} />

          <label>Distrito</label>
          <input name="distrito" value={product.distrito || ""} onChange={handleChange} />

          <label>Anos</label>
          <input name="anos" type="number" value={product.anos || 0} onChange={handleChange} />

          <label>Quilómetros</label>
          <input name="quilometros" type="number" value={product.quilometros || 0} onChange={handleChange} />

          <label>Horas</label>
          <input name="horas" type="number" value={product.horas || 0} onChange={handleChange} />

          <label>Preço (€)</label>
          <input name="preco" type="number" value={product.preco || 0} onChange={handleChange} />

          <label>Descrição</label>
          <textarea name="descricao" value={product.descricao || ""} onChange={handleChange} />

          <label>Estado</label>
          <select name="estado" value={product.estado || "usado"} onChange={handleChange}>
            <option value="novo">Novo</option>
            <option value="usado">Usado</option>
          </select>

          <label>Alterar / Adicionar Imagens</label>
          <input type="file" multiple onChange={handleFileChange} />

          <div className="existing-images">
            {product.imagens?.map((img, index) => (
              <div key={index} className="image-row">
                <img src={img} alt={`Preview ${index}`} className="edit-preview" />
                <button type="button" onClick={() => removeExistingImage(index)}>Remover</button>
              </div>
            ))}
          </div>

          <button type="submit" className="edit-save-btn">
            Guardar Alterações
          </button>
        </form>
      </div>
    </div>
  );
}
