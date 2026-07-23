import { useEffect, useState } from "react";
import { getCoupons, createCoupon, updateCoupon, } from "../services/couponService";
import CouponStats from "../components/coupons/CouponStats";
import CouponFilters from "../components/coupons/CouponFilters";
import CouponTable from "../components/coupons/CouponTable";
import CouponFormModal from "../components/coupons/CouponFormModal";
import "../styles/Coupons.css";

const Coupons = () => {

    const [coupons, setCoupons] = useState([]);
    const [stats, setStats] = useState(null);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [status, setStatus] = useState("all");

    const [showModal, setShowModal] = useState(false);

    const [selectedCoupon, setSelectedCoupon] = useState(null);

    const loadCoupons = async () => {

        try {

            setLoading(true);

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

    const handleSubmitCoupon = async (formData) => {

        try {

            if (selectedCoupon) {

                await updateCoupon(
                    selectedCoupon._id,
                    formData
                );

            } else {

                await createCoupon(formData);

            }

            setShowModal(false);

            setSelectedCoupon(null);

            loadCoupons();

        } catch (error) {

            console.log(error);

            alert(
                error?.response?.data?.message ||
                "Something went wrong."
            );

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

            </div>

            <CouponStats stats={stats} />

            <CouponFilters
                search={search}
                setSearch={setSearch}
                status={status}
                setStatus={setStatus}
                onCreate={() => {
                    setSelectedCoupon(null);
                    setShowModal(true);
                }}
            />

            <CouponTable
                coupons={coupons}
                onEdit={(coupon) => {

                    setSelectedCoupon(coupon);

                    setShowModal(true);

                }}
            />

            <CouponFormModal
                open={showModal}
                initialData={selectedCoupon}
                onClose={() => { setShowModal(false); setSelectedCoupon(null); }}
                onSubmit={handleSubmitCoupon}
            />
        </div>

    );

};

export default Coupons;