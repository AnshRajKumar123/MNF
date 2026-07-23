const UserAddress = ({ user }) => {

    return (
        <div className="UserAddressCard">

            <div className="SectionHeader">

                <h3>
                    <i className="bx bx-map"></i>
                    Delivery Address
                </h3>

            </div>

            <div className="AddressGrid">

                <div className="AddressItem">

                    <span>Building</span>

                    <p>
                        {user.building || "Not Available"}
                    </p>

                </div>

                <div className="AddressItem">

                    <span>Pincode</span>

                    <p>
                        {user.pincode || "Not Available"}
                    </p>

                </div>

                <div className="AddressItem FullWidth">

                    <span>Address</span>

                    <p>
                        {user.address || "Not Available"}
                    </p>

                </div>

                <div className="AddressItem">

                    <span>Country</span>

                    <p>
                        {user.country || "Not Available"}
                    </p>

                </div>

                <div className="AddressItem">

                    <span>Gender</span>

                    <p>
                        {user.gender || "Not Available"}
                    </p>

                </div>

            </div>

        </div>
    );

};

export default UserAddress;