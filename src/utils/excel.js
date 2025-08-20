// utils/excel.js
const ExcelJS = require("exceljs");

/**
 * Xuất dữ liệu ra file Excel
 * @param {Array} data - Mảng object dữ liệu [{name, age, email}, ...]
 * @param {String} filePath - Đường dẫn lưu file Excel
 */
async function exportToExcel(data, filePath) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  // Tạo header từ key của object
  const columns = Object.keys(data[0] || {}).map((key) => ({
    header: key.toUpperCase(),
    key: key,
    width: 20,
  }));
  worksheet.columns = columns;

  // Ghi dữ liệu
  data.forEach((item) => {
    worksheet.addRow(item);
  });

  // Lưu file
  await workbook.xlsx.writeFile(filePath);
  return filePath;
}

/**
 * Đọc dữ liệu từ file Excel
 * @param {String} filePath - Đường dẫn file Excel
 * @returns {Array} - Mảng object dữ liệu
 */
async function readFromExcel(filePath) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.getWorksheet(1);

  const data = [];
  const headers = worksheet.getRow(1).values.slice(1); // Bỏ cột index 0

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Bỏ header
    const rowData = {};
    row.values.slice(1).forEach((val, i) => {
      rowData[headers[i]] = val;
    });
    data.push(rowData);
  });

  return data;
}

module.exports = {
  exportToExcel,
  readFromExcel,
};
