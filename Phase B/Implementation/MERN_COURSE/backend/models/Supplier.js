const mongoose = require('mongoose');




const supplierSchema = new mongoose.Schema({
    
    status: {
        type: String,
        enum: ['OK', 'WARNING'],
        default : 'OK',
    },
    ordersNo: {
        type: Number,
        required: true,
    },
    registirationDate: {
        type: Date,
        default : Date.now
    },
    companyName: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TheUsers'
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location'
    }

});

supplierSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

supplierSchema.set('toJSON', {
    virtuals: true,
});

exports.Supplier = mongoose.model('Supplier', supplierSchema);
//exports.supplierSchema = supplierSchema;