import React from "react";

const UserAddress = ({ user }) => {
    return (
        <div className="UserAddressCard">
            <div className="SectionHeader">
                <h3>
                    <i className="bx bx-map-pin"></i>
                    Registered Delivery Address
                </h3>
            </div>

            <div className="AddressGrid">
                <div className="AddressItem">
                    <span>Building / House No.</span>
                    <p>{user?.building || "Not Provided"}</p>
                </div>

                <div className="AddressItem">
                    <span>Pincode</span>
                    <p>{user?.pincode || "Not Provided"}</p>
                </div>

                <div className="AddressItem FullWidth">
                    <span>Street Address</span>
                    <p>{user?.address || "Not Provided"}</p>
                </div>

                <div className="AddressItem">
                    <span>Country</span>
                    <p>{user?.country || "India"}</p>
                </div>

                <div className="AddressItem">
                    <span>Gender</span>
                    <p>{user?.gender || "Not Specified"}</p>
                </div>
            </div>
        </div>
    );
};

export default UserAddress;