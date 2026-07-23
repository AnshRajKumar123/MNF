import Button from "../ui/Button";

const UserTable = ({ users, onView }) => {

    const backendURL = import.meta.env.VITE_API_URL;

    return (
        <div className="TableWrapper">

            <table className="AdminTable">

                <thead>
                    <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Total Orders</th>
                        <th>Total Spent</th>
                        <th>Joined</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>

                    {users.length === 0 ? (
                        <tr>
                            <td
                                colSpan="6"
                                style={{ textAlign: "center" }}
                            >
                                No users found.
                            </td>
                        </tr>
                    ) : (

                        users.map((user) => {

                            const imageUrl = user.image
                                ? `${backendURL}${user.image}`
                                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    user.fullName
                                )}`;

                            return (
                                <tr key={user._id}>

                                    <td>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "12px",
                                            }}
                                        >

                                            <img
                                                src={imageUrl}
                                                alt={user.fullName}
                                                style={{
                                                    width: "42px",
                                                    height: "42px",
                                                    borderRadius: "50%",
                                                    objectFit: "cover",
                                                }}
                                            />

                                            <div>
                                                <strong>{user.fullName}</strong>
                                            </div>

                                        </div>
                                    </td>

                                    <td>{user.email}</td>

                                    <td>{user.totalOrders}</td>

                                    <td>₹{user.totalSpent.toFixed(2)}</td>

                                    <td>
                                        {new Date(
                                            user.createdAt
                                        ).toLocaleDateString()}
                                    </td>

                                    <td>
                                        <Button
                                            onClick={() => onView(user._id)}
                                        >
                                            View
                                        </Button>
                                    </td>

                                </tr>
                            );

                        })

                    )}

                </tbody>

            </table>

        </div>
    );
};

export default UserTable;