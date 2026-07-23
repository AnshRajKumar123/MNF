const DeleteConfirmModal = ({
    open,
    title = "Delete",
    message = "Are you sure?",
    onCancel,
    onConfirm,
}) => {

    if (!open) return null;

    return (

        <div className="DeleteModalOverlay">

            <div className="DeleteModal">

                <i className="bx bx-error-circle DeleteIcon"></i>

                <h2>{title}</h2>

                <p>{message}</p>

                <div className="DeleteModalButtons">

                    <button
                        className="CancelBtn"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>

                    <button
                        className="DeleteBtn"
                        onClick={onConfirm}
                    >
                        Delete
                    </button>

                </div>

            </div>

        </div>

    );

};

export default DeleteConfirmModal;