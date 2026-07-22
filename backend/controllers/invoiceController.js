const PDFDocument = require("pdfkit");
const Order = require("../models/Order");

const downloadInvoice = async (req, res) => {
    try {

        const { orderId } = req.params;

        const order = await Order.findOne({
            _id: orderId,
            user: req.user.id
        })
            .populate("user")
            .populate("items.product");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        const doc = new PDFDocument({
            margin: 50
        });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=Invoice-${order._id}.pdf`
        );

        doc.pipe(res);

        // ===========================
        // HEADER
        // ===========================

        doc
            .fontSize(28)
            .fillColor("#0A84FF")
            .text("MIDNIGHT FOOD", {
                align: "center"
            });

        doc
            .fontSize(12)
            .fillColor("gray")
            .text("Delicious Food • Fast Delivery", {
                align: "center"
            });

        doc.moveDown(2);

        doc
            .fillColor("black")
            .fontSize(20)
            .text("INVOICE");

        doc.moveDown();

        const invoiceNumber =
            `INV-${new Date().getFullYear()}-${order._id.toString().slice(-6)}`;

        doc.fontSize(12);

        doc.text(`Invoice No : ${invoiceNumber}`);
        doc.text(`Order ID    : ${order._id}`);
        doc.text(`Date        : ${new Date(order.createdAt).toLocaleString()}`);

        doc.moveDown();

        doc
            .moveTo(50, doc.y)
            .lineTo(550, doc.y)
            .strokeColor("#CCCCCC")
            .stroke();

        doc.moveDown();

        // ===========================
        // CUSTOMER DETAILS
        // ===========================

        doc
            .fontSize(16)
            .fillColor("#0A84FF")
            .text("Customer Details");

        doc.moveDown(0.5);

        doc
            .fontSize(12)
            .fillColor("black");

        doc.text(`Name  : ${order.user?.fullName || "N/A"}`);
        doc.text(`Email : ${order.user?.email || "N/A"}`);

        doc.moveDown();

        // ===========================
        // ORDER DETAILS
        // ===========================

        doc
            .fontSize(16)
            .fillColor("#0A84FF")
            .text("Order Details");

        doc.moveDown(0.5);

        doc
            .fontSize(12)
            .fillColor("black");

        doc.text(`Order Status    : ${order.orderStatus}`);
        doc.text(`Payment Method  : ${order.paymentMethod}`);
        doc.text(`Payment Status  : ${order.paymentStatus}`);

        doc.moveDown();

        // ===========================
        // DELIVERY ADDRESS
        // ===========================

        doc
            .fontSize(16)
            .fillColor("#0A84FF")
            .text("Delivery Address");

        doc.moveDown(0.5);

        doc
            .fontSize(12)
            .fillColor("black");

        doc.text(
            `${order.address?.building || ""}, ${order.address?.address || ""}`
        );

        doc.text(`${order.address?.pincode || ""}`);

        doc.moveDown();

        // ===========================
        // TOTAL
        // ===========================

        doc
            .fontSize(16)
            .fillColor("#0A84FF")
            .text("Payment Summary");

        doc.moveDown(0.5);

        doc
            .fontSize(12)
            .fillColor("black");

        doc.text(`Subtotal         : ₹${order.subtotal}`);
        doc.text(`Discount         : ₹${order.discount}`);
        doc.text(`Delivery Charge  : ₹${order.deliveryCharge}`);
        doc.text(`Tip              : ₹${order.tip}`);

        doc.moveDown();

        doc
            .fontSize(18)
            .fillColor("#0A84FF")
            .text(`Grand Total : ₹${order.totalAmount}`);

        doc.moveDown(2);

        doc
            .fontSize(14)
            .fillColor("green")
            .text("Thank you for ordering from MidNight Food ❤️", {
                align: "center"
            });

        doc.end();

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Failed to generate invoice"
        });
    }
};

module.exports = {
    downloadInvoice
};