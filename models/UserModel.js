import mongoose from "mongoose";

const UserModel = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatarURL: {
        type: String,
        default: '',
    }
}, {
    timestamps: true
});

export default mongoose.model('user', UserModel);