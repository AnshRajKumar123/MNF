import { API_URL } from "../../config/api";

const BannerCard = ({
    banner,
    onEdit,
    onDelete,
}) => {

    return (

        <div className="BannerCard">

            <img
                src={`${API_URL}${banner.image}`}
                alt={banner.title}
            />

            <div className="BannerContent">

                <h3>{banner.title}</h3>

                <p>{banner.subtitle}</p>

                <span>
                    Priority #{banner.priority}
                </span>

            </div>

            <div className="BannerStatus">

                {banner.active ? (

                    <span className="ActiveBadge">
                        Active
                    </span>

                ) : (

                    <span className="InactiveBadge">
                        Inactive
                    </span>

                )}

            </div>

            <div className="BannerActions">

                <button
                    className="EditBtn"
                    onClick={() => onEdit(banner)}
                >
                    <i className="bx bx-edit"></i>
                    Edit
                </button>

                <button
                    className="DeleteBtn"
                    onClick={() => onDelete(banner._id)}
                >
                    <i className="bx bx-trash"></i>
                    Delete
                </button>

            </div>

        </div>

    );

};

export default BannerCard;