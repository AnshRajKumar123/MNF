import { useEffect, useState } from "react";

import { getBanners, createBanner, updateBanner, deleteBanner, } from "../services/bannerService";

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

            setBanners(data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadBanners();

    }, []);

    // Create Banner
    const handleSubmit = async (formData) => {

        try {

            if (editingBanner) {

                await updateBanner(
                    editingBanner._id,
                    formData
                );

            } else {

                await createBanner(formData);

            }

            await loadBanners();

            setEditingBanner(null);

            setOpenModal(false);

        } catch (error) {

            console.error(error);

        }

    };

    const handleEdit = (banner) => {

        setEditingBanner(banner);

        setOpenModal(true);

    };

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Delete this banner?"
        );

        if (!confirmDelete) return;

        try {

            await deleteBanner(id);

            await loadBanners();

        } catch (error) {

            console.error(error);

        }

    };

    if (loading) {

        return (

            <div className="LoadingWrapper">

                <h2>Loading banners...</h2>

            </div>

        );

    }

    return (

        <div className="BannerPage">

            <div className="PageHeader">

                <h1>Banner Management</h1>

                <button
                    className="PrimaryBtn"
                    onClick={() => {

                        setEditingBanner(null);
                        setOpenModal(true);

                    }}
                >
                    Add Banner
                </button>

            </div>

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

                        <i className="bx bx-images"></i>

                        <h2>No Banners Yet</h2>

                        <p>
                            Create your first promotional banner to showcase offers.
                        </p>

                    </div>

                )}

            </div>

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