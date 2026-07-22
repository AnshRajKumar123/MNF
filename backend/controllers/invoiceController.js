const PDFDocument = require("pdfkit");
const path = require("path");
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
            margin: 50,
            size: "A4"
        });

        const logoPath = path.join(__dirname, "../assets/logo.png");

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=Invoice-${order._id}.pdf`
        );

        doc.pipe(res);

        // ====================================================
        // HEADER
        // ====================================================

        if (require("fs").existsSync(logoPath)) {
            doc.image(logoPath, 50, 35, {
                width: 65
            });
        }

        doc
            .fillColor("#1A73E8")
            .fontSize(28)
            .text("MIDNIGHT FOOD", 130, 40);

        doc
            .fillColor("#666666")
            .fontSize(12)
            .text(
                "Delicious Food • Fast Delivery",
                130,
                75
            );

        doc
            .moveTo(50, 120)
            .lineTo(550, 120)
            .lineWidth(2)
            .strokeColor("#1A73E8")
            .stroke();

        doc.moveDown(4);

        // ====================================================
        // INVOICE INFORMATION
        // ====================================================

        const invoiceNumber =
            `INV-${new Date().getFullYear()}-${order._id.toString().slice(-6)}`;

        doc
            .fillColor("black")
            .fontSize(22)
            .text("INVOICE");

        doc.moveDown();

        doc.fontSize(11);

        doc.text(`Invoice Number : ${invoiceNumber}`);
        doc.text(`Order ID       : ${order._id}`);
        doc.text(`Date           : ${new Date(order.createdAt).toLocaleString()}`);

        doc.moveDown();

        // ====================================================
        // CUSTOMER
        // ====================================================

        doc
            .fontSize(16)
            .fillColor("#1A73E8")
            .text("Customer Details");

        doc.moveDown(0.5);

        doc
            .fontSize(11)
            .fillColor("black");

        doc.text(`Name : ${order.user?.fullName || "N/A"}`);
        doc.text(`Email : ${order.user?.email || "N/A"}`);

        doc.moveDown();

        // ====================================================
        // ADDRESS
        // ====================================================

        doc
            .fontSize(16)
            .fillColor("#1A73E8")
            .text("Delivery Address");

        doc.moveDown(0.5);

        doc
            .fontSize(11)
            .fillColor("black");

        doc.text(
            `${order.address?.building || ""}, ${order.address?.address || ""}`
        );

        doc.text(`${order.address?.pincode || ""}`);

        doc.moveDown();

        // ====================================================
        // ORDERED ITEMS
        // ====================================================

        doc
            .fontSize(16)
            .fillColor("#1A73E8")
            .text("Ordered Items");

        doc.moveDown();

        const tableTop = doc.y;

        const itemX = 60;
        const qtyX = 330;
        const priceX = 430;

        // Header Background
        doc
            .roundedRect(50, tableTop, 500, 25, 5)
            .fill("#1A73E8");

        doc
            .fillColor("white")
            .fontSize(12);

        doc.text("Item", itemX, tableTop + 7);
        doc.text("Qty", qtyX, tableTop + 7);
        doc.text("Price", priceX, tableTop + 7);

        let y = tableTop + 35;

        order.items.forEach((item, index) => {

            if (index % 2 === 0) {
                doc
                    .roundedRect(50, y - 3, 500, 22, 3)
                    .fill("#F7FAFF");
            }

            doc
                .fillColor("black")
                .fontSize(11);

            doc.text(
                item.product?.name || "Unknown Item",
                itemX,
                y
            );

            doc.text(
                item.quantity.toString(),
                qtyX,
                y
            );

            doc.text(
                `₹${(item.product?.price || 0) * item.quantity}`,
                priceX,
                y
            );

            y += 24;
        });

        doc.y = y + 15;

        // ====================================================
        // PAYMENT SUMMARY
        // ====================================================

        doc
            .fontSize(10)
            .fillColor("#1A73E8")

        doc.moveDown();

        doc
            .fontSize(10)
            .fillColor("black");

        doc
            .fontSize(10)
            .fillColor("#1A73E8")
            .text("Payment Summary");

        doc.moveDown();

        const labelX = 60;
        const valueX = 460;

        const row = (label, value, color = "black") => {
            doc.fillColor(color);
            doc.text(label, labelX, doc.y);
            doc.text(value, valueX, doc.y - 15);
            doc.moveDown();
        };

        row("Subtotal", `₹${order.subtotal}`);
        row("Discount", `-₹${order.discount}`, "green");
        row("Delivery Charge", `₹${order.deliveryCharge}`);
        row("Tip", `₹${order.tip}`);

        doc.moveDown();

        doc
            .moveTo(60, doc.y)
            .lineTo(520, doc.y)
            .strokeColor("#DDDDDD")
            .stroke();

        doc.moveDown();

        doc
            .fillColor("#1A73E8")
            .fontSize(10);

        doc.text("Grand Total", labelX);
        doc.text(`₹${order.totalAmount}`, valueX, doc.y - 22);

        doc.moveDown(2);
        doc.text(`Discount            ₹${order.discount}`);
        doc.text(`Delivery Charge     ₹${order.deliveryCharge}`);
        doc.text(`Tip                 ₹${order.tip}`);

        doc.moveDown();

        doc
            .fontSize(10)
            .fillColor("#1A73E8")
            .text(`Grand Total : ₹${order.totalAmount}`);

        doc.moveDown(2);

        // ====================================================
        // PAYMENT INFO
        // ====================================================

        doc
            .fontSize(10)
            .fillColor("#1A73E8")
            .text("Payment Information");

        doc.moveDown();

        doc
            .fontSize(10)
            .fillColor("black");

        doc.text(`Payment Method : ${order.paymentMethod}`);
        doc.text(`Payment Status : ${order.paymentStatus}`);
        doc.text(`Order Status   : ${order.orderStatus}`);

        doc.moveDown(3);

        // ====================================================
        // FOOTER
        // ====================================================

        doc
            .moveTo(50, doc.y)
            .lineTo(550, doc.y)
            .strokeColor("#CCCCCC")
            .stroke();

        doc.moveDown();

        doc
            .fillColor("#16A34A")
            .fontSize(14)
            .text(
                "Thank you for ordering from MidNight Food",
                {
                    align: "center"
                }
            );

        doc
            .fontSize(10)
            .fillColor("gray")
            .text(
                "support@midnightfood.com",
                {
                    align: "center"
                }
            );

        doc.text(
            "www.midnightfood.com",
            {
                align: "center"
            }
        );

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