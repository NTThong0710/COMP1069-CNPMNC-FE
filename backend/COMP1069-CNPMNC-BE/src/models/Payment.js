const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    // 1. Mã đơn hàng (Dùng để đối soát)
    orderCode: {
        type: String,
        required: true,
        unique: true
    },

    // 2. Số tiền
    amount: {
        type: Number,
        required: true
    },

    // 3. Nội dung chuyển khoản (Cái này hệ thống tự sinh ra: MUSICxxxxx)
    content: {
        type: String,
        default: ''
    },

    // 4. ===> THÊM CÁI NÀY: Lời nhắn của người dùng (VD: "Mời team ly cafe") <===
    message: {
        type: String,
        default: ''
    },

    // 5. Trạng thái
    status: {
        type: String,
        enum: ['PENDING', 'PAID', 'CANCELLED'],
        default: 'PENDING'
    },

    // 6. Info từ SePay trả về
    transactionInfo: {
        type: Object,
        default: null
    }

}, {
    timestamps: true,
    collection: 'payment'
});

module.exports = mongoose.model('Payment', PaymentSchema);