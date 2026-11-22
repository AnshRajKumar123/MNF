const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");
const axios = require("axios"); // Make sure axios is installed: npm install axios
const Order = require("../models/Order");
const sharp = require("sharp");

// Helper function to fetch remote/local image buffer safely
const fetchImageBuffer = async (src) => {
    try {
        if (!src) return null;

        // ==========================
        // Base64 Image
        // ==========================
        if (src.startsWith("data:image")) {
            return Buffer.from(src.split(",")[1], "base64");
        }

        // ==========================
        // Remote Image
        // ==========================
        if (src.startsWith("http://") || src.startsWith("https://")) {

            let buffer = Buffer.from(
                (
                    await axios.get(src, {
                        responseType: "arraybuffer",
                        timeout: 5000
                    })
                ).data
            );

            // Convert AVIF/WebP to PNG
            if (
                src.toLowerCase().endsWith(".avif") ||
                src.toLowerCase().endsWith(".webp")
            ) {
                buffer = await sharp(buffer)
                    .png()
                    .toBuffer();
            }

            return buffer;
        }

        // ==========================
        // Local Image
        // ==========================
        let absolutePath = src;

        if (src.startsWith("/")) {
            absolutePath = path.join(
                __dirname,
                "../../public",
                src
            );
        }

        if (!fs.existsSync(absolutePath)) {
            console.log("Image not found:", absolutePath);
            return null;
        }

        let buffer = fs.readFileSync(absolutePath);

        // Convert AVIF/WebP to PNG
        if (
            absolutePath.toLowerCase().endsWith(".avif") ||
            absolutePath.toLowerCase().endsWith(".webp")
        ) {
            buffer = await sharp(buffer)
                .png()
                .toBuffer();
        }

        return buffer;

    } catch (err) {
        console.error("Image Error:", err);
        return null;
    }
};

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

        // Initialize PDF Document
        const doc = new PDFDocument({
            margin: 40,
            size: "A4"
        });

        const logoPath = path.join(__dirname, "../assets/logo.png");

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=Invoice-${order._id}.pdf`
        );

        doc.pipe(res);

        // --- BRAND COLOR PALETTE ---
        const PRIMARY_COLOR = "#0A1128"; // Deep Oceanic Dark Blue
        const ACCENT_COLOR = "#3A86C8";  // Oceanic Light Blue
        const SUCCESS_COLOR = "#16A34A"; // Emerald Green
        const ALERT_COLOR = "#E53935";   // Red Alert
        const BG_SURFACE = "#F8FAFC";    // Surface Card Fill
        const BORDER_COLOR = "#E2E8F0";  // Table/Card Border Color
        const TEXT_CORE = "#0F172A";     // Primary Dark Text
        const TEXT_MUTED = "#64748B";    // Muted Sub-text

        // ====================================================
        // 1. BRAND HEADER SECTION
        // ====================================================
        doc.rect(40, 30, 515, 4).fill(ACCENT_COLOR);

        if (fs.existsSync(logoPath)) {
            doc.image(logoPath, 40, 45, { width: 55 });
            doc
                .fillColor(PRIMARY_COLOR)
                .fontSize(22)
                .font("Helvetica-Bold")
                .text("MIDNIGHT FOOD", 105, 48);
        } else {
            doc
                .fillColor(PRIMARY_COLOR)
                .fontSize(22)
                .font("Helvetica-Bold")
                .text("MIDNIGHT FOOD", 40, 48);
        }

        doc
            .fillColor(TEXT_MUTED)
            .fontSize(9)
            .font("Helvetica")
            .text("Crave Operations • Fast Midnight Dispatches", 105, 73);

        // Right Header Metadata
        const invoiceNumber = `INV-${new Date().getFullYear()}-${order._id.toString().slice(-6).toUpperCase()}`;

        doc
            .fillColor(PRIMARY_COLOR)
            .fontSize(16)
            .font("Helvetica-Bold")
            .text("TAX INVOICE", 380, 48, { align: "right" });

        doc
            .fillColor(TEXT_MUTED)
            .fontSize(9)
            .font("Helvetica")
            .text(`No: ${invoiceNumber}`, 380, 68, { align: "right" })
            .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 380, 80, { align: "right" });

        doc.y = 105;

        // ====================================================
        // 2. STATUS BADGE & ORDER DETAILS BENTO CARDS
        // ====================================================
        const cardY = doc.y;
        const cardWidth = 250;
        const cardHeight = 85;

        // --- LEFT CARD: CUSTOMER METADATA ---
        doc
            .roundedRect(40, cardY, cardWidth, cardHeight, 8)
            .fillAndStroke(BG_SURFACE, BORDER_COLOR);

        doc
            .fillColor(ACCENT_COLOR)
            .fontSize(10)
            .font("Helvetica-Bold")
            .text("CUSTOMER DETAILS", 52, cardY + 12);

        doc
            .fillColor(TEXT_CORE)
            .fontSize(10)
            .font("Helvetica-Bold")
            .text(order.user?.fullName || "Valued Customer", 52, cardY + 28);

        doc
            .fillColor(TEXT_MUTED)
            .fontSize(9)
            .font("Helvetica")
            .text(order.user?.email || "N/A", 52, cardY + 42)
            .text(`Phone: ${order.user?.phone || "N/A"}`, 52, cardY + 54);

        // --- RIGHT CARD: DISPATCH ADDRESS & BADGE ---
        doc
            .roundedRect(305, cardY, cardWidth, cardHeight, 8)
            .fillAndStroke(BG_SURFACE, BORDER_COLOR);

        doc
            .fillColor(ACCENT_COLOR)
            .fontSize(10)
            .font("Helvetica-Bold")
            .text("DISPATCH ADDRESS", 317, cardY + 12);

        doc
            .fillColor(TEXT_CORE)
            .fontSize(9)
            .font("Helvetica")
            .text(`${order.address?.building || ""}, ${order.address?.address || ""}`, 317, cardY + 28, { width: 140 })
            .text(`Pincode: ${order.address?.pincode || "N/A"}`, 317, cardY + 58);

        // --- DYNAMIC "PAID" STATUS BADGE ---
        const isPaid = (order.paymentStatus || "").toLowerCase() === "paid" || order.paymentMethod === "UPI";
        const badgeColor = isPaid ? SUCCESS_COLOR : ALERT_COLOR;
        const badgeText = isPaid ? "PAID" : "UNPAID";

        doc
            .roundedRect(460, cardY + 12, 80, 22, 11)
            .fill(badgeColor);

        doc
            .fillColor("#FFFFFF")
            .fontSize(9)
            .font("Helvetica-Bold")
            .text(badgeText, 460, cardY + 18, { width: 80, align: "center" });

        doc.y = cardY + cardHeight + 20;

        // ====================================================
        // 3. STRUCTURED ITEMS TABLE WITH PRODUCT IMAGES
        // ====================================================
        const tableTop = doc.y;
        const colImageX = 48;
        const colItemX = 80;
        const colQtyX = 330;
        const colPriceX = 400;
        const colTotalX = 475;
        const rowHeight = 32; // Slightly taller rows to accommodate thumbnails nicely

        // Table Header Fill
        doc
            .roundedRect(40, tableTop, 515, 26, 4)
            .fill(PRIMARY_COLOR);

        doc
            .fillColor("#FFFFFF")
            .fontSize(9)
            .font("Helvetica-Bold");

        doc.text("ITEM DESCRIPTION", colItemX, tableTop + 8);
        doc.text("QTY", colQtyX, tableTop + 8, { width: 40, align: "center" });
        doc.text("RATE", colPriceX, tableTop + 8, { width: 65, align: "right" });
        doc.text("AMOUNT", colTotalX, tableTop + 8, { width: 65, align: "right" });

        let currentY = tableTop + 26;

        // Fetch product images asynchronously before rendering rows
        const imageBuffers = await Promise.all(
            order.items.map((item) => fetchImageBuffer(item.product?.image))
        );

        console.log(imageBuffers);

        // Table Rows Iteration
        order.items.forEach((item, index) => {

            console.log("Image field:", item.product?.image);
            console.log("Type:", typeof item.product?.image);
            console.log("Product:", item.product);

            console.dir(item.product?.image, { depth: null });

            const itemTotal = (item.product?.price || 0) * item.quantity;
            const imgBuffer = imageBuffers[index];

            // Zebra Striping Fill
            if (index % 2 === 0) {
                doc.rect(40, currentY, 515, rowHeight).fill("#F1F5F9");
            } else {
                doc.rect(40, currentY, 515, rowHeight).fill("#FFFFFF");
            }

            // Outer Border Frame Lines
            doc
                .rect(40, currentY, 515, rowHeight)
                .strokeColor(BORDER_COLOR)
                .stroke();

            // 🖼️ PRODUCT THUMBNAIL RENDER

            if (imgBuffer) {
                try {

                    doc.image(imgBuffer, colImageX, currentY + 4, {
                        fit: [24, 24],
                        align: "center",
                        valign: "center",
                    });

                } catch (err) {

                    console.log("Render Error:", err.message);

                    doc
                        .roundedRect(colImageX, currentY + 4, 24, 24, 4)
                        .fillAndStroke("#E2E8F0", BORDER_COLOR);

                }
            } else {

                doc
                    .roundedRect(colImageX, currentY + 4, 24, 24, 4)
                    .fillAndStroke("#E2E8F0", BORDER_COLOR);

            }

            // Item Name & Numbers
            doc
                .fillColor(TEXT_CORE)
                .fontSize(9)
                .font("Helvetica");

            doc.text(item.product?.name || "Unknown Product", colItemX, currentY + 11, { width: 235, height: 14, ellipsis: true });
            doc.text(item.quantity.toString(), colQtyX, currentY + 11, { width: 40, align: "center" });
            doc.text(`INR ${item.product?.price || 0}`, colPriceX, currentY + 11, { width: 65, align: "right" });
            doc.text(`INR ${itemTotal}`, colTotalX, currentY + 11, { width: 65, align: "right" });

            currentY += rowHeight;
        });

        doc.y = currentY + 15;

        // ====================================================
        // 4. FINANCIAL SUMMARY LEDGER
        // ====================================================
        const summaryStartY = doc.y;

        // Left Box: Payment Details
        doc
            .roundedRect(40, summaryStartY, 240, 95, 6)
            .fillAndStroke(BG_SURFACE, BORDER_COLOR);

        doc
            .fillColor(ACCENT_COLOR)
            .fontSize(9)
            .font("Helvetica-Bold")
            .text("PAYMENT INFORMATION", 52, summaryStartY + 12);

        doc
            .fillColor(TEXT_MUTED)
            .fontSize(8.5)
            .font("Helvetica")
            .text(`Payment Method : `, 52, summaryStartY + 30)
            .text(`Payment Status : `, 52, summaryStartY + 44)
            .text(`Delivery Protocol: `, 52, summaryStartY + 58);

        doc
            .fillColor(TEXT_CORE)
            .font("Helvetica-Bold")
            .text(`${order.paymentMethod || "COD"}`, 135, summaryStartY + 30)
            .text(`${order.paymentStatus || "Pending"}`, 135, summaryStartY + 44)
            .text(`${order.deliveryType || "Standard"}`, 135, summaryStartY + 58);

        // Right Box: Financial Breakdown
        const drawCostRow = (label, value, yPos, isBold = false, color = TEXT_CORE) => {
            doc
                .fillColor(color)
                .fontSize(isBold ? 11 : 9)
                .font(isBold ? "Helvetica-Bold" : "Helvetica");

            doc.text(label, 320, yPos);
            doc.text(value, 440, yPos, { width: 100, align: "right" });
        };

        drawCostRow("Subtotal", `INR ${order.subtotal || 0}`, summaryStartY + 5);
        drawCostRow("Discount Applied", `- INR ${order.discount || 0}`, summaryStartY + 20, false, SUCCESS_COLOR);
        drawCostRow("Delivery Charge", `INR ${order.deliveryCharge || 0}`, summaryStartY + 35);
        drawCostRow("Rider Tip", `INR ${order.tip || 0}`, summaryStartY + 50);

        doc
            .moveTo(320, summaryStartY + 68)
            .lineTo(545, summaryStartY + 68)
            .strokeColor(BORDER_COLOR)
            .stroke();

        // Grand Total Highlight Bar
        doc
            .roundedRect(310, summaryStartY + 74, 245, 26, 4)
            .fill(PRIMARY_COLOR);

        doc
            .fillColor("#FFFFFF")
            .fontSize(11)
            .font("Helvetica-Bold")
            .text("Grand Total", 320, summaryStartY + 82)
            .text(`INR ${order.totalAmount || 0}`, 440, summaryStartY + 82, { width: 105, align: "right" });

        doc.y = summaryStartY + 120;

        // ====================================================
        // 5. FOOTER & DISCLAIMER
        // ====================================================
        const footerY = 740;

        doc
            .moveTo(40, footerY)
            .lineTo(555, footerY)
            .strokeColor(BORDER_COLOR)
            .stroke();

        doc
            .fillColor(SUCCESS_COLOR)
            .fontSize(11)
            .font("Helvetica-Bold")
            .text("Thank you for ordering from MidNight Food!", 40, footerY + 12, { align: "center" });

        doc
            .fillColor(TEXT_MUTED)
            .fontSize(8)
            .font("Helvetica")
            .text("This is an electronically generated receipt. No physical signature is required.", 40, footerY + 28, { align: "center" })
            .text("Support: support@midnightfood.com • Web: www.midnightfood.com", 40, footerY + 40, { align: "center" });

        doc.end();

    } catch (error) {
        console.error("PDF Invoice Exception:", error);
        res.status(500).json({
            success: false,
            message: "Failed to generate invoice"
        });
    }
};

module.exports = {
    downloadInvoice
};