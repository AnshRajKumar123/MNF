import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { getUsers, getUser } from "../services/userService";
import UserTable from "../components/users/UserTable";
import UserDetailsModal from "../components/users/UserDetailsModal";
import "../styles/Users.css";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data.users || []);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to load user directory."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const value = search.toLowerCase();
            return (
                user.fullName?.toLowerCase().includes(value) ||
                user.email?.toLowerCase().includes(value)
            );
        });
    }, [users, search]);

    const handleView = async (id) => {
        try {
            const data = await getUser(id);
            setSelectedUser(data);
            setShowModal(true);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to fetch user profile."
            );
        }
    };

    if (loading) {
        return (
            <div className="UsersLoadingState">
                <i className="bx bx-radar bx-spin LoadingIcon"></i>
                <h2>Synchronizing User Directory...</h2>
                <p>Retrieving registered customer profiles from database</p>
            </div>
        );
    }

    return (
        <div className="UsersPage">
            {/* PAGE HEADER & CONTROLS */}
            <div className="PageHeader">
                <div className="HeaderTitleGroup">
                    <h1>User Directory</h1>
                    <p>Manage registered customers, review purchase history, and inspect addresses</p>
                </div>

                <div className="PageHeaderActions">
                    <div className="TotalCountPill">
                        <i className="bx bx-group"></i>
                        <span>{filteredUsers.length} Users Registered</span>
                    </div>

                    <div className="SearchInputWrapper">
                        <i className="bx bx-search SearchIcon"></i>
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* USERS TABLE */}
            <UserTable users={filteredUsers} onView={handleView} />

            {/* USER DETAILS INSPECTION MODAL */}
            <UserDetailsModal
                open={showModal}
                data={selectedUser}
                onClose={() => {
                    setShowModal(false);
                    setSelectedUser(null);
                }}
            />
        </div>
    );
};

export default Users;