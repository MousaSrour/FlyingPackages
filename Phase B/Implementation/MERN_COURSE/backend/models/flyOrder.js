const mongoose = require('mongoose');



const flyOrderSchema = new mongoose.Schema({
    orderNumber: {
        type: Number,
        required: true,
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier'
    },
    courier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courier'
    },
    submitDate: {
        type: String,
        required: true,
    },
    submitHour: {
        type: String,
        required: true,
    },
    completedDate: {
        type: String,
    },
    customerPhoneNumber: {
        type: String,
    },
    origin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location'
    },
    destination: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location'
    },
    status:{
        type: String,
        enum: ['PENDING', 'IN DELIVERY','FINISHED','REJECTED'],
        default : 'PENDING',
    },
    startDeliveryTime: {
        type: Date,
        default: null,
    },
    deliveryTime: {
        type: Number,
        default: null,
    },
});

flyOrderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

flyOrderSchema.set('toJSON', {
    virtuals: true,
});

exports.flyOrder = mongoose.model('flyOrder', flyOrderSchema);
exports.flyOrderSchema = flyOrderSchema;