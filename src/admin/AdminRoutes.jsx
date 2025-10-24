// src/admin/AdminRoutes.jsx
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import AdminUsers from "./AdminUsers";
import AdminProducts from "./AdminProducts";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/users" element={<AdminUsers />} />
      <Route path="/products" element={<AdminProducts />} />
    </Routes>
  );
}