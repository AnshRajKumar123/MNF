import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { getUsers } from "../services/userService";
import UserTable from "../components/users/UserTable";
import { getUser } from "../services/userService";
import UserDetailsModal from "../components/users/UserDetailsModal";
import '../styles/Users.css'

const Users = () => {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchUsers = async () => {
        try {

            const data = await getUsers();

            setUsers(data.users);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to load users."
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
                user.fullName.toLowerCase().includes(value) ||
                user.email.toLowerCase().includes(value)
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
                error.response?.data?.message ||
                "Failed to fetch user."
            );

        }

    };

    return (
        <div className="UsersPage">

            <div className="PageHeader">
                <h1>Users</h1>

                <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {loading ? (
                <h3>Loading users...</h3>
            ) : (
                <>
                    <h3>Total Users: {filteredUsers.length}</h3>

                    <UserTable
                        users={filteredUsers}
                        onView={handleView}
                    />
                </>
            )}
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