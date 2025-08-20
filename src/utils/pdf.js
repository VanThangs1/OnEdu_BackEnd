// src/utils/pdf.js
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

/**
 * data mẫu truyền vào:
 * {
 *   title: "HÓA ĐƠN BÁN HÀNG",
 *   shop: { name: "My Shop", address: "123 ABC", phone: "0123 456 789" },
 *   customer: { name: "Nguyễn Văn A", phone: "0987 654 321", address: "Hà Nội" },
 *   invoice: { code: "INV-0001", date: "2025-08-20" },
 *   items: [
 *     { name: "Sản phẩm 1", qty: 2, price: 150000 },
 *     { name: "Sản phẩm 2", qty: 1, price: 99000 },
 *   ],
 *   note: "Cảm ơn quý khách!",
 *   currency: "VND",
 *   totals: { subTotal: 399000, discount: 0, shipping: 0, grandTotal: 399000 }
 * }
 */

function formatMoney(n = 0) {
  return n.toLocaleString("vi-VN");
}

function drawHeader(doc, data) {
  const { title = "HÓA ĐƠN", shop = {}, invoice = {} } = data;

  doc
    .fontSize(18)
    .font("Helvetica-Bold")
    .text(title, { align: "center" })
    .moveDown(0.5);

  doc
    .fontSize(10)
    .font("Helvetica")
    .text(shop.name || "Tên cửa hàng")
    .text(shop.address || "Địa chỉ")
    .text(shop.phone ? `Điện thoại: ${shop.phone}` : "")
    .moveDown(0.5);

  const top = doc.y;
  const rightX = 400;

  doc
    .fontSize(10)
    .text(`Mã hóa đơn: ${invoice.code || "-"}`, rightX, top, { align: "left" })
    .text(`Ngày: ${invoice.date || new Date().toISOString().slice(0, 10)}`, rightX, doc.y);

  doc.moveDown(0.5);
  doc.strokeColor("#cccccc").moveTo(50, doc.y).lineTo(545, doc.y).stroke();
  doc.moveDown(0.7);
}

function drawCustomer(doc, data) {
  const { customer = {} } = data;

  doc
    .font("Helvetica-Bold")
    .text("Khách hàng")
    .font("Helvetica")
    .text(`Tên: ${customer.name || "-"}`)
    .text(`Điện thoại: ${customer.phone || "-"}`)
    .text(`Địa chỉ: ${customer.address || "-"}`)
    .moveDown(0.5);

  doc.strokeColor("#cccccc").moveTo(50, doc.y).lineTo(545, doc.y).stroke();
  doc.moveDown(0.7);
}

function drawTableHeader(doc) {
  const y = doc.y;
  doc.font("Helvetica-Bold").fontSize(10);
  doc.text("STT", 55, y, { width: 30 });
  doc.text("Sản phẩm", 95, y, { width: 220 });
  doc.text("SL", 325, y, { width: 40, align: "right" });
  doc.text("Đơn giá", 375, y, { width: 80, align: "right" });
  doc.text("Thành tiền", 465, y, { width: 80, align: "right" });
  doc.moveDown(0.4);
  doc.strokeColor("#cccccc").moveTo(50, doc.y).lineTo(545, doc.y).stroke();
  doc.moveDown(0.3);
  doc.font("Helvetica");
}

function drawItems(doc, data) {
  const { items = [], currency = "VND" } = data;
  let index = 1;

  items.forEach((it) => {
    const y = doc.y;
    const lineHeight = 16;

    // Tự xuống trang nếu sắp hết chỗ
    if (y > 720) {
      doc.addPage();
      drawTableHeader(doc);
    }

    doc.text(String(index++), 55, y, { width: 30 });
    doc.text(it.name || "-", 95, y, { width: 220 });
    doc.text(String(it.qty || 0), 325, y, { width: 40, align: "right" });
    doc.text(formatMoney(it.price || 0), 375, y, { width: 80, align: "right" });
    const amount = (it.qty || 0) * (it.price || 0);
    doc.text(`${formatMoney(amount)} ${currency}`, 465, y, { width: 80, align: "right" });

    doc.moveDown(0.2);
  });

  doc.moveDown(0.4);
  doc.strokeColor("#cccccc").moveTo(50, doc.y).lineTo(545, doc.y).stroke();
  doc.moveDown(0.5);
}

function drawTotals(doc, data) {
  const { totals = {}, currency = "VND" } = data;
  const rightLabelX = 375;
  const rightValueX = 465;
  const lineH = 16;

  const rows = [
    ["Tạm tính", totals.subTotal ?? 0],
    ["Giảm giá", totals.discount ?? 0],
    ["Phí vận chuyển", totals.shipping ?? 0],
  ];

  doc.fontSize(10).font("Helvetica");
  rows.forEach(([label, value]) => {
    doc.text(label, rightLabelX, doc.y, { width: 80, align: "right" });
    doc.text(`${formatMoney(value)} ${currency}`, rightValueX, doc.y, { width: 80, align: "right" });
    doc.moveDown(0.2);
  });

  doc.moveDown(0.2);
  doc.strokeColor("#cccccc").moveTo(360, doc.y).lineTo(545, doc.y).stroke();
  doc.moveDown(0.2);

  doc.font("Helvetica-Bold");
  doc.text("Tổng cộng", rightLabelX, doc.y, { width: 80, align: "right" });
  doc.text(`${formatMoney(totals.grandTotal ?? totals.subTotal ?? 0)} ${currency}`, rightValueX, doc.y, {
    width: 80,
    align: "right",
  });
  doc.font("Helvetica");
  doc.moveDown(0.6);
}

function drawFooter(doc, data) {
  if (data.note) {
    doc
      .font("Helvetica-Oblique")
      .fontSize(10)
      .text(data.note, 50, doc.y, { width: 495, align: "center" })
      .moveDown(0.5);
  }

  doc.moveDown(1.2);
  const y = doc.y;
  doc.text("Người bán", 120, y, { align: "center" });
  doc.text("Người mua", 420, y, { align: "center" });

  // Phần ký
  doc.moveDown(3);
  doc.text("(Ký, ghi rõ họ tên)", 100, doc.y, { width: 150, align: "center" });
  doc.text("(Ký, ghi rõ họ tên)", 400, doc.y, { width: 150, align: "center" });
}

/**
 * Tạo PDF và trả về Buffer (Promise<Buffer>)
 */
function createInvoiceBuffer(data = {}) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Vẽ nội dung
    drawHeader(doc, data);
    drawCustomer(doc, data);
    drawTableHeader(doc);
    drawItems(doc, data);
    drawTotals(doc, data);
    drawFooter(doc, data);

    doc.end();
  });
}

/**
 * Ghi PDF ra file (Promise<string>)
 * return: absolute file path
 */
async function createInvoiceFile(data = {}, outputPath = null) {
  const buffer = await createInvoiceBuffer(data);
  const fileName = `${(data?.invoice?.code || "invoice").replace(/[^\w-]/g, "_")}.pdf`;
  const finalPath =
    outputPath && path.isAbsolute(outputPath)
      ? outputPath
      : path.join(process.cwd(), "exports", fileName);

  // đảm bảo thư mục tồn tại
  fs.mkdirSync(path.dirname(finalPath), { recursive: true });
  fs.writeFileSync(finalPath, buffer);
  return finalPath;
}

/**
 * Stream PDF về HTTP response (Express)
 * res: express.Response
 */
async function sendInvoiceResponse(res, data = {}, fileName = "invoice.pdf") {
  const buffer = await createInvoiceBuffer(data);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);
  res.send(buffer);
}

module.exports = {
  createInvoiceBuffer,
  createInvoiceFile,
  sendInvoiceResponse,
};
