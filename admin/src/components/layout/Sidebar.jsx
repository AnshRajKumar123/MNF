import { NavLink } from "react-router-dom";

import "../../styles/Sidebar.css";

const Sidebar = () => {

    return (

        <aside className="Sidebar">

            <h2 className="Logo">
                MNF
            </h2>

            <nav>

                <NavLink to="/dashboard">
                    Dashboard
                </NavLink>

                <NavLink to="/products">
                    Products
                </NavLink>

                <NavLink to="/orders">
                    Orders
                </NavLink>

                <NavLink to="/users">
                    Users
                </NavLink>

                <NavLink to="/coupons">
                    Coupons
                </NavLink>

                <NavLink to="/settings">
                    Settings
                </NavLink>

            </nav>

        </aside>

    );

};

export default Sidebar;