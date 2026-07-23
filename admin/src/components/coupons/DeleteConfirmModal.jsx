import React from "react";

const DeleteConfirmModal = ({
    open,
    title = "Delete Campaign",
    message = "Are you sure you want to permanently delete this coupon?",
    onCancel,
    onConfirm,
}) => {
    if (!open) return null;

    return (
        <div className="DeleteModalOverlay" onClick={onCancel}>
            <div className="DeleteModal" onClick={(e) => e.stopPropagation()}>
                <div className="DeleteShieldIcon">
                    <i className="bx bx-trash"></i>
                </div>

                <h2>{title}</h2>
                <p>{message}</p>

                <div className="DeleteModalButtons">
                    <button className="CancelBtn" onClick={onCancel}>
                        Cancel
                    </button>

                    <button className="DeleteBtn" onClick={onConfirm}>
                        Confirm Revoke
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;