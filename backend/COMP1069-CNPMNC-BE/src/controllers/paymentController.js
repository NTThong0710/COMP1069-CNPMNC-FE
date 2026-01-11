const Payment = require('../models/Payment'); 

const paymentController = {

    // 1. TẠO ĐƠN HÀNG (Lưu vào MongoDB)
    createPayment: async (req, res) => {
        try {
            const { amount, content, userId, message } = req.body;

            // Tạo mã đơn ngẫu nhiên: MUSIC + 5 số
            const orderCode = `MUSIC${Math.floor(10000 + Math.random() * 90000)}`;

            // TẠO DOCUMENT MỚI
            // Lỗi cũ nằm ở đây: 'new Payment' cần biến Payment được khai báo ở dòng 1
            const newPayment = new Payment({
                orderCode,
                amount,
                content: content || `Thanh toan don hang ${orderCode}`,
                userId: userId || null,
                message: message || ""
            });

            // LƯU VÀO DB
            await newPayment.save();

            console.log(`[DB] Đã tạo đơn ${orderCode}`);

            return res.json({
                success: true,
                orderCode,
                qrUrl: `https://qr.sepay.vn/img?acc=0388100173&bank=VPBank&amount=${amount}&des=${orderCode}`
            });
        } catch (error) {
            console.error("Lỗi tạo Payment:", error); // Log chi tiết lỗi ra console
            return res.status(500).json({ success: false, message: "Lỗi Server" });
        }
    },

    // 2. WEBHOOK (Cập nhật trạng thái trong MongoDB)
    sepayWebhook: async (req, res) => {
        try {
            const { transferAmount, content, accountNumber } = req.body;

            // Tìm mã đơn hàng trong nội dung chuyển khoản
            const match = content.match(/MUSIC\d{5}/);

            if (match) {
                const orderCode = match[0];

                // Tìm đơn hàng trong DB (Dùng biến Payment đã sửa)
                const payment = await Payment.findOne({ orderCode, status: 'PENDING' });

                if (payment && transferAmount >= payment.amount) {

                    // CẬP NHẬT TRẠNG THÁI
                    payment.status = 'PAID';
                    payment.transactionInfo = req.body;
                    await payment.save();

                    console.log(`✅ [DB] Đơn hàng ${orderCode} đã thanh toán!`);
                }
            }
            return res.json({ success: true });
        } catch (error) {
            console.error("Webhook Error:", error);
            return res.json({ success: false });
        }
    },

    // 3. CHECK TRẠNG THÁI (Đọc từ MongoDB)
    checkStatus: async (req, res) => {
        try {
            const { orderCode } = req.params;
            // Dùng biến Payment đã sửa
            const payment = await Payment.findOne({ orderCode });

            if (payment && payment.status === 'PAID') {
                return res.json({ status: 'PAID', success: true });
            }
            return res.json({ status: 'PENDING', success: true });
        } catch (error) {
            console.error("Check Status Error:", error);
            return res.status(500).json({ success: false });
        }
    }
};

module.exports = paymentController;