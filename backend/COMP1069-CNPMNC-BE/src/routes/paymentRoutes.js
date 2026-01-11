const express = require("express");
const router = express.Router();

// Import Controller xử lý logic
// Đảm bảo bạn đã tạo file paymentController.js trong thư mục controllers rồi nhé
const paymentController = require("../controllers/paymentController");

// === CÁC ROUTE THANH TOÁN ===

// 1. Tạo đơn hàng mới & Lấy link QR
// Endpoint: POST /api/payment/create
router.post("/create", paymentController.createPayment);

// 2. Webhook nhận dữ liệu từ SePay (SePay sẽ gọi vào đây)
// Endpoint: POST /api/payment/webhook
router.post("/webhook", paymentController.sepayWebhook);

// 3. Kiểm tra trạng thái đơn hàng (Frontend polling)
// Endpoint: GET /api/payment/check/:orderCode
router.get("/check/:orderCode", paymentController.checkStatus);

module.exports = router;