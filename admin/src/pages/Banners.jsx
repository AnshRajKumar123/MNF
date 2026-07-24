import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getBanners, createBanner, updateBanner, deleteBanner } from "../services/bannerService";
import BannerCard from "../components/banner/BannerCard";
import BannerModal from "../components/banner/BannerModal";
import "../styles/Banners.css";

const Banners = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);

    // Load all banners
    const loadBanners = async () => {
        try {
            const data = await getBanners();
            setBanners(data || []);
        } catch (error) {
            console.error("Error loading banners:", error);
            toast.error("Failed to load banner promotions.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBanners();
    }, []);

    // Create / Update Banner
    const handleSubmit = async (formData) => {
        try {
            if (editingBanner) {
                await updateBanner(editingBanner._id, formData);
                toast.success("Banner updated successfully!");
            } else {
                await createBanner(formData);
                toast.success("New promo banner created!");
            }

            await loadBanners();
            setEditingBanner(null);
            setOpenModal(false);
        } catch (error) {
            console.error("Error saving banner:", error);
            toast.error(error.response?.data?.message || "Failed to save banner.");
        }
    };

    const handleEdit = (banner) => {
        setEditingBanner(banner);
        setOpenModal(true);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this promotional banner?");
        if (!confirmDelete) return;

        try {
            await deleteBanner(id);
            toast.success("Banner removed.");
            await loadBanners();
        } catch (error) {
            console.error("Error deleting banner:", error);
            toast.error("Failed to delete banner.");
        }
    };

    if (loading) {
        return (
            <div className="BannersLoadingState">
                <i className="bx bx-radar bx-spin LoadingIcon"></i>
                <h2>Synchronizing Banner Network...</h2>
                <p>Retrieving active promotional slider campaigns from server</p>
            </div>
        );
    }

    return (
        <div className="BannerPage">
            {/* PAGE HEADER */}
            <div className="PageHeader">
                <div className="HeaderTitleGroup">
                    <h1>Banner Management</h1>
                    <p>Configure homepage hero sliders, promotional graphics, priority queues, and CTA links</p>
                </div>

                <button
                    className="PrimaryBtn"
                    onClick={() => {
                        setEditingBanner(null);
                        setOpenModal(true);
                    }}
                >
                    <i className="bx bx-plus-circle"></i>
                    <span>Add New Banner</span>
                </button>
            </div>

            {/* BANNERS BENTO GRID */}
            <div className="BannerGrid">
                {banners.length > 0 ? (
                    banners.map((banner) => (
                        <BannerCard
                            key={banner._id}
                            banner={banner}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))
                ) : (
                    <div className="EmptyBanner">
                        <i className="bx bx-images bigIcons"></i>
                        <h2>No Promotional Banners Active</h2>
                        <p>Create your first promo banner to showcase special offers and discounts on the mobile and web homepages.</p>
                        <button
                            className="PrimaryBtn"
                            style={{ marginTop: "1rem" }}
                            onClick={() => {
                                setEditingBanner(null);
                                setOpenModal(true);
                            }}
                        >
                            <i className="bx bx-plus"></i> Launch Banner
                        </button>
                    </div>
                )}
            </div>

            {/* FORM MODAL */}
            <BannerModal
                open={openModal}
                editingBanner={editingBanner}
                onClose={() => {
                    setOpenModal(false);
                    setEditingBanner(null);
                }}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default Banners;