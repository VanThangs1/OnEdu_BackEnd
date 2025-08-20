// src/config/momo.js
const crypto = require("crypto");
const axios = require("axios");

const momoConfig = {
  partnerCode: process.env.MOMO_PARTNER_CODE,
  accessKey: process.env.MOMO_ACCESS_KEY,
  secretKey: process.env.MOMO_SECRET_KEY,
  endpoint: "https://test-payment.momo.vn/v2/gateway/api/create",
  returnUrl: process.env.MOMO_RETURN_URL,   // nơi người dùng quay về sau khi thanh toán
  notifyUrl: process.env.MOMO_NOTIFY_URL,   // nơi MoMo gửi kết quả thanh toán (server callback)
};

// Hàm tạo chữ ký
function createSignature(rawData) {
  return crypto
    .createHmac("sha256", momoConfig.secretKey)
    .update(rawData)
    .digest("hex");
}

// Hàm tạo request thanh toán
async function createPayment({ orderId, amount, orderInfo }) {
  const requestId = Date.now().toString();

  const rawSignature = 
    "accessKey=" + momoConfig.accessKey +
    "&amount=" + amount +
    "&extraData=" +
    "&ipnUrl=" + momoConfig.notifyUrl +
    "&orderId=" + orderId +
    "&orderInfo=" + orderInfo +
    "&partnerCode=" + momoConfig.partnerCode +
    "&redirectUrl=" + momoConfig.returnUrl +
    "&requestId=" + requestId +
    "&requestType=captureWallet";

  const signature = createSignature(rawSignature);

  const body = {
    partnerCode: momoConfig.partnerCode,
    accessKey: momoConfig.accessKey,
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl: momoConfig.returnUrl,
    ipnUrl: momoConfig.notifyUrl,
    extraData: "",
    requestType: "captureWallet",
    signature,
    lang: "vi",
  };

  const response = await axios.post(momoConfig.endpoint, body);
  return response.data;
}

module.exports = { momoConfig, createPayment };
