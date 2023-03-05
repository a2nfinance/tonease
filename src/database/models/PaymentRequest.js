import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let paymentRequest = new Schema({
    contractAddress: {
        type: String,
        required: true,
    },
    sender: {
        type: String,
        required: true
    },
    recipient: {
        type: String,
        required: true,
    },
    startDate: {
        type: Number,
        required: true,
    },
    whoCanCancel: {
        type: Number,
        required: true,
        default: 0
    },
    whoCanTransfer: {
        type: Number,
        required: true,
        default: 0
    },
    unlockAmountPerTime: {
        type: Number,
        required: true
    },
    unlockEvery: {
        type: Number,
        required: true,
        default: 1
    },
    numberOfUnlocks: {
        type: Number,
        required: true,
        default: 1
    },
    prepaidPercentage: {
        type: Number,
        required: true,
        default: 0
    },
    status: {
        type: Number,
        required: true,
        default: 1
    },
    
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});
let PaymentRequest = mongoose.model('PaymentRequest', paymentRequest);
mongoose.models = {};
export default PaymentRequest;