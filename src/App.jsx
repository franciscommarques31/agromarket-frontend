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
import EditProduct from "./pages/EditProduct";


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

          {/* Páginas privadas/backend */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/dashboard/edit/:id" element={<EditProduct />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/messages" element={<Messages />} /> {/* <-- Rota Mensagens */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
