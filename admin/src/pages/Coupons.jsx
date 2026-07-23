import { useEffect, useState } from "react";
import { getCoupons } from "../services/couponService";
import "../styles/Coupons.css";

const Coupons = () => {

    const [coupons, setCoupons] = useState([]);
    const [stats, setStats] = useState(null);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [status, setStatus] = useState("all");

    const loadCoupons = async () => {

        try {

            const data = await getCoupons({
                search,
                status,
            });

            setCoupons(data.coupons);

            setStats(data.stats);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadCoupons();

    }, [search, status]);

    if (loading) {

        return (
            <div className="CouponLoading">
                Loading Coupons...
            </div>
        );

    }

    return (

        <div className="CouponsPage">

            <div className="CouponPageHeader">

                <div>

                    <h1>Coupons</h1>

                    <p>
                        Manage offers, discounts and promotional campaigns.
                    </p>

                </div>

                <button className="CreateCouponButton">
                    <i className="bx bx-plus"></i>

                    Create Coupon
                </button>

            </div>

        </div>

    );

};

export default Coupons;