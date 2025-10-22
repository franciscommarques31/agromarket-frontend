import {Routes, Route} from "react-router-dom";
import Dashboard from "../admin/Dashboard";
import ProductForm from "../admin/ProductForm";
import ProductList from "../admin/ProductList";
import Chat from "../admin/Chat";
import Favorites from "../admin/Favorites";
import Profile from "../admin/Profile";

export default function AdminRoutes () {
    return(
        <Routes>
            <Route path= "/" element={<Dashboard/>}/>
            <Route path="/products" element= {<ProductList/>}/>
            <Route path="/products/new" element={<ProductForm/>}/>
             <Route path="/chat" element={<Chat/>}/>
            <Route path="/favorites" element={<Favorites/>}/>
            <Route path="/profile" element={<Profile/>}/>         
        </Routes>
    );
}