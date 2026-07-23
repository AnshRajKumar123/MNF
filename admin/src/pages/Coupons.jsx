import { useEffect, useState } from "react";
import { getCoupons, createCoupon, updateCoupon, deleteCoupon, toggleCoupon } from "../services/couponService";
import CouponStats from "../components/coupons/CouponStats";
import CouponFilters from "../components/coupons/CouponFilters";
import CouponTable from "../components/coupons/CouponTable";
import CouponFormModal from "../components/coupons/CouponFormModal";
import DeleteConfirmModal from "../components/coupons/DeleteConfirmModal";
import "../styles/Coupons.css";

const Coupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [showModal, setShowModal] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteCouponId, setDeleteCouponId] = useState(null);

    const loadCoupons = async () => {
        try {
            setLoading(true);
            const data = await getCoupons({ search, status });
            setCoupons(data.coupons || []);
            setStats(data.stats || null);
        } catch (error) {
            console.error("Failed to load coupons:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCoupons();
    }, [search, status]);

    const handleSubmitCoupon = async (formData) => {
        try {
            if (selectedCoupon) {
                await updateCoupon(selectedCoupon._id, formData);
            } else {
                await createCoupon(formData);
            }
            setShowModal(false);
            setSelectedCoupon(null);
            loadCoupons();
        } catch (error) {
            console.error("Error submitting coupon:", error);
            alert(error?.response?.data?.message || "Failed to process coupon operation.");
        }
    };

    const handleDeleteCoupon = async () => {
        try {
            await deleteCoupon(deleteCouponId);
            setDeleteModal(false);
            setDeleteCouponId(null);
            loadCoupons();
        } catch (error) {
            console.error("Error deleting coupon:", error);
            alert(error?.response?.data?.message || "Failed to delete coupon.");
        }
    };

    const handleToggleCoupon = async (coupon) => {
        try {
            await toggleCoupon(coupon._id);
            loadCoupons();
        } catch (error) {
            console.error("Error toggling coupon:", error);
            alert(error?.response?.data?.message || "Unable to update coupon status.");
        }
    };

    if (loading) {
        return (
            <div className="CouponsLoadingState">
                <i className="bx bx-radar bx-spin LoadingIcon"></i>
                <h2>Synchronizing Promotional Matrix...</h2>
                <p>Retrieving active discount campaign parameters</p>
            </div>
        );
    }

    return (
        <div className="CouponsPage">
            {/* PAGE HEADER */}
            <div className="CouponPageHeader">
                <div className="HeaderTitleGroup">
                    <h1>Coupons & Offers</h1>
                    <p>Manage promo codes, percentage discounts, minimum cart limits, and expiry dates</p>
                </div>
            </div>

            {/* METRICS OVERVIEW */}
            <CouponStats stats={stats} />

            {/* CONTROLS & FILTERS */}
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

            {/* DATA TABLE */}
            <CouponTable
                coupons={coupons}
                onEdit={(coupon) => {
                    setSelectedCoupon(coupon);
                    setShowModal(true);
                }}
                onDelete={(coupon) => {
                    setDeleteCouponId(coupon._id);
                    setDeleteModal(true);
                }}
                onToggle={handleToggleCoupon}
            />

            {/* EDIT/CREATE MODAL */}
            <CouponFormModal
                open={showModal}
                initialData={selectedCoupon}
                onClose={() => {
                    setShowModal(false);
                    setSelectedCoupon(null);
                }}
                onSubmit={handleSubmitCoupon}
            />

            {/* DELETE CONFIRMATION DIALOG */}
            <DeleteConfirmModal
                open={deleteModal}
                title="Revoke Campaign Code"
                message="Are you sure you want to delete this coupon? Users will no longer be able to claim this promotion."
                onCancel={() => {
                    setDeleteModal(false);
                    setDeleteCouponId(null);
                }}
                onConfirm={handleDeleteCoupon}
            />
        </div>
    );
};

export default Coupons;