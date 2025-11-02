import { Link } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";
import "../css/AdminDashboard.css";

export default function AdminDashboard() {
  return (
    <div>
      <AdminHeader />
      
      <div className="admin-dashboard-home">
        <h1>Painel de Administração</h1>
        
        <div className="admin-dashboard-buttons">
          <Link to="/admin/users" className="admin-btn admin-users-btn">
            Gestão de Utilizadores
          </Link>

          <Link to="/admin/products" className="admin-btn admin-products-btn">
            Gestão de Produtos
          </Link>
        </div>
      </div>
    </div>
  );
}
