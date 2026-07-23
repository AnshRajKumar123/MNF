import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Users from "./pages/Users";
import Coupons from "./pages/Coupons";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminLayout from "./components/layout/AdminLayout";

function App() {

    return (

        <Routes>

            <Route path="/" element={<Login />} />

            <Route element={<ProtectedRoute />}>

                <Route element={<AdminLayout />}>

                    <Route path="/dashboard" element={<Dashboard />} />

                    <Route path="/products" element={<Products />} />

                    <Route path="/orders" element={<Orders />} />

                    <Route path="/users" element={<Users />} />

                    <Route path="/coupons" element={<Coupons />} />

                </Route>

            </Route>

            <Route path="*" element={<NotFound />} />

        </Routes>

    );

}

export default App;