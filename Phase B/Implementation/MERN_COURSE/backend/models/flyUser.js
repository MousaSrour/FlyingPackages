const mongoose = require('mongoose');

const flyuserSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
    },
    isNew: {
        type: Boolean,
        default: false,
    },
    company: {
        type: String,
    },
});

// flyuserSchema.virtual('id').get(function () {
//     return this._id.toHexString();
// });

flyuserSchema.set('toJSON', {
    virtuals: true,
});

exports.flyUser = mongoose.model('flyUser', flyuserSchema);
exports.flyuserSchema = flyuserSchema;