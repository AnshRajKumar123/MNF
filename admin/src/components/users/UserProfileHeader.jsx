import React from "react";

const UserProfileHeader = ({ user }) => {
    const backendURL = import.meta.env.VITE_API_URL;

    const imageUrl = user?.image
        ? `${backendURL}/${user.image.replace(/^\/+/, "")}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
              user?.fullName || "User"
          )}&background=6366f1&color=fff`;

    return (
        <div className="UserProfileHeader">
            <div className="UserProfileLeft">
                <img
                    src={imageUrl}
                    alt={user?.fullName}
                    className="UserProfileImage"
                    onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user?.fullName || "User"
                        )}&background=6366f1&color=fff`;
                    }}
                />
            </div>

            <div className="UserProfileRight">
                <h2>{user?.fullName || "Guest Customer"}</h2>

                <p className="UserEmail">
                    <i className="bx bx-envelope"></i>
                    {user?.email || "No email provided"}
                </p>

                <div className="UserBasicInfo">
                    <div className="InfoItem">
                        <i className="bx bx-phone"></i>
                        <span>
                            {user?.dial || ""} {user?.phone || "No phone linked"}
                        </span>
                    </div>

                    <div className="InfoItem">
                        <i className="bx bx-globe"></i>
                        <span>{user?.country || "India"}</span>
                    </div>

                    <div className="InfoItem">
                        <i className="bx bx-user"></i>
                        <span>{user?.gender || "Not specified"}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfileHeader;