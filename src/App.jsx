import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddProduct from "./pages/AddProduct";
import { AuthProvider } from "./context/AuthContext";
import Favorites from "./pages/Favorites";
import EditProfile from "./pages/EditProfile";
import Messages from "./pages/Messages";
import ProductDetail from "./pages/ProductDetail";
import EditProductSimple from "./pages/EditProductSimple"; // ✅ Importa a página de edição
import AdminRoutes from "./admin/AdminRoutes"; // importa o painel de admin
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Páginas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Product />} />
          <Route path="/product/:id" element={<ProductDetail />} /> 
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Páginas privadas/backend */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/dashboard/edit/:id" element={<EditProductSimple />} /> {/* ✅ Rota de edição simplificada */}
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
