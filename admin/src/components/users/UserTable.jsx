import React from "react";
import Button from "../ui/Button";
import { getImageUrl } from "../../utils/getImageUrl";

const UserTable = ({ users, onView }) => {

    return (
        <div className="TableWrapper">
            <table className="AdminTable">
                <thead>
                    <tr>
                        <th>Users</th>
                        <th>Email Node</th>
                        <th>Total Orders</th>
                        <th>Total Spent</th>
                        <th>Joined Date</th>
                        <th className="TextRight">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="EmptyTableMessage">
                                <i className="bx bx-user-x"></i>
                                <p>No registered users found matching the query.</p>
                            </td>
                        </tr>
                    ) : (
                        users.map((user) => {
                            const defaultImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                user.fullName || "User"
                            )}&background=6366f1&color=fff`;

                            const imageUrl = user.image
                                ? getImageUrl(user.image)
                                : defaultImage;

                            return (
                                <tr key={user._id}>
                                    <td>
                                        <div className="UserTableCell">
                                            <img
                                                src={imageUrl}
                                                alt={user.fullName}
                                                className="UserTableAvatar"
                                                onError={(e) => {
                                                    e.target.src = defaultImage;
                                                }}
                                            />
                                            <div className="UserTableMeta">
                                                <strong className="UserTableName">
                                                    {user.fullName || "Unnamed Customer"}
                                                </strong>
                                                <span className="UserTableRole">{user.isAdmin ? "Administrator" : "Customer"}</span>
                                            </div>
                                        </div>
                                    </td>

                                    <td>
                                        <span className="UserEmailText">{user.email}</span>
                                    </td>

                                    <td>
                                        <span className="OrdersBadge">
                                            <i className="bx bx-shopping-bag"></i> {user.totalOrders || 0}
                                        </span>
                                    </td>

                                    <td>
                                        <span className="SpendingText">
                                            ₹{(user.totalSpent || 0).toLocaleString("en-IN", {
                                                minimumFractionDigits: 2,
                                            })}
                                        </span>
                                    </td>

                                    <td>
                                        <span className="DateText">
                                            {new Date(user.createdAt).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </td>

                                    <td className="TextRight">
                                        <button
                                            className="ViewUserBtn"
                                            onClick={() => onView(user._id)}
                                        >
                                            <i className="bx bx-show"></i> Inspect Profile
                                        </button>
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