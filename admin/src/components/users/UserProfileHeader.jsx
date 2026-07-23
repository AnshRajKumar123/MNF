import React from 'react'

const UserProfileHeader = ({ user }) => {

    const backendURL = import.meta.env.VITE_API_URL;

    const imageUrl = user.image
        ? `${backendURL}/${user.image.replace(/^\/+/, "")}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
              user.fullName
          )}`;

    return (
        <div className="UserProfileHeader">

            <div className="UserProfileLeft">

                <img
                    src={imageUrl}
                    alt={user.fullName}
                    className="UserProfileImage"
                />

            </div>

            <div className="UserProfileRight">

                <h2>{user.fullName}</h2>

                <p className="UserEmail">
                    <i className="bx bx-envelope"></i>
                    {user.email}
                </p>

                <div className="UserBasicInfo">

                    <div className="InfoItem">
                        <i className="bx bx-phone"></i>
                        <span>
                            {user.dial || ""} {user.phone}
                        </span>
                    </div>

                    <div className="InfoItem">
                        <i className="bx bx-globe"></i>
                        <span>{user.country}</span>
                    </div>

                    <div className="InfoItem">
                        <i className="bx bx-user"></i>
                        <span>{user.gender}</span>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default UserProfileHeader;