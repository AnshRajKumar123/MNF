import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

import "../../styles/AdminLayout.css";

const AdminLayout = () => {
    return (
        <div className="AdminLayout">
            <Sidebar />
            <div className="AdminContent">
                <Navbar />
                <main className="AdminMain">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;